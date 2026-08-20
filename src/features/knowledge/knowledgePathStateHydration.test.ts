import { describe, expect, it } from 'vitest';

import type { KnowledgeLearningState } from '@/api/knowledge';
import {
  KNOWLEDGE_PATH_STATE_LIST_LIMIT,
  getKnowledgePathExactStateFallbackIds,
} from './knowledgePathStateHydration';

const state = (articleVersionId: string): KnowledgeLearningState => ({
  schemaVersion: 'knowledge-learning-state-v1',
  articleId: '11111111-1111-4111-8111-111111111111',
  articleVersionId,
  locale: 'en',
  version: 1,
  state: 'read',
  evidenceState: 'read',
  readAt: '2026-08-20T18:00:00.000Z',
  understoodAt: null,
  understoodQuizItemIds: [],
  revision: 1,
  contentAvailable: true,
  latestArticleVersionId: articleVersionId,
  latestVersion: 1,
  refreshReason: null,
});

describe('getKnowledgePathExactStateFallbackIds', () => {
  it('treats a non-saturated list as complete positive learning evidence', () => {
    expect(
      getKnowledgePathExactStateFallbackIds({
        requestedArticleVersionIds: [
          '22222222-2222-4222-8222-222222222222',
        ],
        listedStates: [],
      }),
    ).toEqual([]);
  });

  it('requests missing exact versions when the bounded list may be truncated', () => {
    const listedStates = Array.from(
      { length: KNOWLEDGE_PATH_STATE_LIST_LIMIT },
      (_, index) =>
        state(
          `00000000-0000-4000-8000-${index.toString().padStart(12, '0')}`,
        ),
    );
    const missing = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

    expect(
      getKnowledgePathExactStateFallbackIds({
        requestedArticleVersionIds: [missing, missing],
        listedStates,
      }),
    ).toEqual([missing]);
  });
});
