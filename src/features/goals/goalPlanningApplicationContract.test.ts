import { describe, expect, it } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as {
  readFileSync(path: string, encoding: string): string;
};
const { resolve } = require('path') as { resolve(...parts: string[]): string };
const projectRoot = resolve(__dirname, '../..', '..');
const readSource = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), 'utf8');

const functionBlock = (source: string, start: string, end: string) => {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  expect(startIndex).toBeGreaterThanOrEqual(0);
  expect(endIndex).toBeGreaterThan(startIndex);
  return source.slice(startIndex, endIndex);
};

describe('goal planning application boundary', () => {
  it('previews changes and checks the canonical source before applying goals', () => {
    const source = readSource('src/features/profile/ProfileGoalsSection.tsx');
    const applyBlock = functionBlock(
      source,
      'const applyGoalProposal = () => {',
      'const toggleExpanded = () => {',
    );

    expect(source).toContain('createGoalPlanningProposal({');
    expect(source).toContain('<GoalPlanningProposalPreview');
    expect(source).toContain('primaryActionLabel={planningCopy.reviewChanges}');
    expect(applyBlock).toContain('isGoalPlanningProposalStale(');
    expect(applyBlock).toContain('updateProfileGoals(applied)');
  });

  it('keeps nutrition recalculation behind a second explicit action', () => {
    const source = readSource('src/features/profile/ProfileGoalsSection.tsx');
    const recalculateBlock = functionBlock(
      source,
      'const recalculateNutrition = (applied: GoalPlanningValues) => {',
      'const applyGoalProposal = () => {',
    );
    const applyBlock = functionBlock(
      source,
      'const applyGoalProposal = () => {',
      'const toggleExpanded = () => {',
    );

    expect(recalculateBlock).toContain('updateNutritionTargets(');
    expect(applyBlock).not.toContain('updateNutritionTargets(');
    expect(applyBlock).toContain('text: planningCopy.recalculateNutrition');
    expect(applyBlock).toContain('onPress: () => recalculateNutrition(applied)');
  });
});
