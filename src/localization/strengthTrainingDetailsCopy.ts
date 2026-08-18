import type { SupportedLocale } from './messages';

export const getStrengthTrainingDetailsCopy = (locale: SupportedLocale) => ({
  title: locale === 'ru' ? 'Сила и тренировки' : 'Strength & Training',
  subtitle:
    locale === 'ru'
      ? 'Динамика выбранного упражнения по завершённым тренировкам.'
      : 'Progress for one exercise across completed workouts.',
  period: locale === 'ru' ? 'Период' : 'Period',
  periodAccessibility:
    locale === 'ru' ? 'Период анализа упражнения' : 'Exercise analysis period',
  exercise: locale === 'ru' ? 'Упражнение' : 'Exercise',
  noExercises:
    locale === 'ru'
      ? 'Завершите тренировку с записанными подходами, чтобы выбрать упражнение.'
      : 'Complete a workout with logged sets to choose an exercise.',
  noSeries:
    locale === 'ru'
      ? 'В выбранном периоде нет записанных подходов по этому упражнению.'
      : 'No logged sets for this exercise in the selected period.',
  sessions: locale === 'ru' ? 'Тренировки' : 'Sessions',
  latestBestWeight: locale === 'ru' ? 'Последний лучший вес' : 'Latest best weight',
  periodBestWeight: locale === 'ru' ? 'Лучший вес за период' : 'Period best weight',
  latestEstimated1Rm: locale === 'ru' ? 'Последний расчётный 1ПМ' : 'Latest estimated 1RM',
  periodBestEstimated1Rm:
    locale === 'ru' ? 'Лучший расчётный 1ПМ за период' : 'Period best estimated 1RM',
  estimated1RmTrend: locale === 'ru' ? 'Расчётный 1ПМ' : 'Estimated 1RM',
  bestWeightTrend: locale === 'ru' ? 'Лучший вес' : 'Best weight',
  chartNeedsMore:
    locale === 'ru'
      ? 'Нужно минимум две сопоставимые тренировки, чтобы построить график.'
      : 'At least two comparable sessions are needed to draw a chart.',
  recordedSessions: (shown: number, total: number) =>
    locale === 'ru' ? `Показано ${shown} из ${total}` : `Showing ${shown} of ${total}`,
  workoutHistory: locale === 'ru' ? 'История тренировок' : 'Workout history',
  back: locale === 'ru' ? 'Назад' : 'Back',
});
