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

describe('Program Builder persisted state boundary', () => {
  test('loads an edited program from persisted training-program state', () => {
    const source = readSource('src/features/workouts/screens/WorkoutBuilderScreen.tsx');

    expect(source).toContain('const { trainingPrograms, workouts } = useWorkoutState();');
    expect(source).toContain(
      'getWorkoutProgramById(programId, workouts, trainingPrograms)',
    );
    expect(source).toMatch(/\[programId, trainingPrograms, workouts\]/);
  });

  test('saves program edits through the durable AppActions boundary', () => {
    const source = readSource('src/features/workouts/screens/WorkoutBuilderScreen.tsx');

    expect(source).toContain('saveTrainingProgram');
    expect(source).toContain('saveTrainingProgram(saved);');
    expect(source).not.toContain('saveWorkoutProgram(');
  });
});
