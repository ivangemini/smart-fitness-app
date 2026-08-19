import { describe, expect, it } from 'vitest';

import { parseCoachCapabilities } from './coach/parsers';

const baseCapabilities = {
  nutrition: {
    deterministicReview: true,
    deterministicTargetProposal: true,
    structuredStrategyProposal: true,
    structuredStrategyConfirmation: true,
    strategyRequiresConfirmation: true,
  },
  strength: {
    deterministicReview: true,
    deterministicMockProposal: true,
    structuredStrategyProposal: true,
    structuredStrategyConfirmation: true,
    strategyRequiresConfirmation: true,
  },
  safety: {
    deterministicRecoveryReview: true,
    revisionedLimitations: true,
    revisionedRecoveryCheckIns: true,
    automaticApplication: false,
  },
  combined: {
    deterministicReview: true,
    deterministicProposalReview: true,
    proposalRequiresExplicitConfirmation: true,
    effectiveStrengthConfirmation: true,
    nutritionConfirmation: true,
    nutritionReconciliation: true,
    automaticApplication: false,
  },
} as const;

const questions = (
  availableScopes: string[],
  structuredAnswer = true,
) => ({
  structuredAnswer,
  availableScopes,
  readOnly: true,
  automaticApplication: false,
});

describe('Coach question capabilities v11-v13', () => {
  it('accepts the exact scope progression through goal-aware v13', () => {
    expect(
      parseCoachCapabilities({
        ...baseCapabilities,
        schemaVersion: 11,
        questions: questions(['strength', 'nutrition', 'safety_recovery']),
      }),
    ).toMatchObject({ schemaVersion: 11 });
    expect(
      parseCoachCapabilities({
        ...baseCapabilities,
        schemaVersion: 12,
        questions: questions([
          'strength',
          'nutrition',
          'safety_recovery',
          'labs',
        ]),
      }),
    ).toMatchObject({ schemaVersion: 12 });
    expect(
      parseCoachCapabilities({
        ...baseCapabilities,
        schemaVersion: 13,
        questions: questions([
          'strength',
          'nutrition',
          'safety_recovery',
          'labs',
          'goal',
        ]),
      }),
    ).toMatchObject({
      schemaVersion: 13,
      questions: {
        structuredAnswer: true,
        availableScopes: [
          'strength',
          'nutrition',
          'safety_recovery',
          'labs',
          'goal',
        ],
        readOnly: true,
        automaticApplication: false,
      },
    });
  });

  it('rejects widened or reordered scope lists for a version', () => {
    expect(() =>
      parseCoachCapabilities({
        ...baseCapabilities,
        schemaVersion: 12,
        questions: questions([
          'strength',
          'nutrition',
          'safety_recovery',
          'labs',
          'goal',
        ]),
      }),
    ).toThrow('Invalid coach capabilities response');
    expect(() =>
      parseCoachCapabilities({
        ...baseCapabilities,
        schemaVersion: 13,
        questions: questions([
          'nutrition',
          'strength',
          'safety_recovery',
          'labs',
          'goal',
        ]),
      }),
    ).toThrow('Invalid coach capabilities response');
  });

  it('keeps reconciliation required for versions newer than v10', () => {
    expect(() =>
      parseCoachCapabilities({
        ...baseCapabilities,
        schemaVersion: 13,
        combined: {
          ...baseCapabilities.combined,
          nutritionReconciliation: false,
        },
        questions: questions([
          'strength',
          'nutrition',
          'safety_recovery',
          'labs',
          'goal',
        ]),
      }),
    ).toThrow('Invalid coach capabilities response');
  });
});
