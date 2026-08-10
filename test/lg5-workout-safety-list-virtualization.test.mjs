import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const historyDetailPath = 'src/features/workouts/screens/WorkoutHistoryDetailScreen.tsx';
const safetyGatePath = 'src/features/workouts/screens/WorkoutSafetyGateScreen.tsx';
const safetyListModelPath = 'src/features/workouts/workoutSafetyListModel.ts';

describe('LG-5 workout safety long-list boundaries', () => {
  it('keeps Workout History Detail on one screen-level FlatList for exercise and Safety rows', () => {
    const source = readSource(historyDetailPath);

    expect(source).toContain("import { FlatList, Text, View } from 'react-native'");
    expect(source).toContain('data={rows}');
    expect(source).toContain('keyExtractor={(item) => item.id}');
    expect(source).toContain(
      'buildWorkoutSafetyListRows(metadata.restrictions, metadata.issues)',
    );
    expect(source).not.toContain('metadata.restrictions.map(');
    expect(source).not.toContain('metadata.issues.map(');
    expect(source).toContain('group.sets.map((set, index) =>');
    expect(source).toContain('paddingBottom: insets.bottom + Spacing.eight');
  });

  it('replaces the Safety Gate ScrollView renderer with one screen-level FlatList', () => {
    const source = readSource(safetyGatePath);

    expect(source).toContain("import { FlatList, Pressable, Text, View } from 'react-native'");
    expect(source).toContain('data={safetyRows}');
    expect(source).toContain('keyExtractor={(item) => item.id}');
    expect(source).toContain(
      'buildWorkoutSafetyListRows(decision.restrictions, decision.issues)',
    );
    expect(source).not.toContain('<ScrollView');
    expect(source).not.toContain('decision.restrictions.map(');
    expect(source).not.toContain('decision.issues.map(');
    expect(source).toContain('onContinue(');
    expect(source).toContain('decision.requiresAcknowledgement');
    expect(source).toContain("router.push('/profile/safety-recovery')");
    expect(source).toContain('paddingBottom: insets.bottom + Spacing.eight');
  });

  it('uses semantic row identity without capping or mutating Safety metadata', () => {
    const source = readSource(safetyListModelPath);

    expect(source).toContain('safety-restriction:${restriction.limitationId}');
    expect(source).toContain('safety-issue:${issue.code}:${issue.severity}:${issue.message}');
    expect(source).toContain('nextSemanticId');
    expect(source).not.toContain('.slice(');
    expect(source).not.toContain('.splice(');
    expect(source).not.toContain('sort(');
    expect(source).toContain('return [...restrictionRows, ...issueRows]');
  });
});
