import { describe, expect, it } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as { readFileSync(path: string, encoding: string): string };
const { resolve } = require('path') as { resolve(...parts: string[]): string };
const projectRoot = resolve(__dirname, '../..', '..');
const readSource = (relativePath: string) => readFileSync(resolve(projectRoot, relativePath), 'utf8');

describe('Coach and Progress contextual linking', () => {
  it('passes only selected exercise and period identifiers from Progress', () => {
    const progress = readSource('src/app/training-progress.tsx');

    expect(progress).toContain("pathname: '/(tabs)/coach'");
    expect(progress).toContain("contextIntent: 'exercise_progress'");
    expect(progress).toContain('exerciseId: selectedExercise.exerciseId');
    expect(progress).toContain('exerciseName: selectedExercise.exerciseName');
    expect(progress).toContain('days: String(periodDays)');
    expect(progress).toContain('endAt: anchorAt');
    expect(progress).not.toContain('JSON.stringify(series)');
    expect(progress).not.toContain('JSON.stringify(analytics)');
  });

  it('rebuilds the fact packet inside Companion from focused state boundaries', () => {
    const coach = readSource('src/app/(tabs)/coach.tsx');
    const sourceHook = readSource('src/features/coach/useCoachRetrievalSources.ts');

    expect(coach).toContain('parseCoachProgressContext(searchParams)');
    expect(coach).toContain('buildCoachFactPacket');
    expect(coach).toContain('useCoachRetrievalSources');
    expect(sourceHook).toContain('useWorkoutState');
    expect(sourceHook).toContain('useNutritionState');
    expect(sourceHook).toContain('useProgressState');
    expect(sourceHook).toContain('useProfileState');
    expect(sourceHook).toContain('useSafetyRecoveryState');
    expect(sourceHook).not.toContain('useAppContext');
  });
});
