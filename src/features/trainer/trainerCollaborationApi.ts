import type { ApiClient } from '@/api/client';

import {
  parseTrainerRelationshipEnvelope,
  parseTrainerRelationshipsEnvelope,
  type TrainerReadScope,
  type TrainerRelationship,
} from './trainerCollaborationModel';

export type TrainerCollaborationApi = {
  listRelationships(accessToken: string): Promise<TrainerRelationship[]>;
  createInvitation(
    accessToken: string,
    input: { trainerUserId: string; scopes: readonly TrainerReadScope[] },
  ): Promise<TrainerRelationship>;
  acceptInvitation(accessToken: string, relationshipId: string): Promise<TrainerRelationship>;
  revokeRelationship(accessToken: string, relationshipId: string): Promise<TrainerRelationship>;
};

const authHeaders = (accessToken: string) => ({
  authorization: `Bearer ${accessToken}`,
});

export const createTrainerCollaborationApi = (apiClient: ApiClient): TrainerCollaborationApi => ({
  async listRelationships(accessToken) {
    const response = await apiClient.get<unknown>('/v1/trainer/relationships', {
      headers: authHeaders(accessToken),
    });
    return parseTrainerRelationshipsEnvelope(response);
  },

  async createInvitation(accessToken, input) {
    const response = await apiClient.post<unknown, typeof input>(
      '/v1/trainer/invitations',
      input,
      {
        headers: authHeaders(accessToken),
        retry: false,
      },
    );
    return parseTrainerRelationshipEnvelope(response);
  },

  async acceptInvitation(accessToken, relationshipId) {
    const response = await apiClient.post<unknown, Record<string, never>>(
      `/v1/trainer/invitations/${encodeURIComponent(relationshipId)}/accept`,
      {},
      {
        headers: authHeaders(accessToken),
        retry: false,
      },
    );
    return parseTrainerRelationshipEnvelope(response);
  },

  async revokeRelationship(accessToken, relationshipId) {
    const response = await apiClient.post<unknown, Record<string, never>>(
      `/v1/trainer/relationships/${encodeURIComponent(relationshipId)}/revoke`,
      {},
      {
        headers: authHeaders(accessToken),
        retry: false,
      },
    );
    return parseTrainerRelationshipEnvelope(response);
  },
});
