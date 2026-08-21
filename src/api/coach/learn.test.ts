import { describe, expect, it } from 'vitest';

import {
  COACH_LEARN_SCHEMA_VERSION,
  parseCoachLearnSelection,
} from './learn';

const ARTICLE_ID = '11111111-1111-4111-8111-111111111111';
const ARTICLE_VERSION_ID = '22222222-2222-4222-8222-222222222222';

const article = () => ({
  schemaVersion: 'knowledge-v1',
  articleId: ARTICLE_ID,
  articleVersionId: ARTICLE_VERSION_ID,
  slug: 'training-basics',
  locale: 'en',
  version: 1,
  primaryConceptId: 'training_basics',
  conceptIds: ['training_basics'],
  category: 'training',
  format: 'quick_lesson',
  riskTier: 'tier_1',
  title: 'Training basics',
  summary: 'Reviewed educational summary.',
  publishedAt: '2026-08-20T12:00:00.000Z',
});

const selection = () => ({
  schemaVersion: COACH_LEARN_SCHEMA_VERSION,
  recommendations: [
    {
      schemaVersion: COACH_LEARN_SCHEMA_VERSION,
      article: article(),
      reasonFindingCodes: ['combined_training_modification_required'],
    },
  ],
});

describe('parseCoachLearnSelection', () => {
  it('accepts the exact P18-F recommendation projection', () => {
    expect(parseCoachLearnSelection(selection())).toEqual(selection());
  });

  it('rejects malformed or model-shaped finding reasons', () => {
    expect(() =>
      parseCoachLearnSelection({
        ...selection(),
        recommendations: [
          {
            ...selection().recommendations[0],
            reasonFindingCodes: ['Model says read this'],
          },
        ],
      }),
    ).toThrow(/Coach Learn response/);
  });

  it('rejects duplicate exact article-version cards', () => {
    const value = selection();
    expect(() =>
      parseCoachLearnSelection({
        ...value,
        recommendations: [value.recommendations[0], value.recommendations[0]],
      }),
    ).toThrow(/recommendations/);
  });

  it('rejects hidden or future fields instead of widening the contract', () => {
    expect(() =>
      parseCoachLearnSelection({
        ...selection(),
        recommendations: [
          {
            ...selection().recommendations[0],
            explanation: 'Unreviewed provider prose',
          },
        ],
      }),
    ).toThrow(/recommendation/);
  });
});
