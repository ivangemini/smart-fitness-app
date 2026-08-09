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

const screen = readSource(
  'src/features/workouts/screens/WorkoutSessionFinishScreen.tsx',
);
const styles = readSource(
  'src/features/workouts/screens/workoutSessionFinishScreen.styles.ts',
);
const messages = readSource('src/localization/workoutsMessages.ts');

describe('workout finish interaction chrome', () => {
  it('uses shared footer actions while preserving finish gating', () => {
    expect(screen).toContain('<SecondaryButton');
    expect(screen).toContain('<PrimaryButton');
    expect(screen).toContain('label={shareCopy.title}');
    expect(screen).toContain("label={t('workouts.finish.save')}");
    expect(screen.match(/disabled=\{!canSave\}/g)?.length).toBe(2);
    expect(styles).not.toContain('shareButton:');
    expect(styles).not.toContain('saveButton:');
  });

  it('keeps measured sticky-footer and keyboard-safe content clearance', () => {
    expect(screen).toContain('const [footerHeight, setFooterHeight] = useState(0)');
    expect(screen).toContain('paddingBottom: footerHeight + Spacing.three');
    expect(screen).toContain('setFooterHeight((currentHeight) =>');
    expect(screen).toContain('paddingBottom: insets.bottom + Spacing.two');
    expect(screen).toContain('<KeyboardAvoidingView');
  });

  it('preserves completion, save and share lifecycle contracts', () => {
    expect(screen).toContain('buildCompletedWorkoutSessionSnapshotFromDraft');
    expect(screen).toContain('markActiveWorkoutSessionFinishing()');
    expect(screen).toContain('saveWorkoutSession(completedSnapshot)');
    expect(screen).toContain('clearActiveWorkoutSessionDraft()');
    expect(screen).toContain('markActiveWorkoutSessionCompleted()');
    expect(screen).toContain("router.replace('/workouts')");
    expect(screen).toContain("pathname: '/social/share-workout/[sessionId]'");
    expect(screen).toContain('params: { sessionId: completedSnapshot.id }');
  });

  it('keeps finish navigation and clear-name controls accessible', () => {
    expect(screen).toContain("accessibilityLabel={t('workouts.finish.resume')}");
    expect(screen).toContain("accessibilityLabel={t('workouts.finish.clearWorkoutName')}");
    expect(screen).toContain('hitSlop={11}');
    expect(styles).toMatch(/resumeButton:\s*\{[\s\S]*?minHeight:\s*44/);
    expect(styles).not.toMatch(/resumeButton:\s*\{[\s\S]*?minHeight:\s*36/);
    expect(messages).toContain("'workouts.finish.clearWorkoutName': 'Clear workout name'");
    expect(messages).toContain(
      "'workouts.finish.clearWorkoutName': 'Очистить название тренировки'",
    );
  });
});
