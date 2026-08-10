import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const gateScreen = readSource(
  'src/features/workouts/screens/WorkoutSafetyGateScreen.tsx',
);
const gateStyles = readSource(
  'src/features/workouts/screens/workoutSafetyGateScreen.styles.ts',
);
const finishScreen = readSource(
  'src/features/workouts/screens/WorkoutSessionFinishScreen.tsx',
);
const finishStyles = readSource(
  'src/features/workouts/screens/workoutSessionFinishScreen.styles.ts',
);

describe('LG-5 workout direct-action material feedback', () => {
  it('gives Safety Gate direct actions Liquid Glass fill-based pressed feedback', () => {
    expect(gateScreen).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(gateScreen).toContain('pressed && styles.acknowledgementPressed');
    expect(gateScreen).toContain('pressed && styles.smallActionPressed');
    expect(gateStyles).toContain('glass.controlFill');
    expect(gateStyles).toContain('glass.controlBorder');
    expect(gateStyles).toContain('glass.controlPressedFill');
    expect(gateStyles).not.toMatch(/pressed:\s*\{[\s\S]*?opacity:/);
    expect(gateStyles).not.toContain('opacity: 0.68');
  });

  it('gives Finish resume/clear/media/discard actions material-specific pressed fills', () => {
    expect(finishScreen).toContain('resolveLiquidGlassPalette');
    expect(finishScreen).toContain('pressed && styles.resumeButtonPressed');
    expect(finishScreen).toContain('pressed && styles.clearButtonPressed');
    expect(finishScreen).toContain('pressed && styles.mediaButtonPressed');
    expect(finishScreen).toContain('pressed && styles.discardButtonPressed');
    expect(finishStyles).toContain('glass.controlPressedFill');
    expect(finishStyles).toContain('glass.semanticAccentFill');
    expect(finishStyles).toContain('backgroundColor: colors.errorSoft');
    expect(finishStyles).not.toMatch(/pressed:\s*\{[\s\S]*?opacity:/);
    expect(finishStyles).not.toContain('opacity: 0.72');
  });

  it('preserves Safety Gate decision/acknowledgement and update-review routing', () => {
    expect(gateScreen).toContain('buildWorkoutSafetyGateDecision');
    expect(gateScreen).toContain('decision.requiresAcknowledgement');
    expect(gateScreen).toContain('await onContinue(');
    expect(gateScreen).toContain("router.push('/profile/safety-recovery')");
    expect(gateScreen).toContain("router.push('/profile/recovery-check-in')");
    expect(gateScreen).toContain("router.push('/profile/limitations')");
  });

  it('preserves Finish completion/share lifecycle and measured safe-area footer', () => {
    expect(finishScreen).toContain('buildCompletedWorkoutSessionSnapshotFromDraft');
    expect(finishScreen).toContain('saveWorkoutSession(completedSnapshot)');
    expect(finishScreen).toContain('clearActiveWorkoutSessionDraft()');
    expect(finishScreen).toContain('markActiveWorkoutSessionCompleted()');
    expect(finishScreen).toContain("pathname: '/social/share-workout/[sessionId]'");
    expect(finishScreen).toContain('paddingBottom: footerHeight + Spacing.three');
    expect(finishScreen).toContain('paddingBottom: insets.bottom + Spacing.two');
  });
});