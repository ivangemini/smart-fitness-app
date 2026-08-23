import { describe, expect, it } from 'vitest';

import {
  parseTrainerRelationship,
  parseTrainerRelationshipsEnvelope,
  toTrainerRelationshipView,
  toggleTrainerScope,
} from '../src/features/trainer/trainerCollaborationModel';

const relationship = {
  schemaVersion: 1,
  id: '11111111-1111-4111-8111-111111111111',
  client: {
    userId: '22222222-2222-4222-8222-222222222222',
    displayName: 'Client',
  },
  trainer: {
    userId: '33333333-3333-4333-8333-333333333333',
    displayName: 'Trainer',
  },
  status: 'invited',
  scopes: ['progress_summary', 'workout_templates'],
  createdAt: '2026-08-24T00:00:00.000Z',
  acceptedAt: null,
  revokedAt: null,
} as const;

describe('trainer collaboration mobile contract', () => {
  it('parses the reviewed v1 relationship and canonicalizes scope order', () => {
    const parsed = parseTrainerRelationship(relationship);
    expect(parsed.status).toBe('invited');
    expect(parsed.scopes).toEqual(['workout_templates', 'progress_summary']);
  });

  it('fails closed on unknown scopes, statuses and schema versions', () => {
    expect(() =>
      parseTrainerRelationship({ ...relationship, scopes: ['labs_results'] }),
    ).toThrow();
    expect(() =>
      parseTrainerRelationship({ ...relationship, status: 'approved' }),
    ).toThrow();
    expect(() =>
      parseTrainerRelationship({ ...relationship, schemaVersion: 2 }),
    ).toThrow();
  });

  it('rejects malformed relationship envelopes', () => {
    expect(() => parseTrainerRelationshipsEnvelope({ relationships: relationship })).toThrow();
    expect(() => parseTrainerRelationshipsEnvelope({ relationships: [relationship] })).not.toThrow();
  });

  it('derives role only from the authenticated account identity', () => {
    const parsed = parseTrainerRelationship(relationship);
    expect(
      toTrainerRelationshipView(parsed, relationship.client.userId)?.role,
    ).toBe('client');
    expect(
      toTrainerRelationshipView(parsed, relationship.trainer.userId)?.role,
    ).toBe('trainer');
    expect(
      toTrainerRelationshipView(parsed, '44444444-4444-4444-8444-444444444444'),
    ).toBeNull();
  });

  it('toggles only allowlisted scopes in canonical order', () => {
    expect(toggleTrainerScope([], 'progress_summary')).toEqual(['progress_summary']);
    expect(
      toggleTrainerScope(['progress_summary'], 'workout_history_summary'),
    ).toEqual(['workout_history_summary', 'progress_summary']);
    expect(toggleTrainerScope(['progress_summary'], 'progress_summary')).toEqual([]);
  });
});
