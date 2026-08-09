import { describe, expect, it } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as {
  readFileSync(path: string, encoding: string): string;
};
const { resolve } = require('path') as {
  resolve(...parts: string[]): string;
};

const projectRoot = resolve(__dirname, '..');
const readSource = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), 'utf8');

const history = readSource('src/features/workouts/screens/WorkoutHistoryScreen.tsx');
const historyStyles = readSource(
  'src/features/workouts/screens/workoutHistoryScreen.styles.ts',
);
const detail = readSource(
  'src/features/workouts/screens/WorkoutHistoryDetailScreen.tsx',
);
const detailStyles = readSource(
  'src/features/workouts/screens/workoutHistoryDetailScreen.styles.ts',
);
const safety = readSource(
  'src/features/workouts/screens/WorkoutSafetyGateScreen.tsx',
);
const safetyStyles = readSource(
  'src/features/workouts/screens/workoutSafetyGateScreen.styles.ts',
);

describe('secondary workouts controls', () => {
  it('uses shared 44 px back controls on history list/detail and safety gate', () => {
    for (const source of [history, detail, safety]) {
      expect(source).toContain('<LiquidGlassIconButton');
      expect(source).toContain('Icon={ChevronLeft}');
      expect(source).toContain('onPress={() => router.back()}');
    }

    expect(historyStyles).not.toContain('backButton:');
    expect(historyStyles).not.toContain('backLabel:');
    expect(detailStyles).not.toContain('backButton:');
    expect(detailStyles).not.toContain('backLabel:');
    expect(safetyStyles).not.toContain('backButton:');
    expect(safetyStyles).not.toContain('backLabel:');
  });

  it('keeps history filter actions at the interaction minimum', () => {
    expect(history).toContain('styles.clearButton');
    expect(historyStyles).toMatch(/clearButton:\s*\{[\s\S]*?minHeight:\s*44/);
    expect(historyStyles).toMatch(/resetButton:\s*\{[\s\S]*?minHeight:\s*44/);
    expect(historyStyles).toMatch(/chip:\s*\{[\s\S]*?minHeight:\s*44/);
    expect(historyStyles).not.toContain('minHeight: 38');
    expect(historyStyles).not.toContain('minHeight: 42');
  });

  it('preserves history virtualization, filtering and detail routing', () => {
    expect(history).toContain('<FlatList');
    expect(history).toContain('data={history}');
    expect(history).toContain('setDateRange(null)');
    expect(history).toContain("setPeriod('all')");
    expect(history).toContain("setProgramId('all')");
    expect(history).toContain("setSafety('all')");
    expect(history).toContain("pathname: '/workout-history/[sessionId]'");
    expect(detail).toContain('buildWorkoutHistoryItemView(session)');
    expect(detail).toContain('groupWorkoutSessionSets(session)');
  });

  it('preserves safety-gate decision, acknowledgement and continue contracts', () => {
    expect(safety).toContain('buildWorkoutSafetyGateDecision({');
    expect(safety).toContain('decision.requiresAcknowledgement && !acknowledged');
    expect(safety).toContain('accessibilityRole="checkbox"');
    expect(safety).toContain('accessibilityState={{ checked: acknowledged }}');
    expect(safety).toContain('await onContinue(');
    expect(safety).toContain("router.push('/profile/safety-recovery')");
    expect(safety).toContain("router.push('/profile/recovery-check-in')");
    expect(safety).toContain("router.push('/profile/limitations')");
  });
});
