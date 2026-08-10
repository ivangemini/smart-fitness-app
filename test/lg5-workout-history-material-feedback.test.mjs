import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const screenPath = 'src/features/workouts/screens/WorkoutHistoryScreen.tsx';
const stylesPath = 'src/features/workouts/screens/workoutHistoryScreen.styles.ts';

describe('LG-5 Workout History material feedback', () => {
  it('uses Liquid Glass control tokens instead of opacity-only feedback', () => {
    const screen = readSource(screenPath);
    const styles = readSource(stylesPath);

    expect(screen).toContain('resolveLiquidGlassPalette');
    expect(screen).toContain('createFilterChipStyles(colors, glass)');
    expect(screen).toContain('createWorkoutHistoryScreenStyles(colors, glass)');
    expect(screen).toContain('styles.chipSelectedPressed : styles.chipPressed');
    expect(screen).toContain('pressed && styles.controlPressed');
    expect(screen).toContain('pressed && styles.historyCardPressed');

    expect(styles).toContain('backgroundColor: glass.controlFill');
    expect(styles).toContain('backgroundColor: glass.controlPressedFill');
    expect(styles).toContain('backgroundColor: glass.semanticAccentFill');
    expect(styles).toContain('borderColor: glass.accentBorder');
    expect(styles).not.toContain('opacity: 0.68');
  });

  it('preserves filtering, stable history identity, units and read-only detail navigation', () => {
    const screen = readSource(screenPath);

    expect(screen).toContain('parseWorkoutHistoryRouteFilters(params)');
    expect(screen).toContain('filterWorkoutHistory(workoutSessions, trainingPrograms');
    expect(screen).toContain('weightFromKg(volumeKg, weightUnit)');
    expect(screen).toContain('keyExtractor={(item) => item.session.id}');
    expect(screen).toContain("pathname: '/workout-history/[sessionId]'");
    expect(screen).toContain('params: { sessionId: item.session.id }');
    expect(screen).toContain('paddingBottom: insets.bottom + Spacing.eight');
    expect(screen).toContain('<FlatList');
  });

  it('keeps direct filter controls at the 44 point interaction floor', () => {
    const styles = readSource(stylesPath);

    expect(styles).toMatch(/chip:\s*\{[\s\S]*?minHeight: 44/);
    expect(styles).toMatch(/clearButton:\s*\{[\s\S]*?minHeight: 44/);
    expect(styles).toMatch(/resetButton:\s*\{[\s\S]*?minHeight: 44/);
  });
});
