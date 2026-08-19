import { describe, expect, it } from 'vitest';

import {
  COACH_QUESTION_ANSWER_SCHEMA_VERSION,
  parseCoachQuestionResponse,
} from './questions';

const answered = {
  schemaVersion: 1,
  status: 'answered',
  intent: 'goal_progress',
  scopes: ['goal'],
  answer: {
    schemaVersion: COACH_QUESTION_ANSWER_SCHEMA_VERSION,
    answer: 'Your recorded goal evidence is limited but available.',
    evidenceScopes: ['goal'],
    evidenceSummary: ['Target weight and recent recorded weight were available.'],
    caveatCodes: ['limited_history'],
    dataQuality: 'limited',
    confidence: 0.6,
  },
} as const;

describe('parseCoachQuestionResponse', () => {
  it('parses an exact answered goal response', () => {
    expect(parseCoachQuestionResponse(answered)).toEqual(answered);
  });

  it('parses a typed unsupported response', () => {
    expect(
      parseCoachQuestionResponse({
        schemaVersion: 1,
        status: 'unsupported',
        reason: 'insufficient_question_detail',
      }),
    ).toEqual({
      schemaVersion: 1,
      status: 'unsupported',
      reason: 'insufficient_question_detail',
    });
  });

  it('rejects unknown top-level and answer fields', () => {
    expect(() => parseCoachQuestionResponse({ ...answered, privatePayload: true })).toThrow();
    expect(() =>
      parseCoachQuestionResponse({
        ...answered,
        answer: { ...answered.answer, hiddenReasoning: 'nope' },
      }),
    ).toThrow();
  });

  it('rejects stale answer schemas and evidence outside approved scopes', () => {
    expect(() =>
      parseCoachQuestionResponse({
        ...answered,
        answer: { ...answered.answer, schemaVersion: 'coach-question-answer-v2' },
      }),
    ).toThrow();
    expect(() =>
      parseCoachQuestionResponse({
        ...answered,
        answer: { ...answered.answer, evidenceScopes: ['nutrition'] },
      }),
    ).toThrow();
  });

  it('rejects broadened goal-progress routes and duplicate scopes', () => {
    expect(() =>
      parseCoachQuestionResponse({
        ...answered,
        scopes: ['goal', 'nutrition'],
      }),
    ).toThrow();
    expect(() =>
      parseCoachQuestionResponse({
        ...answered,
        intent: 'cross_domain_review',
        scopes: ['goal', 'goal'],
      }),
    ).toThrow();
  });
});
