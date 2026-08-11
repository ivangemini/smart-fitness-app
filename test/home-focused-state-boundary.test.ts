import { describe, expect, test } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as {
  readFileSync: (path: string, encoding: string) => string;
};
const { resolve } = require('path') as { resolve: (...parts: string[]) => string };

const projectRoot = resolve(__dirname, '..');
const readSource = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), 'utf8');

describe('Home focused state composition', () => {
  test('composes existing focused state boundaries without compatibility AppContext', () => {
    const source = readSource('src/app/(tabs)/index.tsx');

    for (const hook of [
      'useAppInfrastructure',
      'useNutritionState',
      'useProfileState',
      'useProgressState',
      'useWorkoutState',
    ]) {
      expect(source).toContain(hook);
    }
    expect(source).not.toContain('useAppContext');
  });

  test('resolves the Home workout schedule from persisted training-program state', () => {
    const source = readSource('src/app/(tabs)/index.tsx');

    expect(source).toMatch(
      /const \{ exercises, trainingPrograms, workoutSessions, workouts \} = useWorkoutState\(\);/,
    );
    expect(source).toContain('getWorkoutPrograms(workouts, trainingPrograms)');
    expect(source).toMatch(/\[trainingPrograms, workouts\]/);
  });
});
