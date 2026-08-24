import { describe, expect, it } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as {
  readFileSync(path: string, encoding: string): string;
};
const { resolve } = require('path') as {
  resolve(...parts: string[]): string;
};

const projectRoot = resolve(__dirname, '..');
const api = readFileSync(
  resolve(projectRoot, 'src/features/trainer/trainerCollaborationApi.ts'),
  'utf8',
);
const detail = readFileSync(
  resolve(projectRoot, 'src/features/trainer/TrainerCollaborationDetailScreen.tsx'),
  'utf8',
);
const list = readFileSync(
  resolve(projectRoot, 'src/features/trainer/TrainerCollaborationScreen.tsx'),
  'utf8',
);
const model = readFileSync(
  resolve(projectRoot, 'src/features/trainer/trainerCollaborationC3Model.ts'),
  'utf8',
);

describe('trainer collaboration C3 mobile authority boundary', () => {
  it('uses only relationship-scoped C3 evidence and comment endpoints', () => {
    expect(api).toContain('/evidence/${encodeURIComponent(scope)}`');
    expect(api).toContain('/comments`');
    expect(api).toContain('authorization: `Bearer ${accessToken}`');
    expect(api).toContain('parseTrainerEvidenceEnvelope(response, relationshipId, scope)');
    expect(api).toContain('parseTrainerCommentsEnvelope(response, relationshipId)');
    expect(api).toContain('parseTrainerCommentEnvelope(response, relationshipId)');
  });

  it('keeps comment writes explicit, trainer-only, and retry-idempotent', () => {
    expect(api).toContain('retry: false');
    expect(detail).toContain("relationship.role !== 'trainer'");
    expect(detail).toContain('const idempotencyKey = commentAttemptKey ?? Crypto.randomUUID()');
    expect(detail).toContain('setCommentAttemptKey(idempotencyKey)');
    expect(detail).toContain('body.length > 2000');
  });

  it('loads evidence lazily only for an active trainer and a granted scope', () => {
    expect(detail).toContain("relationship.status !== 'active'");
    expect(detail).toContain("relationship.role !== 'trainer'");
    expect(detail).toContain('!relationship.scopes.includes(scope)');
    expect(detail).toContain('api.loadEvidence(accessToken, relationship.id, scope)');
    expect(list).toContain("relationship.status === 'active'");
    expect(list).toContain("pathname: '/settings/trainer-collaboration/[relationshipId]'");
  });

  it('does not create a second fitness mutation, sync, Social, Coach, or storage path', () => {
    const combined = `${api}\n${detail}`;
    for (const forbidden of [
      '/v1/sync',
      '/v1/social',
      '/v1/coach',
      'useAppActions',
      'useAppContext',
      'scheduleStateMutation',
      'AsyncStorage',
      'SecureStore',
      'saveWorkout',
      'saveTrainingProgram',
      'updateWeight',
    ]) {
      expect(combined).not.toContain(forbidden);
    }
  });

  it('whitelists server evidence and verifies relationship, scope, and human provenance', () => {
    expect(model).toContain("throw new Error('Trainer evidence authority mismatch')");
    expect(model).toContain("throw new Error('Trainer comment authority mismatch')");
    expect(model).toContain("author.role !== 'trainer'");
    expect(model).not.toContain('notes:');
    expect(model).not.toContain('sessionData');
    expect(model).not.toContain('revision:');
    expect(model).not.toContain('deviceId');
  });
});
