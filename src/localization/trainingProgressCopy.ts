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
  trainingSignals: locale === 'ru' ? 'Сигналы тренинга' : 'Training signals',
  progressSignal: locale === 'ru' ? 'Сигнал прогресса' : 'Progress signal',
  comparableSessions: locale === 'ru' ? 'Сравнимые тренировки' : 'Comparable sessions',
  evidenceSpan: locale === 'ru' ? 'Период наблюдения' : 'Evidence span',
  recordedRpe: locale === 'ru' ? 'Записанный RPE' : 'Recorded RPE',
  rpeCoverage: locale === 'ru' ? 'Покрытие RPE' : 'RPE coverage',
  rpeTrend: locale === 'ru' ? 'Тренд RPE' : 'RPE trend',
  daysValue: (days: string) => (locale === 'ru' ? `${days} дн.` : `${days} days`),
  recordedSetsValue: (recorded: string, working: string) =>
    locale === 'ru' ? `${recorded} из ${working}` : `${recorded} of ${working}`,
  progressSignalValue: (signal: 'progressing' | 'plateau' | 'declining' | 'insufficient_data') => {
    switch (signal) {
      case 'progressing':
        return locale === 'ru' ? 'Рост' : 'Progressing';
      case 'plateau':
        return locale === 'ru' ? 'Плато' : 'Plateau';
      case 'declining':
        return locale === 'ru' ? 'Снижение' : 'Declining';
      default:
        return locale === 'ru' ? 'Недостаточно данных' : 'Not enough data';
    }
  },
  rpeTrendValue: (trend: 'higher' | 'lower' | 'stable' | 'insufficient_data') => {
    switch (trend) {
      case 'higher':
        return locale === 'ru' ? 'Выше' : 'Higher';
      case 'lower':
        return locale === 'ru' ? 'Ниже' : 'Lower';
      case 'stable':
        return locale === 'ru' ? 'Стабильно' : 'Stable';
      default:
        return locale === 'ru' ? 'Недостаточно данных' : 'Not enough data';
    }
  },
  signalMethodNote:
    locale === 'ru'
      ? 'Плато показывается только при ≥4 сравнимых тренировках минимум за 21 день; незаписанный RPE не восстанавливается.'
      : 'Plateau is shown only with ≥4 comparable sessions spanning at least 21 days; missing RPE is never inferred.',
  openInCoach: locale === 'ru' ? 'Открыть в Companion' : 'Open in Companion',
  openWorkoutHistory:
    locale === 'ru' ? 'Открыть историю тренировок' : 'Open workout history',
  back: locale === 'ru' ? 'Назад' : 'Back',
});
