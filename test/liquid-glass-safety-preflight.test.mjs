import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const sharedBackScreens = [
  'src/features/coach/screens/SafetyRecoveryPreflightScreen.tsx',
  'src/features/coach/screens/CoachRunHistoryDetailScreen.tsx',
  'src/features/coach/screens/NutritionCoachScreen.tsx',
  'src/features/coach/screens/StrengthCoachScreen.tsx',
  'src/features/coach/screens/NutritionTargetProposalScreen.tsx',
  'src/features/coach/screens/CombinedCoachProposalScreen.tsx',
];

const externalStyleFiles = [
  'src/features/coach/screens/nutritionCoachScreen.styles.ts',
  'src/features/coach/screens/strengthCoachScreen.styles.ts',
  'src/features/coach/screens/nutritionTargetProposalStyles.ts',
];

describe('residual Coach navigation material', () => {
  it.each(sharedBackScreens)('%s uses the shared Liquid Glass back control', (path) => {
    const source = readSource(path);

    expect(source).toContain('LiquidGlassIconButton');
    expect(source).toContain('Icon={ChevronLeft}');
    expect(source).toContain('onPress={() => router.back()}');
    expect(source).not.toContain('styles.backButton');
    expect(source).not.toContain('themed.backButton');
    expect(source).not.toContain('backButton:');
    expect(source).not.toContain('backLabel:');
    expect(source).not.toContain('BlurView');
  });

  it.each(externalStyleFiles)('%s no longer owns a local back material recipe', (path) => {
    const source = readSource(path);

    expect(source).not.toContain('backButton:');
    expect(source).not.toContain('backLabel:');
  });

  it('preserves preflight sync and review navigation contracts', () => {
    const source = readSource(
      'src/features/coach/screens/SafetyRecoveryPreflightScreen.tsx',
    );

    expect(source).toContain('await syncNow()');
    expect(source).toContain("router.push('/profile/recovery-check-in')");
    expect(source).toContain("router.push('/profile/limitations')");
    expect(source).toContain("router.push('/profile/safety-recovery/review')");
  });

  it('preserves Coach Run History detail retrieval and immutable review content', () => {
    const source = readSource(
      'src/features/coach/screens/CoachRunHistoryDetailScreen.tsx',
    );

    expect(source).toMatch(/api\s*\.\s*getRun\(runId\)/);
    expect(source).toContain('<CoachRunTrustCard');
    expect(source).toContain('<CoachInputSummaryCard');
    expect(source).toContain('<CoachAppliedChangeCard');
    expect(source).toContain('parseCoachApplicationProvenance');
  });

  it('preserves Nutrition Coach run, confirmation and sync contracts', () => {
    const source = readSource('src/features/coach/screens/NutritionCoachScreen.tsx');

    expect(source).toContain('coachApi.startNutritionRun');
    expect(source).toContain('coachApi.confirmRun');
    expect(source).toContain('await syncNow()');
  });

  it('preserves Strength Coach run, confirmation and sync contracts', () => {
    const source = readSource('src/features/coach/screens/StrengthCoachScreen.tsx');

    expect(source).toContain('coachApi.startStrengthRun');
    expect(source).toContain('coachApi.confirmRun');
    expect(source).toContain('await syncNow()');
  });

  it('preserves Nutrition Target proposal run, confirmation and sync contracts', () => {
    const source = readSource(
      'src/features/coach/screens/NutritionTargetProposalScreen.tsx',
    );

    expect(source).toContain('coachApi.startNutritionRun');
    expect(source).toContain('coachApi.confirmRun');
    expect(source).toContain('await syncNow()');
  });

  it('preserves Combined Proposal run, confirmations and sync contracts', () => {
    const source = readSource(
      'src/features/coach/screens/CombinedCoachProposalScreen.tsx',
    );

    expect(source).toContain('coachApi.startCombinedRun');
    expect(source).toContain('coachApi.confirmCombinedEffectiveStrength');
    expect(source).toContain('coachApi.confirmCombinedNutrition');
    expect(source).toContain('await syncNow()');
  });
});
