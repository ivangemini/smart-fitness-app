import { describe, expect, it } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as {
  readFileSync(path: string, encoding: string): string;
};
const { resolve } = require('path') as {
  resolve(...parts: string[]): string;
};

const projectRoot = resolve(__dirname, '..');
const readSource = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), 'utf8');

describe('Exercise Detail localization and progress presentation', () => {
  it('provides bounded English and Russian copy with typed errors', () => {
    const copy = readSource('src/localization/exerciseDetailCopy.ts');

    expect(copy).toContain("ExerciseDetailErrorCode = 'missing' | 'not_found' | 'load_failed'");
    expect(copy).toContain('Об упражнении');
    expect(copy).toContain('About');
    expect(copy).toContain('Истории пока нет');
    expect(copy).toContain('No history yet');
    expect(copy).toContain('Динамика объёма');
    expect(copy).toContain('Volume trend');
    expect(copy).toContain('shareMessage:');
  });

  it('uses locale and selected-unit boundaries without raw diagnostics', () => {
    const screen = readSource('src/features/exercises/screens/ExerciseDetailScreen.tsx');
    const progress = readSource(
      'src/features/exercises/components/ExerciseProgressSection.tsx',
    );

    expect(screen).toContain('getExerciseDetailCopy(locale)');
    expect(screen).toContain('formatDate(group.finishedAt');
    expect(screen).toContain('formatNumber(set.reps');
    expect(screen).toContain('formatWeightValue(valueKg)');
    expect(progress).toContain('getExerciseDetailCopy(locale)');
    expect(progress).toContain('weightFromKg(valueKg, weightUnit)');
    expect(progress).toContain('displayValue: `${formatNumber(value');
    for (const source of [screen, progress]) {
      expect(source).not.toContain('new Intl.');
      expect(source).not.toContain('.toLocaleString(');
      expect(source).not.toContain('.toFixed(');
    }
    expect(screen).not.toContain('Exercise media diagnostics');
    expect(screen).not.toContain('exercise.source.sourceId:');
    expect(screen).not.toContain('nativeImageError:');
    expect(screen).not.toContain("setError('Missing exercise.')");
    expect(screen).not.toContain("setError('Exercise not found.')");
  });

  it('does not retain audited hard-coded controls and empty states', () => {
    const screen = readSource('src/features/exercises/screens/ExerciseDetailScreen.tsx');
    const progress = readSource(
      'src/features/exercises/components/ExerciseProgressSection.tsx',
    );

    for (const literal of [
      'Loading exercise',
      'Exercise detail sections',
      'Share Exercise',
      'Add to Favorites',
      'No history yet',
      'No progress yet',
      'Best weight',
      'Volume trend',
    ]) {
      expect(screen).not.toContain(`>${literal}<`);
      expect(screen).not.toContain(`"${literal}"`);
      expect(progress).not.toContain(`>${literal}<`);
      expect(progress).not.toContain(`"${literal}"`);
    }
    expect(screen).toContain('copy.sectionsAccessibility');
    expect(screen).toContain('copy.noHistoryTitle');
    expect(progress).toContain('copy.noProgressTitle');
    expect(progress).toContain('copy.bestWeight');
  });

  it('preserves exercise loading, media, favorites, share and analytics behavior', () => {
    const screen = readSource('src/features/exercises/screens/ExerciseDetailScreen.tsx');
    const progress = readSource(
      'src/features/exercises/components/ExerciseProgressSection.tsx',
    );

    expect(screen).toContain('exerciseRepository.getExerciseById(exerciseId)');
    expect(screen).toContain('loadFavoriteExerciseIds()');
    expect(screen).toContain('saveFavoriteExerciseIds(nextFavoriteIds)');
    expect(screen).toContain('selectCompletedSetsByExerciseId(workoutSessions, exercise.id)');
    expect(progress).toContain('calculateExerciseProgressMetrics(historyGroups)');
    expect(screen).toContain('<ExerciseProgressSection historyGroups={historyGroups}');
    expect(screen).toContain('<ExerciseMediaPreview');
    expect(screen).toContain('onMediaError={() => setMediaFailed(true)}');
    expect(screen).toContain('setPlaying((current) => !current)');
    expect(screen).toContain('Share.share({');
    expect(screen).toContain('key={group.sessionId}');
    expect(screen).toContain('key={set.id}');
    expect(screen).toContain("exercise.source.provider === 'oss-exercisedb'");
  });
});
