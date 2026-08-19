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

describe('Phase 17 goal proposal flow contract', () => {
  it('previews a typed proposal inline and applies it with the captured source snapshot', () => {
    const section = readSource('src/features/profile/ProfileGoalsSection.tsx');

    expect(section).toContain('buildGoalProposal({');
    expect(section).toContain('source: getProfileGoalsSnapshot(profile)');
    expect(section).toContain('setProposal(nextProposal)');
    expect(section).toContain('<GoalProposalPreviewCard');
    expect(section).toContain('expectedCurrent: currentProposal.source');
    expect(section).toContain("status === 'stale'");
  });

  it('invalidates the preview when the user edits or collapses the goal form', () => {
    const section = readSource('src/features/profile/ProfileGoalsSection.tsx');

    expect(section).toContain('const clearProposal = () => setProposal(null)');
    expect(section).toContain('onGoalTypeChange={(value) => {');
    expect(section).toContain('onTargetWeightChange={(value) => {');
    expect(section).toContain('onTrainingDaysPerWeekChange={(value) => {');
    expect(section).toContain('onWeeklyWeightChangeGoalChange={(value) => {');
    expect(section).toContain('if (expanded) setProposal(null)');
  });

  it('keeps nutrition and training domains outside goal proposal application', () => {
    const section = readSource('src/features/profile/ProfileGoalsSection.tsx');

    expect(section).not.toContain('updateNutritionTargets');
    expect(section).not.toContain('saveTrainingProgram');
    expect(section).not.toContain('setActiveTrainingProgram');
  });

  it('uses the guarded state transition before scheduling persistence', () => {
    const context = readSource('src/context/AppContext.tsx');

    expect(context).toContain('updateProfileGoalsIfCurrentInState(');
    expect(context).toContain("if (result.status === 'stale')");
    expect(context).toContain("label: 'Save profile goals'");
  });
});
