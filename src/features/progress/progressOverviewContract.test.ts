import { describe, expect, it } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as {
  readFileSync(path: string, encoding: string): string;
};
const { resolve } = require('path') as {
  resolve(...parts: string[]): string;
};

const projectRoot = resolve(__dirname, '../..', '..');
const readSource = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), 'utf8');

describe('Progress first-level IA', () => {
  it('keeps the overview summary-first and routes detail work to drill-down surfaces', () => {
    const screen = readSource('src/app/(tabs)/progress.tsx');

    expect(screen).toContain('ProgressOverviewCard');
    expect(screen).toContain("router.push('/weight-details')");
    expect(screen).toContain("router.push('/workout-history')");
    expect(screen).toContain('measurementEditorOpen');
    expect(screen).not.toContain('ProgressTrendChart');
    expect(screen).not.toContain('WeeklyWorkoutVolumeCard');
    expect(screen).not.toContain('SafetyRecoveryProgressCard');
    expect(screen).not.toContain('SafetyRecoveryWeeklyTrendCard');
  });
});
