import { describe, expect, it } from 'vitest';

import { resolveKnowledgePathStepLearningView } from './knowledgePathLearningPolicy';

describe('resolveKnowledgePathStepLearningView', () => {
  it('does not fabricate unseen state when private learning evidence failed to load', () => {
    expect(
      resolveKnowledgePathStepLearningView({
        available: false,
        loading: false,
        state: null,
      }),
    ).toBe('unavailable');
  });

  it('uses unseen only after a successful exact-version state load with no evidence', () => {
    expect(
      resolveKnowledgePathStepLearningView({
        available: true,
        loading: false,
        state: null,
      }),
    ).toBe('unseen');
  });

  it('preserves exact P18-E informational state and loading precedence', () => {
    expect(
      resolveKnowledgePathStepLearningView({
        available: true,
        loading: false,
        state: 'understood',
      }),
    ).toBe('understood');
    expect(
      resolveKnowledgePathStepLearningView({
        available: true,
        loading: true,
        state: 'read',
      }),
    ).toBe('loading');
  });
});
