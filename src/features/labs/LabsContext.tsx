import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

import {
  loadLabInterpretationCapability,
  runLabInterpretation,
  type LabInterpretationState,
} from './labInterpretationState';
import { uploadLabPhoto, type LabPhotoAsset } from './labPhotoUpload';
import type {
  LabCapabilitiesDto,
  LabDocumentDto,
  LabPanelComparisonDto,
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

const IDLE_INTERPRETATION: LabInterpretationState = {
  status: 'idle',
  available: null,
  interpretation: null,
};

export type LabsContextValue = {
  capabilities: LabCapabilitiesDto;
  documents: LabDocumentDto[];
  markers: LabResultDto[];
  interpretationState: LabInterpretationState;
  interpretationDocumentId: string | null;
  loading: boolean;
  uploading: boolean;
  error: 'load_failed' | null;
  refresh(): Promise<void>;
  refreshInterpretationCapability(): Promise<LabInterpretationState>;
  interpretDocument(documentId: string): Promise<LabInterpretationState>;
  uploadPhoto(asset: LabPhotoAsset): Promise<string>;
  retryDocument(documentId: string): Promise<LabDocumentDto>;
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
  comparePanels(
    previousDocumentId: string,
    currentDocumentId: string,
  ): Promise<LabPanelComparisonDto>;
};

const LabsContext = createContext<LabsContextValue | null>(null);

export function LabsProvider({ children }: PropsWithChildren) {
  const { isAuthenticated, ready, refresh: refreshAuth, session } = useAuthSession();
  const [capabilities, setCapabilities] = useState<LabCapabilitiesDto>(UNAVAILABLE_CAPABILITIES);
  const [documents, setDocuments] = useState<LabDocumentDto[]>([]);
  const [markers, setMarkers] = useState<LabResultDto[]>([]);
  const [interpretationState, setInterpretationState] =
    useState<LabInterpretationState>(IDLE_INTERPRETATION);
  const [interpretationDocumentId, setInterpretationDocumentId] = useState<string | null>(
    null,
  );
  const interpretationRequestGeneration = useRef(0);
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

  const invalidateInterpretationRequests = useCallback(() => {
    interpretationRequestGeneration.current += 1;
    return interpretationRequestGeneration.current;
  }, []);

  const resetInterpretation = useCallback(() => {
    invalidateInterpretationRequests();
    setInterpretationState(IDLE_INTERPRETATION);
    setInterpretationDocumentId(null);
  }, [invalidateInterpretationRequests]);

  const refreshInterpretationCapability = useCallback(async () => {
    if (!ready || !isAuthenticated) {
      resetInterpretation();
      return IDLE_INTERPRETATION;
    }

    const generation = invalidateInterpretationRequests();
    const nextState = await loadLabInterpretationCapability(repository);
    if (interpretationRequestGeneration.current === generation) {
      setInterpretationState(nextState);
      setInterpretationDocumentId(null);
    }
    return nextState;
  }, [
    invalidateInterpretationRequests,
    isAuthenticated,
    ready,
    repository,
    resetInterpretation,
  ]);

  const refresh = useCallback(async () => {
    if (!ready || !isAuthenticated) {
      setCapabilities(UNAVAILABLE_CAPABILITIES);
      setDocuments([]);
      setMarkers([]);
      resetInterpretation();
      setError(null);
      setLoading(false);
      return;
    }

    const interpretationGeneration = invalidateInterpretationRequests();
    setLoading(true);
    try {
      const [nextCapabilities, nextDocuments, nextMarkers, nextInterpretationState] =
        await Promise.all([
          repository.getCapabilities(),
          repository.listDocuments(),
          repository.listMarkers(),
          loadLabInterpretationCapability(repository),
        ]);
      setCapabilities(nextCapabilities);
      setDocuments(nextDocuments);
      setMarkers(nextMarkers);
      if (interpretationRequestGeneration.current === interpretationGeneration) {
        setInterpretationState(nextInterpretationState);
        setInterpretationDocumentId(null);
      }
      setError(null);
    } catch {
      setCapabilities(UNAVAILABLE_CAPABILITIES);
      if (interpretationRequestGeneration.current === interpretationGeneration) {
        setInterpretationState({
          status: 'unavailable',
          available: false,
          interpretation: null,
        });
        setInterpretationDocumentId(null);
      }
      setError('load_failed');
    } finally {
      setLoading(false);
    }
  }, [
    invalidateInterpretationRequests,
    isAuthenticated,
    ready,
    repository,
    resetInterpretation,
  ]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const interpretDocument = useCallback(
    async (documentId: string): Promise<LabInterpretationState> => {
      if (interpretationState.available !== true) {
        invalidateInterpretationRequests();
        const unavailableState: LabInterpretationState = {
          status: 'unavailable',
          available: false,
          interpretation: null,
        };
        setInterpretationState(unavailableState);
        setInterpretationDocumentId(null);
        return unavailableState;
      }

      const previous =
        interpretationDocumentId === documentId ? interpretationState.interpretation : null;
      const generation = invalidateInterpretationRequests();
      setInterpretationDocumentId(documentId);
      setInterpretationState({
        status: 'running',
        available: true,
        interpretation: previous,
      });
      const nextState = await runLabInterpretation(repository, documentId, previous);
      if (interpretationRequestGeneration.current === generation) {
        setInterpretationState(nextState);
      }
      return nextState;
    },
    [
      interpretationDocumentId,
      interpretationState,
      invalidateInterpretationRequests,
      repository,
    ],
  );

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

  const retryDocument = useCallback(
    async (documentId: string): Promise<LabDocumentDto> => {
      if (!capabilities.processingAvailable) {
        throw new Error('LAB_PROCESSING_UNAVAILABLE');
      }
      const document = await repository.retryDocument(documentId);
      setDocuments((current) =>
        current.map((entry) => (entry.id === document.id ? document : entry)),
      );
      return document;
    },
    [capabilities.processingAvailable, repository],
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
      interpretationState,
      interpretationDocumentId,
      loading,
      uploading,
      error,
      refresh,
      refreshInterpretationCapability,
      interpretDocument,
      uploadPhoto,
      retryDocument,
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
      comparePanels: (previousDocumentId, currentDocumentId) =>
        repository.comparePanels(previousDocumentId, currentDocumentId),
    }),
    [
      capabilities,
      documents,
      error,
      getDocument,
      interpretDocument,
      interpretationDocumentId,
      interpretationState,
      loading,
      markers,
      refresh,
      refreshInterpretationCapability,
      repository,
      retryDocument,
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
