import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const screenPaths = [
  'src/features/coach/screens/CombinedCoachScreen.tsx',
  'src/features/coach/screens/RecoveryCheckInScreen.tsx',
  'src/features/coach/screens/SafetyRecoveryCoachScreen.tsx',
  'src/features/coach/screens/UserLimitationScreen.tsx',
  'src/features/coach/screens/CoachRunHistoryScreen.tsx',
];

const stylePaths = [
  'src/features/coach/screens/combinedCoachScreenStyles.ts',
  'src/features/coach/screens/recoveryCheckInScreen.styles.ts',
  'src/features/coach/screens/safetyRecoveryCoachScreen.styles.ts',
  'src/features/coach/screens/userLimitationScreen.styles.ts',
];

describe('LG-3I Coach secondary shared navigation', () => {
  it.each(screenPaths)('%s owns back navigation through LiquidGlassIconButton', (path) => {
    const source = readSource(path);

    expect(source).toContain('LiquidGlassIconButton');
    expect(source).toContain('Icon={ChevronLeft}');
    expect(source).toContain('onPress={() => router.back()}');
    expect(source).not.toContain('styles.backButton');
    expect(source).not.toContain('themedStyles.backButton');
    expect(source).not.toContain('BlurView');
  });

  it.each(stylePaths)('%s no longer owns a local back material recipe', (path) => {
    const source = readSource(path);

    expect(source).not.toContain('backButton:');
    expect(source).not.toContain('backLabel:');
  });

  it('preserves Safety lookback press feedback, review lifecycle and result grouping', () => {
    const screen = readSource('src/features/coach/screens/SafetyRecoveryCoachScreen.tsx');
    const styles = readSource('src/features/coach/screens/safetyRecoveryCoachScreen.styles.ts');

    expect(screen).toContain('styles.periodButton');
    expect(screen).toContain('pressed && !busy && styles.pressed');
    expect(screen).toContain('coachApi.startSafetyRecoveryRun');
    expect(screen).toContain('coachApi.waitForTerminalRun');
    expect(screen).toContain('reviewStore.set(snapshot)');
    expect(screen).toContain('styles.resultGroupHeader');
    expect(screen).toContain('styles.resultGroupRow');
    expect(screen).toContain('styles.resultGroupFooter');
    expect(styles).toContain('pressed:');
    expect(styles).toContain('resultGroupHeader:');
    expect(styles).toContain('resultGroupRow:');
    expect(styles).toContain('resultGroupFooter:');
  });

  it('preserves Recovery and User Limitation persistence/sync contracts', () => {
    const recovery = readSource('src/features/coach/screens/RecoveryCheckInScreen.tsx');
    const limitations = readSource('src/features/coach/screens/UserLimitationScreen.tsx');

    expect(recovery).toContain('upsertRecoveryCheckIn(result.checkIn)');
    expect(recovery).toContain('void syncNow()');
    expect(limitations).toContain('upsertUserLimitation(result.limitation)');
    expect(limitations).toContain('deleteUserLimitation(limitation.id)');
    expect(limitations).toContain('void syncNow()');
  });

  it('preserves Combined Coach and history API contracts', () => {
    const combined = readSource('src/features/coach/screens/CombinedCoachScreen.tsx');
    const history = readSource('src/features/coach/screens/CoachRunHistoryScreen.tsx');

    expect(combined).toContain('await syncNow()');
    expect(combined).toContain('coachApi.startCombinedRun');
    expect(combined).toContain('coachApi.waitForTerminalRun');
    expect(history).toContain('api.listRuns({');
    expect(history).toContain("router.push(`/profile/coach-history/${item.id}`)");
  });
});