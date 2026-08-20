import { describe, expect, it } from 'vitest';

import {
  KNOWLEDGE_LEARNING_STATE_SCHEMA_VERSION,
  parseKnowledgeLearningState,
  parseKnowledgeQuizSubmissionResult,
} from './index';

const state = {
  schemaVersion: KNOWLEDGE_LEARNING_STATE_SCHEMA_VERSION,
  articleId: '11111111-1111-4111-8111-111111111111',
  articleVersionId: '22222222-2222-4222-8222-222222222222',
  locale: 'en',
  version: 1,
  state: 'understood',
  evidenceState: 'understood',
  readAt: '2026-08-20T08:00:00.000Z',
  understoodAt: '2026-08-20T08:05:00.000Z',
  understoodQuizItemIds: ['33333333-3333-4333-8333-333333333333'],
  revision: 2,
  contentAvailable: true,
  latestArticleVersionId: '22222222-2222-4222-8222-222222222222',
  latestVersion: 1,
  refreshReason: null,
} as const;

describe('Knowledge learning parsers', () => {
  it('parses the strict server-authoritative learning projection', () => {
    expect(parseKnowledgeLearningState(state)).toEqual(state);
  });

  it('rejects unexpected fields instead of accepting a widened learning contract', () => {
    expect(() =>
      parseKnowledgeLearningState({ ...state, hiddenAnswer: 'option-a' }),
    ).toThrow();
  });

  it('parses quiz evaluation without requiring or exposing an answer key', () => {
    const result = {
      schemaVersion: KNOWLEDGE_LEARNING_STATE_SCHEMA_VERSION,
      passed: true,
      correctCount: 1,
      totalCount: 1,
      evaluations: [
        {
          quizItemId: '33333333-3333-4333-8333-333333333333',
          correct: true,
          feedback: 'This matches the reviewed article claim.',
        },
      ],
      learningState: state,
    } as const;

    expect(parseKnowledgeQuizSubmissionResult(result)).toEqual(result);
    expect(JSON.stringify(parseKnowledgeQuizSubmissionResult(result))).not.toContain(
      'correctOption',
    );
  });
});
