import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const screen = readSource(
  'src/features/workouts/screens/WorkoutExerciseLibraryScreen.tsx',
);
const controls = readSource(
  'src/features/workouts/screens/WorkoutExerciseLibraryControls.tsx',
);
const styles = readSource(
  'src/features/workouts/styles/workoutExerciseLibraryScreenStyles.ts',
);

describe('LG-5 Exercise Library interaction materials', () => {
  it('uses Liquid Glass retry material instead of opacity-only feedback', () => {
    expect(screen).toContain(
      "resolveLiquidGlassPalette(isWorkoutDarkMode ? 'dark' : 'light')",
    );
    expect(screen).toContain('pressed && styles.retryButtonPressed');
    expect(screen).not.toContain('pressed && styles.pressed');
    expect(styles).toContain('glass.accentFill');
    expect(styles).toContain('glass.accentPressedFill');
  });

  it('uses control material for exercise rows and details actions', () => {
    expect(controls).toContain('pressed && styles.rowPressed');
    expect(controls).toContain('pressed && styles.infoButtonPressed');
    expect(controls).not.toContain('pressed && styles.pressed');
    expect(styles).toContain('backgroundColor: glass.controlFill');
    expect(styles).toContain('backgroundColor: glass.controlPressedFill');
    expect(styles).toContain('backgroundColor: glass.accentFill');
  });

  it('distinguishes active and inactive filter-chip pressed material', () => {
    expect(controls).toContain(
      'pressed && (!activeValue ? styles.chipActivePressed : styles.chipPressed)',
    );
    expect(controls).toContain(
      'pressed && (active ? styles.chipActivePressed : styles.chipPressed)',
    );
    expect(styles).toContain('chipActivePressed:');
    expect(styles).toContain('backgroundColor: glass.accentPressedFill');
    expect(styles).toContain('chipPressed:');
    expect(styles).not.toContain('opacity: 0.72');
  });

  it('preserves exercise-library virtualization and session-draft mutation', () => {
    expect(screen).toContain('<FlatList');
    expect(screen).toContain('data={loading || error ? [] : listResults}');
    expect(screen).toContain('keyExtractor={(item) => item.id}');
    expect(screen).toContain('initialNumToRender={4}');
    expect(screen).toContain('maxToRenderPerBatch={4}');
    expect(screen).toContain('windowSize={3}');
    expect(screen).toContain('getActiveWorkoutSessionDraft()');
    expect(screen).toContain('addWorkoutSessionExercises(activeDraft, selectedExercises)');
    expect(screen).toContain('setActiveWorkoutSessionDraft(');
    expect(screen).toContain("router.replace('/workout-session')");
    expect(screen).toContain('paddingBottom: footerHeight + Spacing.three');
    expect(screen).toContain('paddingBottom: insets.bottom + Spacing.two');
  });
});
