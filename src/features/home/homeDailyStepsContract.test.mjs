import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Home daily steps integration contract', () => {
  it('reads daily steps only from an already-authorized platform source', () => {
    const source = read('src/features/home/useHomeDailySteps.ts');

    expect(source).toContain('getStepActivitySource');
    expect(source).toContain("availability !== 'available'");
    expect(source).toContain('readDailySteps(localDate)');
    expect(source).not.toContain('requestReadPermission');
  });

  it('renders live steps on Home and refreshes them with the feed', () => {
    const source = read('src/app/(tabs)/index.tsx');

    expect(source).toContain('useHomeDailySteps(todayKey)');
    expect(source).toContain('stepsValue={stepsValue}');
    expect(source).toContain('refreshSteps()');
    expect(source).not.toContain('stepsValue="—"');
  });

  it('uses a Liquid Glass pressed material for the daily metrics disclosure', () => {
    const source = read('src/components/home/HomeDailyMetricsPanel.tsx');

    expect(source).toContain('pressed: { backgroundColor: glass.controlPressedFill }');
    expect(source).not.toContain('pressed: { opacity: 0.78 }');
  });
});
