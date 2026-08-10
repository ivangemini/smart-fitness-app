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

const detail = readSource(
  'src/features/workouts/screens/WorkoutTemplateDetailScreen.tsx',
);

describe('Workout template detail UX', () => {
  it('uses one top-level virtualized boundary for workout exercises', () => {
    expect(detail).toContain('FlatList');
    expect(detail).toContain('data={workout.exercises}');
    expect(detail).toContain('keyExtractor={(exercise) => exercise.id}');
    expect(detail).not.toContain('<ScrollView');
    expect(detail).not.toContain('workout.exercises.map(');
  });

  it('preserves workout start and template actions', () => {
    expect(detail).toContain('startWorkoutSession(workout)');
    expect(detail).toContain('toggleWorkoutTemplateFavorite(workout.id)');
    expect(detail).toContain('deleteWorkoutTemplate(workout.id)');
    expect(detail).toContain('<PrimaryButton');
  });
});
