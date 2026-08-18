import type { SupportedLocale } from './messages';

export const getTrainingProgressCopy = (locale: SupportedLocale) => ({
  title: locale === 'ru' ? 'Сила и тренировки' : 'Strength & Training',
  subtitle:
    locale === 'ru'
      ? 'Динамика по записанным тренировкам и упражнениям.'
      : 'Trends from your recorded workouts and exercises.',
  period: locale === 'ru' ? 'Период' : 'Period',
  periodAccessibility:
    locale === 'ru' ? 'Период анализа тренировок' : 'Training analysis period',
  exercise: locale === 'ru' ? 'Упражнение' : 'Exercise',
  noTraining:
    locale === 'ru'
      ? 'В выбранном периоде нет записанных тренировок.'
      : 'No recorded workouts in the selected period.',
  noExercises:
    locale === 'ru'
      ? 'Нет упражнений с записанными рабочими подходами.'
      : 'No exercises with recorded working sets.',
  sessions: locale === 'ru' ? 'Тренировки' : 'Sessions',
  workingSets: locale === 'ru' ? 'Рабочие подходы' : 'Working sets',
  bestWeight: locale === 'ru' ? 'Лучший вес' : 'Best weight',
  bestEstimated1Rm: locale === 'ru' ? 'Лучший e1RM' : 'Best e1RM',
  latestVolume: locale === 'ru' ? 'Объём последней' : 'Latest volume',
  unavailable: locale === 'ru' ? 'Недоступно' : 'Unavailable',
  strengthTrend: locale === 'ru' ? 'Динамика e1RM' : 'e1RM trend',
  chartNeedsData:
    locale === 'ru'
      ? 'Нужно минимум две сравнимые записи e1RM (1–12 повторов с дополнительным весом).'
      : 'At least two comparable e1RM records are needed (1–12 reps with recorded weight).',
  truncated: (count: number) =>
    locale === 'ru'
      ? `Показаны последние точки; всего тренировок с упражнением: ${count}.`
      : `Showing the latest points; total sessions with this exercise: ${count}.`,
  openWorkoutHistory:
    locale === 'ru' ? 'Открыть историю тренировок' : 'Open workout history',
  back: locale === 'ru' ? 'Назад' : 'Back',
});
