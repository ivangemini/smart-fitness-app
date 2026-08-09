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

const route = readSource('src/app/workouts/history.tsx');
const card = readSource('src/components/workouts/WorkoutHistorySessionCard.tsx');

describe('editable workout history responsive contract', () => {
  it('virtualizes the growable session history and uses stack-safe bottom clearance', () => {
    expect(route).toContain('<SectionList');
    expect(route).toContain('sections={sections}');
    expect(route).toContain('renderSectionHeader=');
    expect(route).toContain('renderItem={renderSession}');
    expect(route).toContain('stickySectionHeadersEnabled={false}');
    expect(route).toContain('paddingBottom: insets.bottom + Spacing.six');
    expect(route).not.toContain('<ScrollView');
    expect(route).not.toContain('BottomTabInset');
    expect(route).not.toContain('+ 120');
    expect(route).not.toContain('groupedSessions.map');
  });

  it('uses the active semantic theme across the route and editable card', () => {
    expect(route).toContain('useAppTheme');
    expect(route).toContain('createStyles(colors)');
    expect(card).toContain('useAppTheme');
    expect(card).toContain('createStyles(colors)');
    expect(route).not.toContain('Colors.dark');
    expect(card).not.toContain('Colors.dark');
    expect(card).toContain('placeholderTextColor={colors.textSecondary}');
    expect(card).toContain('selectionColor={colors.accent}');
  });

  it('preserves session sorting, grouping and edit/save/delete contracts', () => {
    expect(route).toContain('right.finishedAt.localeCompare(left.finishedAt)');
    expect(route).toContain("formatDate(session.finishedAt, { month: 'long', year: 'numeric' })");
    expect(route).toContain('handleEditSessionSet');
    expect(route).toContain('handleSaveSessionSet');
    expect(route).toContain('handleSaveSessionChanges');
    expect(route).toContain('updateWorkoutSession(session.id, { ...session, sets: sessionDraftSets })');
    expect(route).toContain('onPress: () => deleteWorkoutSession(sessionId)');
    expect(route).toContain('onDeleteSessionSet={(setId) =>');
  });

  it('keeps shared buttons and unit conversion/editing behavior intact', () => {
    expect(card).toContain('<AppButton');
    expect(route).toContain('parseDisplayNumber(sessionWeight)');
    expect(route).toContain('weightToKg(displayWeight, weight)');
    expect(card).toContain('formatWeightValue(set.weight)');
    expect(card).toContain('keyboardType="decimal-pad"');
    expect(card).toContain('keyboardType="number-pad"');
  });
});
