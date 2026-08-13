import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getMobileApiBaseUrl } from '@/api';
import { createApiClient } from '@/api/client';
import { useAuthSession } from '@/hooks/useAuthSession';
import {
  createRemoteLabsRepository,
  type LabDraftReviewAction,
  type RemoteLabsRepository,
} from '@/repositories/RemoteLabsRepository';

import { uploadLabPhoto, type LabPhotoAsset } from './labPhotoUpload';
import type {
  LabCapabilitiesDto,
  LabDocumentDto,
  LabResultDto,
  LabResultDraftDto,
  LabReviewBundleDto,
} from './types';

const UNAVAILABLE_CAPABILITIES: LabCapabilitiesDto = {
  uploadConfigured: false,
  processingAvailable: false,
  importAvailable: false,
  reviewRequired: true,
};

export type LabsContextValue = {
  capabilities: LabCapabilitiesDto;
  documents: LabDocumentDto[];
  markers: LabResultDto[];
  loading: boolean;
  uploading: boolean;
  error: 'load_failed' | null;
  refresh(): Promise<void>;
  uploadPhoto(asset: LabPhotoAsset): Promise<string>;
  getDocument(documentId: string): LabDocumentDto | null;
  getReview(documentId: string): Promise<LabReviewBundleDto>;
  reviewDraft(
    documentId: string,
    draftId: string,
    action: LabDraftReviewAction,
  ): Promise<LabResultDraftDto>;
  confirmDocument(documentId: string, collectedAt: string): Promise<LabDocumentDto>;
  getDocumentResults(documentId: string): Promise<LabResultDto[]>;
  getMarkerHistory(markerId: string, limit?: number): Promise<LabResultDto[]>;
};

const LabsContext = createContext<LabsContextValue | null>(null);

export function LabsProvider({ children }: PropsWithChildren) {
  const { isAuthenticated, ready, refresh: refreshAuth, session } = useAuthSession();
  const [capabilities, setCapabilities] = useState<LabCapabilitiesDto>(UNAVAILABLE_CAPABILITIES);
  const [documents, setDocuments] = useState<LabDocumentDto[]>([]);
  const [markers, setMarkers] = useState<LabResultDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<LabsContextValue['error']>(null);
  const apiClient = useMemo(
    () => createApiClient({ baseUrl: getMobileApiBaseUrl() }),
    [],
  );
  const repository = useMemo<RemoteLabsRepository>(
    () =>
      createRemoteLabsRepository(apiClient, {
        getAccessToken: async () => session?.tokens.accessToken ?? null,
        refreshAccessToken: async () =>
          (await refreshAuth())?.tokens.accessToken ?? null,
      }),
    [apiClient, refreshAuth, session?.tokens.accessToken],
  );

  const refresh = useCallback(async () => {
    if (!ready || !isAuthenticated) {
      setCapabilities(UNAVAILABLE_CAPABILITIES);
      setDocuments([]);
      setMarkers([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [nextCapabilities, nextDocuments, nextMarkers] = await Promise.all([
        repository.getCapabilities(),
        repository.listDocuments(),
        repository.listMarkers(),
      ]);
      setCapabilities(nextCapabilities);
      setDocuments(nextDocuments);
      setMarkers(nextMarkers);
      setError(null);
    } catch {
      setCapabilities(UNAVAILABLE_CAPABILITIES);
      setError('load_failed');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, ready, repository]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const uploadPhoto = useCallback(
    async (asset: LabPhotoAsset): Promise<string> => {
      if (!capabilities.importAvailable) {
        throw new Error('LAB_IMPORT_UNAVAILABLE');
      }
      setUploading(true);
      try {
        const result = await uploadLabPhoto(asset, repository);
        await refresh();
        return result.documentId;
      } finally {
        setUploading(false);
      }
    },
    [capabilities.importAvailable, refresh, repository],
  );

  const getDocument = useCallback(
    (documentId: string) =>
      documents.find((document) => document.id === documentId) ?? null,
    [documents],
  );

  const value = useMemo<LabsContextValue>(
    () => ({
      capabilities,
      documents,
      markers,
      loading,
      uploading,
      error,
      refresh,
      uploadPhoto,
      getDocument,
      getReview: (documentId) => repository.getReview(documentId),
      reviewDraft: (documentId, draftId, action) =>
        repository.reviewDraft(documentId, draftId, action),
      confirmDocument: async (documentId, collectedAt) => {
        const document = await repository.confirmDocument(documentId, collectedAt);
        setDocuments((current) =>
          current.map((entry) => (entry.id === document.id ? document : entry)),
        );
        return document;
      },
      getDocumentResults: (documentId) => repository.getDocumentResults(documentId),
      getMarkerHistory: (markerId, limit) => repository.getMarkerHistory(markerId, limit),
    }),
    [
      capabilities,
      documents,
      error,
      getDocument,
      loading,
      markers,
      refresh,
      repository,
      uploadPhoto,
      uploading,
    ],
  );

  return <LabsContext.Provider value={value}>{children}</LabsContext.Provider>;
}

export function useLabs() {
  const value = useContext(LabsContext);
  if (!value) throw new Error('useLabs must be used inside LabsProvider');
  return value;
}
