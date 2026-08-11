import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const workoutsScreen = readSource('src/features/workouts/screens/WorkoutsScreen.tsx');
const route = readSource('src/app/workouts/exercise-library.tsx');
const browser = readSource('src/components/workouts/VirtualizedWorkoutExerciseLibrary.tsx');
const row = readSource('src/components/workouts/exercise-library/ExerciseRow.tsx');
const filters = readSource('src/components/workouts/exercise-library/ExerciseFilterBar.tsx');
const detail = readSource('src/components/workouts/exercise-library/ExerciseDetailSheet.tsx');
const styles = readSource(
  'src/components/workouts/exercise-library/workoutExerciseLibraryCardStyles.ts',
);

describe('LG-5 live Workouts Exercise Library theme/material contract', () => {
  it('proves the route is current-product live and follows the active theme', () => {
    expect(workoutsScreen).toContain("router.push('/workouts/exercise-library')");
    expect(route).toContain("import { useAppTheme } from '@/theme/AppThemeProvider'");
    expect(route).toContain('const { colors } = useAppTheme()');
    expect(route).toContain('backgroundColor: colors.background');
    expect(route).not.toContain('Colors.dark');
  });

  it('builds the browser from the active appearance and Liquid Glass palette', () => {
    expect(browser).toContain('const { colors, resolvedAppearance } = useAppTheme()');
    expect(browser).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(browser).toContain('createWorkoutExerciseLibraryCardStyles(colors, glass)');
    expect(browser).toContain('placeholderTextColor={colors.textSecondary}');
    expect(browser).not.toContain('Colors.dark');

    expect(styles).toContain('colors.textPrimary');
    expect(styles).toContain('colors.textSecondary');
    expect(styles).toContain('colors.surfacePrimary');
    expect(styles).toContain('colors.overlay');
    expect(styles).toContain('glass.cardFill');
    expect(styles).toContain('glass.cardBorder');
    expect(styles).toContain('glass.controlFill');
    expect(styles).toContain('glass.controlPressedFill');
    expect(styles).toContain('glass.accentFill');
    expect(styles).toContain('glass.accentPressedFill');
    expect(styles).toContain('glass.semanticWarningFill');
    expect(styles).toContain('glass.elevatedFill');
    expect(styles).not.toContain('Colors.dark');
    expect(styles).not.toContain('opacity: 0.78');
  });

  it('uses material-specific feedback instead of one generic pressed style', () => {
    expect(browser).toContain('pressed && styles.collapsibleHeaderPressed');
    expect(row).toContain('pressed && styles.exerciseMainPressed');
    expect(row).toContain('pressed && styles.favoriteTogglePressed');
    expect(filters).toContain('styles.filterChipSelectedPressed');
    expect(filters).toContain('styles.filterChipPressed');
    expect(filters).toContain('pressed && styles.clearFiltersButtonPressed');
    expect(detail).toContain('pressed && styles.sheetFavoritePressed');
    expect(detail).toContain('pressed && styles.similarMainPressed');

    for (const source of [browser, row, filters, detail]) {
      expect(source).not.toContain('pressed && styles.pressed');
    }
  });

  it('preserves library data, favorite, custom-exercise and virtualization contracts', () => {
    expect(browser).toContain('loadWorkoutExerciseFavoriteIds()');
    expect(browser).toContain('saveWorkoutExerciseFavoriteIds(filteredIds)');
    expect(browser).toContain('searchExercises(exercises, searchQuery)');
    expect(browser).toContain('getRecentExercisesFromWorkoutSessions(workoutSessions, exercises, 10)');
    expect(browser).toContain('<SectionList');
    expect(browser).toContain('keyExtractor={(exercise) => exercise.id}');
    expect(browser).toContain('contentContainerStyle={{ paddingBottom: bottomInset + Spacing.three }}');

    expect(route).toContain('addExercise({');
    expect(route).toContain('onDeleteExercise={deleteExercise}');
    expect(route).toContain('isExerciseAdded={(name) => isExerciseAdded.has(name.toLowerCase())}');
  });
});
