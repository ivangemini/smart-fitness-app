import { describe, expect, it } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as {
  readFileSync(path: string, encoding: string): string;
};
const { resolve } = require('path') as { resolve(...parts: string[]): string };
const projectRoot = resolve(__dirname, '..');
const readSource = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), 'utf8');

describe('Progress Activity Companion handoff source contract', () => {
  it('passes only bounded navigation selectors to Companion', () => {
    const activity = readSource('src/app/activity-progress.tsx');

    expect(activity).toContain("contextIntent: 'training_overview'");
    expect(activity).toContain("metric: 'activity'");
    expect(activity).toContain('days: String(PERIOD_DAYS[periodKey])');
    expect(activity).toContain('endAt: anchorAt');
    expect(activity).not.toContain('params: { workoutSessions');
    expect(activity).not.toContain('params: { trainingSummary');
  });

  it('rebuilds the training overview inside Companion and links back to Activity', () => {
    const coach = readSource('src/app/(tabs)/coach.tsx');
    const parser = readSource(
      'src/features/coach/coachActivityProgressContext.ts',
    );

    expect(coach).toContain('parseCoachActivityProgressContext');
    expect(coach).toContain('buildCoachFactPacket');
    expect(coach).toContain("router.push('/activity-progress')");
    expect(parser).toContain("intent: 'training_overview'");
    expect(parser).toContain('COACH_HISTORY_MAX_DAYS');
  });
});
