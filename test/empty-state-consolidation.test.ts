import { describe, expect, test } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { existsSync, readFileSync, readdirSync, statSync } = require('fs') as {
  existsSync: (path: string) => boolean;
  readFileSync: (path: string, encoding: string) => string;
  readdirSync: (path: string) => string[];
  statSync: (path: string) => { isDirectory(): boolean };
};
const { resolve } = require('path') as { resolve: (...parts: string[]) => string };

const projectRoot = resolve(__dirname, '..');
const sourceRoot = resolve(projectRoot, 'src');
const readSource = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), 'utf8');
const collectSourceFiles = (directory: string): string[] =>
  readdirSync(directory).flatMap((entry) => {
    const path = resolve(directory, entry);
    return statSync(path).isDirectory() ? collectSourceFiles(path) : [path];
  });

const removedWrapperPaths = [
  'src/components/nutrition/EmptyNutritionState.tsx',
  'src/components/nutrition/NutritionEmptyState.tsx',
  'src/components/progress/EmptyProgressState.tsx',
  'src/components/workouts/EmptyWorkoutState.tsx',
] as const;
const removedWrapperSymbols = [
  'EmptyNutritionState',
  'NutritionEmptyState',
  'EmptyProgressState',
  'EmptyWorkoutState',
] as const;

describe('empty-state consolidation', () => {
  test('removes the redundant domain wrappers', () => {
    for (const path of removedWrapperPaths) {
      expect(existsSync(resolve(projectRoot, path))).toBe(false);
    }
  });

  test('does not retain imports or uses of removed wrapper symbols', () => {
    const source = collectSourceFiles(sourceRoot)
      .filter((path) => /\.(ts|tsx)$/.test(path))
      .map((path) => readFileSync(path, 'utf8'))
      .join('\n');

    for (const symbol of removedWrapperSymbols) {
      expect(source).not.toContain(symbol);
    }
  });

  test.each([
    'src/components/workouts/WorkoutBuilderCard.tsx',
    'src/components/workouts/WorkoutExerciseLibraryCard.tsx',
    'src/components/workouts/WorkoutHistorySection.tsx',
  ])('%s uses the shared compact EmptyState', (path) => {
    const source = readSource(path);

    expect(source).toContain("import { EmptyState } from '@/components/ui/EmptyState'");
    expect(source).toContain('<EmptyState');
    expect(source).toContain('compact');
  });

  test('Progress delegates first-level empty copy to the shared overview card', () => {
    const source = readSource('src/app/(tabs)/progress.tsx');

    expect(source).toContain("import { ProgressOverviewCard } from '@/components/progress/ProgressOverviewCard';");
    expect(source).toContain('emptyMessage={copy.noBodyData}');
    expect(source).toContain('emptyMessage={copy.noTrainingData}');
    expect(source).toContain('emptyMessage={copy.noActivityData}');
    expect(source).toContain('emptyMessage={copy.noTrainingEvidence}');
  });
});
