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
  it('uses one top-level virtualized boundary for completed-workout and Safety rows', () => {
    expect(detail).toContain("import { FlatList, Text, View } from 'react-native';");
    expect(detail.match(/<FlatList/g)).toHaveLength(1);
    expect(detail).toContain('data={rows}');
    expect(detail).toContain('keyExtractor={(item) => item.id}');
    expect(detail).toContain(
      'buildWorkoutSafetyListRows(metadata.restrictions, metadata.issues)',
    );
    expect(detail).not.toContain('<ScrollView');
    expect(detail).not.toContain('metadata.restrictions.map(');
    expect(detail).not.toContain('metadata.issues.map(');
  });

  it('keeps completed history read-only while retaining virtualized safety context', () => {
    expect(detail).toContain('workoutSessions.find((item) => item.id === sessionId)');
    expect(detail).toContain('<WorkoutHistorySafetySummaryCard');
    expect(detail).toContain('<WorkoutHistorySafetyRestrictionRow');
    expect(detail).toContain('<WorkoutHistorySafetyIssueRow');
    expect(detail).not.toContain('deleteWorkout');
    expect(detail).not.toContain('updateWorkout');
    expect(detail).not.toContain('saveWorkout');
  });
});