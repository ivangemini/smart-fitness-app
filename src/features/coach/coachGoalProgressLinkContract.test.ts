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

describe('goal Progress and Companion contextual linking', () => {
  it('passes only reviewed goal intent and anchor from Progress', () => {
    const progress = readSource('src/app/(tabs)/progress.tsx');

    expect(progress).toContain("pathname: '/(tabs)/coach'");
    expect(progress).toContain("contextIntent: 'goal_progress'");
    expect(progress).toContain('endAt: anchorAt');
    expect(progress).not.toContain('JSON.stringify(goalFacts)');
    expect(progress).not.toContain('targetWeight: goalFacts');
    expect(progress).not.toContain('weightHistory:');
    expect(progress).not.toContain('workoutSessions:');
  });

  it('parses in the screen and rebuilds goal facts from canonical sources in the focused context owner', () => {
    const coach = readSource('src/app/(tabs)/coach.tsx');
    const composition = readSource('src/features/coach/CoachGoalProgressCard.tsx');
    const contextCard = readSource(
      'src/features/coach/CoachGoalProgressContextCard.tsx',
    );

    expect(coach).toContain('parseCoachGoalProgressContext');
    expect(coach).toContain('<CoachGoalProgressCard context={goalProgressContext} />');
    expect(composition).toContain(
      '<CoachGoalProgressContextCard context={context} />',
    );
    expect(contextCard).toContain('buildGoalFacts({');
    expect(contextCard).toContain('profile: sources.profile');
    expect(contextCard).toContain('weightHistory: sources.weightHistory');
    expect(contextCard).toContain('workoutSessions: sources.workoutSessions');
  });
});
