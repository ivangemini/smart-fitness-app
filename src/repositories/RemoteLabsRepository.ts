import { isApiError, type ApiClient } from '@/api/client';
import type {
  LabCapabilitiesDto,
  LabDocumentDto,
  LabResultDto,
  LabResultDraftDto,
  LabReviewBundleDto,
  LabUploadEnvelope,
} from '@/features/labs/types';

export type LabDraftReviewAction =
  | { action: 'accept' }
  | { action: 'exclude' }
  | {
      action: 'correct';
      sourceLabel: string;
      sourceValue: number;
      sourceUnit: string;
      sourceReferenceText?: string;
      referenceInterval?: {
        low?: number;
        high?: number;
        unit: string;
      };
    };

export type LabsAuthGateway = {
  getAccessToken(): Promise<string | null>;
  refreshAccessToken(): Promise<string | null>;
};

export type RemoteLabsRepository = {
  getCapabilities(): Promise<LabCapabilitiesDto>;
  listDocuments(): Promise<LabDocumentDto[]>;
  listMarkers(limit?: number): Promise<LabResultDto[]>;
  createUpload(input: {
    fileName: string;
    mediaType: 'application/pdf' | 'image/jpeg' | 'image/png' | 'image/heic';
    byteSize: number;
  }): Promise<LabUploadEnvelope>;
  completeUpload(documentId: string): Promise<LabDocumentDto>;
  retryDocument(documentId: string): Promise<LabDocumentDto>;
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

export class LabsAuthenticationRequiredError extends Error {
  constructor() {
    super('Authentication is required for Labs');
    this.name = 'LabsAuthenticationRequiredError';
  }
}

const authHeader = (token: string): Record<string, string> => ({
  authorization: `Bearer ${token}`,
});

export const createRemoteLabsRepository = (
  apiClient: ApiClient,
  auth: LabsAuthGateway,
): RemoteLabsRepository => {
  const withAuth = async <Result>(
    operation: (token: string) => Promise<Result>,
  ): Promise<Result> => {
    const accessToken = await auth.getAccessToken();
    if (!accessToken) throw new LabsAuthenticationRequiredError();

    try {
      return await operation(accessToken);
    } catch (error) {
      if (!isApiError(error) || error.status !== 401) throw error;
      const refreshedToken = await auth.refreshAccessToken();
      if (!refreshedToken) throw new LabsAuthenticationRequiredError();
      return operation(refreshedToken);
    }
  };

  return {
    getCapabilities() {
      return withAuth((token) =>
        apiClient.get<LabCapabilitiesDto>('/v1/labs/capabilities', {
          headers: authHeader(token),
          retry: false,
        }),
      );
    },
    async listDocuments() {
      const response = await withAuth((token) =>
        apiClient.get<{ documents: LabDocumentDto[] }>('/v1/labs/documents', {
          headers: authHeader(token),
          retry: false,
        }),
      );
      return response.documents;
    },
    async listMarkers(limit = 100) {
      const response = await withAuth((token) =>
        apiClient.get<{ markers: LabResultDto[] }>('/v1/labs/markers', {
          headers: authHeader(token),
          query: { limit },
          retry: false,
        }),
      );
      return response.markers;
    },
    createUpload(input) {
      return withAuth((token) =>
        apiClient.post<LabUploadEnvelope, typeof input>('/v1/labs/documents/uploads', input, {
          headers: authHeader(token),
          retry: false,
        }),
      );
    },
    async completeUpload(documentId) {
      const response = await withAuth((token) =>
        apiClient.post<{ document: LabDocumentDto }, undefined>(
          `/v1/labs/documents/${encodeURIComponent(documentId)}/upload-complete`,
          undefined,
          { headers: authHeader(token), retry: false },
        ),
      );
      return response.document;
    },
    async retryDocument(documentId) {
      const response = await withAuth((token) =>
        apiClient.post<{ document: LabDocumentDto }, undefined>(
          `/v1/labs/documents/${encodeURIComponent(documentId)}/retry`,
          undefined,
          { headers: authHeader(token), retry: false },
        ),
      );
      return response.document;
    },
    getReview(documentId) {
      return withAuth((token) =>
        apiClient.get<LabReviewBundleDto>(
          `/v1/labs/documents/${encodeURIComponent(documentId)}/review`,
          { headers: authHeader(token), retry: false },
        ),
      );
    },
    async reviewDraft(documentId, draftId, action) {
      const response = await withAuth((token) =>
        apiClient.patch<{ result: LabResultDraftDto }, LabDraftReviewAction>(
          `/v1/labs/documents/${encodeURIComponent(documentId)}/results/${encodeURIComponent(draftId)}`,
          action,
          { headers: authHeader(token), retry: false },
        ),
      );
      return response.result;
    },
    async confirmDocument(documentId, collectedAt) {
      const response = await withAuth((token) =>
        apiClient.post<{ document: LabDocumentDto }, { collectedAt: string }>(
          `/v1/labs/documents/${encodeURIComponent(documentId)}/confirm`,
          { collectedAt },
          { headers: authHeader(token), retry: false },
        ),
      );
      return response.document;
    },
    async getDocumentResults(documentId) {
      const response = await withAuth((token) =>
        apiClient.get<{ results: LabResultDto[] }>(
          `/v1/labs/documents/${encodeURIComponent(documentId)}/results`,
          { headers: authHeader(token), retry: false },
        ),
      );
      return response.results;
    },
    async getMarkerHistory(markerId, limit = 200) {
      const response = await withAuth((token) =>
        apiClient.get<{ results: LabResultDto[] }>(
          `/v1/labs/markers/${encodeURIComponent(markerId)}/history`,
          { headers: authHeader(token), query: { limit }, retry: false },
        ),
      );
      return response.results;
    },
  };
};
