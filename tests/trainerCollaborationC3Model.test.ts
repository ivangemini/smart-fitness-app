import { describe, expect, it } from 'vitest';

import {
  parseTrainerCommentEnvelope,
  parseTrainerCommentsEnvelope,
  parseTrainerEvidenceEnvelope,
} from '../src/features/trainer/trainerCollaborationC3Model';

const RELATIONSHIP_ID = '11111111-1111-4111-8111-111111111111';
const OTHER_RELATIONSHIP_ID = '22222222-2222-4222-8222-222222222222';
const ITEM_ID = '33333333-3333-4333-8333-333333333333';

const comment = {
  schemaVersion: 1,
  id: ITEM_ID,
  relationshipId: RELATIONSHIP_ID,
  author: { role: 'trainer', displayName: 'Human trainer' },
  body: 'Keep the current weekly structure.',
  createdAt: '2026-08-24T08:00:00.000Z',
} as const;

describe('trainer collaboration C3 mobile contract', () => {
  it('parses a bounded workout-history projection', () => {
    const evidence = parseTrainerEvidenceEnvelope(
      {
        evidence: {
          schemaVersion: 1,
          relationshipId: RELATIONSHIP_ID,
          scope: 'workout_history_summary',
          data: [
            {
              sessionId: ITEM_ID,
              templateId: null,
              startedAt: '2026-08-24T07:00:00.000Z',
              endedAt: '2026-08-24T08:00:00.000Z',
              durationMinutes: 60,
              exerciseCount: 5,
              completedSetCount: 18,
              volume: 7210,
              notes: 'must not enter the parsed projection',
            },
          ],
        },
      },
      RELATIONSHIP_ID,
      'workout_history_summary',
    );

    expect(evidence.scope).toBe('workout_history_summary');
    expect(evidence.data[0]).toEqual({
      sessionId: ITEM_ID,
      templateId: null,
      startedAt: '2026-08-24T07:00:00.000Z',
      endedAt: '2026-08-24T08:00:00.000Z',
      durationMinutes: 60,
      exerciseCount: 5,
      completedSetCount: 18,
      volume: 7210,
    });
    expect(evidence.data[0]).not.toHaveProperty('notes');
  });

  it('parses progress and recovery without inventing additional authority', () => {
    const progress = parseTrainerEvidenceEnvelope(
      {
        evidence: {
          schemaVersion: 1,
          relationshipId: RELATIONSHIP_ID,
          scope: 'progress_summary',
          data: {
            weights: [
              {
                id: ITEM_ID,
                measuredAt: '2026-08-24T08:00:00.000Z',
                value: 75.5,
                unit: 'kg',
              },
            ],
            measurements: [],
          },
        },
      },
      RELATIONSHIP_ID,
      'progress_summary',
    );
    expect(progress.scope).toBe('progress_summary');
    if (progress.scope === 'progress_summary') {
      expect(progress.data.weights[0]?.value).toBe(75.5);
    }

    const recovery = parseTrainerEvidenceEnvelope(
      {
        evidence: {
          schemaVersion: 1,
          relationshipId: RELATIONSHIP_ID,
          scope: 'recovery_summary',
          data: [
            {
              id: ITEM_ID,
              recordedAt: '2026-08-24T08:00:00.000Z',
              sleepDurationHours: 8,
              sleepQuality: 4,
              fatigue: 2,
              soreness: 2,
              stress: 2,
              painInterference: 1,
              readiness: 4,
            },
          ],
        },
      },
      RELATIONSHIP_ID,
      'recovery_summary',
    );
    expect(recovery.scope).toBe('recovery_summary');
  });

  it('fails closed on evidence schema, relationship, or scope mismatch', () => {
    const base = {
      schemaVersion: 1,
      relationshipId: RELATIONSHIP_ID,
      scope: 'workout_templates',
      data: [],
    };
    expect(() =>
      parseTrainerEvidenceEnvelope({ evidence: { ...base, schemaVersion: 2 } }, RELATIONSHIP_ID, 'workout_templates'),
    ).toThrow();
    expect(() =>
      parseTrainerEvidenceEnvelope({ evidence: base }, OTHER_RELATIONSHIP_ID, 'workout_templates'),
    ).toThrow();
    expect(() =>
      parseTrainerEvidenceEnvelope({ evidence: base }, RELATIONSHIP_ID, 'training_programs'),
    ).toThrow();
  });

  it('accepts only human trainer comment provenance for the exact relationship', () => {
    expect(parseTrainerCommentEnvelope({ comment }, RELATIONSHIP_ID)).toEqual(comment);
    expect(parseTrainerCommentsEnvelope({ comments: [comment] }, RELATIONSHIP_ID)).toHaveLength(1);
    expect(() =>
      parseTrainerCommentEnvelope(
        { comment: { ...comment, author: { role: 'coach', displayName: 'AI' } } },
        RELATIONSHIP_ID,
      ),
    ).toThrow();
    expect(() => parseTrainerCommentEnvelope({ comment }, OTHER_RELATIONSHIP_ID)).toThrow();
  });

  it('rejects malformed ids, timestamps, and numeric evidence values', () => {
    expect(() =>
      parseTrainerCommentEnvelope(
        { comment: { ...comment, id: 'not-a-uuid' } },
        RELATIONSHIP_ID,
      ),
    ).toThrow();
    expect(() =>
      parseTrainerCommentEnvelope(
        { comment: { ...comment, createdAt: 'not-a-date' } },
        RELATIONSHIP_ID,
      ),
    ).toThrow();
    expect(() =>
      parseTrainerEvidenceEnvelope(
        {
          evidence: {
            schemaVersion: 1,
            relationshipId: RELATIONSHIP_ID,
            scope: 'workout_history_summary',
            data: [
              {
                sessionId: ITEM_ID,
                templateId: null,
                startedAt: '2026-08-24T07:00:00.000Z',
                endedAt: null,
                durationMinutes: 60,
                exerciseCount: Number.NaN,
                completedSetCount: 1,
                volume: 500,
              },
            ],
          },
        },
        RELATIONSHIP_ID,
        'workout_history_summary',
      ),
    ).toThrow();
  });
});
