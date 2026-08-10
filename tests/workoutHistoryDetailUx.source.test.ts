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
  'src/features/workouts/screens/WorkoutHistoryDetailScreen.tsx',
);

describe('Workout history detail UX', () => {
  it('uses one top-level virtualized boundary for completed-workout exercise groups', () => {
    expect(detail).toContain("import { FlatList, Text, View } from 'react-native';");
    expect(detail).toContain('<FlatList');
    expect(detail).toContain('data={session && summary ? exerciseGroups : []}');
    expect(detail).toContain(
      'keyExtractor={(group) => `${group.exerciseId}-${group.exerciseName}`}',
    );
    expect(detail).not.toContain('<ScrollView');
    expect(detail).not.toContain('exerciseGroups.map(');
  });

  it('keeps completed history read-only while retaining safety context', () => {
    expect(detail).toContain('workoutSessions.find((item) => item.id === sessionId)');
    expect(detail).toContain('<SafetyHistoryCard');
    expect(detail).not.toContain('deleteWorkout');
    expect(detail).not.toContain('updateWorkout');
    expect(detail).not.toContain('saveWorkout');
  });
});
