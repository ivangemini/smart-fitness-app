import { describe, expect, it } from 'vitest';

import type { KnowledgeLearningState } from '@/api/knowledge/learningContracts';

import { canSubmitKnowledgeQuiz } from './knowledgeLearningPolicy';

const READ_STATE: KnowledgeLearningState = {
  schemaVersion: 'knowledge-learning-state-v1',
  articleId: '11111111-1111-4111-8111-111111111111',
  articleVersionId: '22222222-2222-4222-8222-222222222222',
  locale: 'en',
  version: 1,
  state: 'read',
  evidenceState: 'read',
  readAt: '2026-08-20T10:00:00.000Z',
  understoodAt: null,
  understoodQuizItemIds: [],
  revision: 1,
  contentAvailable: true,
  latestArticleVersionId: '22222222-2222-4222-8222-222222222222',
  latestVersion: 1,
  refreshReason: null,
};

describe('Knowledge quiz readiness policy', () => {
  it('requires confirmed exact-version read evidence', () => {
    expect(
      canSubmitKnowledgeQuiz({ learningState: null, pendingRead: false }),
    ).toBe(false);
    expect(
      canSubmitKnowledgeQuiz({
        learningState: {
          ...READ_STATE,
          state: 'unseen',
          evidenceState: null,
          readAt: null,
          revision: 0,
        },
        pendingRead: false,
      }),
    ).toBe(false);
    expect(
      canSubmitKnowledgeQuiz({ learningState: READ_STATE, pendingRead: false }),
    ).toBe(true);
  });

  it('does not treat queued transport or unavailable content as quiz authority', () => {
    expect(
      canSubmitKnowledgeQuiz({ learningState: READ_STATE, pendingRead: true }),
    ).toBe(false);
    expect(
      canSubmitKnowledgeQuiz({
        learningState: {
          ...READ_STATE,
          state: 'refresh_useful',
          contentAvailable: false,
          latestArticleVersionId: '33333333-3333-4333-8333-333333333333',
          latestVersion: 2,
          refreshReason: 'newer_published_version',
        },
        pendingRead: false,
      }),
    ).toBe(false);
  });

  it('keeps a confirmed understood current version eligible for reviewed replay', () => {
    expect(
      canSubmitKnowledgeQuiz({
        learningState: {
          ...READ_STATE,
          state: 'understood',
          evidenceState: 'understood',
          understoodAt: '2026-08-20T10:05:00.000Z',
          understoodQuizItemIds: [
            '44444444-4444-4444-8444-444444444444',
          ],
          revision: 2,
        },
        pendingRead: false,
      }),
    ).toBe(true);
  });
});
