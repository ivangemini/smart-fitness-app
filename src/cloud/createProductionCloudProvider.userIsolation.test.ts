import { describe, expect, it, vi } from 'vitest';

import type { ApiClient, ApiRequestOptions } from '@/api/client';
import type { AuthService } from '@/auth';
import { normalizeOfflineSyncQueueOperation } from './CloudQueueHelpers';
import type { SyncBatch, SyncOperation } from './CloudSyncTypes';
import { toOfflineSyncQueueSyncOperation } from './CloudQueueHelpers';
import { createProductionCloudProvider } from './createProductionCloudProvider';

const userId = '11111111-1111-4111-8111-111111111111';
const otherUserId = '99999999-9999-4999-8999-999999999999';
const deviceId = '22222222-2222-4222-8222-222222222222';

const authService: Pick<
  AuthService,
  'getAccessToken' | 'refresh' | 'getCurrentSession'
> = {
  async getAccessToken() {
    return 'access-token';
  },
  async refresh() {
    return null;
  },
  async getCurrentSession() {
    return {
      user: {
        id: userId,
        email: 'user@example.com',
        displayName: null,
        avatarUrl: null,
        createdAt: '2026-07-22T08:00:00.000Z',
        updatedAt: '2026-07-22T08:00:00.000Z',
      },
      device: {
        id: deviceId,
        userId,
        deviceName: 'iPhone',
        platform: 'ios',
        appVersion: '1.0.0',
        lastSeenAt: '2026-07-22T08:00:00.000Z',
      },
      session: {
        id: '33333333-3333-4333-8333-333333333333',
        userId,
        deviceId,
        expiresAt: '2026-08-22T08:00:00.000Z',
        revokedAt: null,
      },
      tokens: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        tokenType: 'Bearer',
      },
    };
  },
};

const makeOperation = (
  id: string,
  operationUserId?: string,
): SyncOperation => ({
  id,
  entity: 'workoutSessions',
  entityId: id,
  action: 'upsert',
  payload: { id },
  metadata: {
    requestId: `queue:${id}`,
    ...(operationUserId ? { userId: operationUserId } : {}),
  },
  createdAt: '2026-07-22T10:00:00.000Z',
});

const makeBatch = (operations: SyncOperation[]): SyncBatch => ({
  id: 'batch-1',
  operations,
  createdAt: '2026-07-22T10:00:00.000Z',
});

describe('production sync provider user isolation', () => {
  it('sends only current-user operations and excludes unowned or another-user operations', async () => {
    const requests: ApiRequestOptions[] = [];
    const apiClient = {
      async request(options: ApiRequestOptions) {
        requests.push(options);
        return {
          revision: 1,
          appliedOperations: [],
          conflicts: [],
          duplicateIdempotencyKeys: [],
          serverTimestamp: '2026-07-22T10:00:01.000Z',
        };
      },
    } as unknown as ApiClient;
    const provider = createProductionCloudProvider({
      apiClient,
      authService,
      cursorStore: { async get() { return null; } },
    });

    await provider.pushOperations(
      makeBatch([
        makeOperation('44444444-4444-4444-8444-444444444444', userId),
        makeOperation('55555555-5555-4555-8555-555555555555'),
        makeOperation('66666666-6666-4666-8666-666666666666', otherUserId),
      ]),
    );

    const body = requests[0]?.body as {
      operations: Array<{ entityId: string }>;
    };
    expect(body.operations.map((operation) => operation.entityId)).toEqual([
      '44444444-4444-4444-8444-444444444444',
    ]);
  });

  it('does not call the backend when every queued operation is unowned or belongs to another user', async () => {
    const request = vi.fn();
    const provider = createProductionCloudProvider({
      apiClient: { request } as unknown as ApiClient,
      authService,
      cursorStore: { async get() { return null; } },
      now: () => '2026-07-22T10:00:01.000Z',
    });

    const result = await provider.pushOperations(
      makeBatch([
        makeOperation('55555555-5555-4555-8555-555555555555'),
        makeOperation('66666666-6666-4666-8666-666666666666', otherUserId),
      ]),
    );

    expect(request).not.toHaveBeenCalled();
    expect(result.pendingOperations).toBe(2);
    expect(result.appliedOperations).toBeUndefined();
  });

  it('preserves actorId as user provenance when normalizing legacy queue entries', () => {
    const normalized = normalizeOfflineSyncQueueOperation({
      opId: 'workoutSessions:77777777-7777-4777-8777-777777777777',
      entityType: 'workoutSessions',
      entityId: '77777777-7777-4777-8777-777777777777',
      action: 'update',
      actorId: userId,
      idempotencyKey: 'legacy-key',
      payload: { id: '77777777-7777-4777-8777-777777777777' },
      clientTimestamp: '2026-07-22T10:00:00.000Z',
      retryCount: 0,
      status: 'pending',
    });

    expect(normalized?.metadata?.userId).toBe(userId);
    expect(normalized ? toOfflineSyncQueueSyncOperation(normalized).metadata?.userId : null).toBe(userId);
  });
});
