import type { SupportedLocale } from '@/localization/messages';

export const getExerciseProgressCopy = (locale: SupportedLocale) => {
  const ru = locale === 'ru';
  return {
    latestPerformance: ru ? 'Последняя тренировка' : 'Latest session',
    latestTopSet: ru ? 'Лучший подход' : 'Top set',
    previousTopSet: ru ? 'Предыдущий лучший' : 'Previous top set',
    averageRpe: ru ? 'Средний RPE' : 'Average RPE',
    estimatedOneRepMaxChange: ru ? 'Изменение 1ПМ' : 'Est. 1RM change',
    volumeChange: ru ? 'Изменение объёма' : 'Volume change',
    notRecorded: ru ? 'Не записан' : 'Not recorded',
    notEnoughEvidence: ru ? 'Недостаточно данных' : 'Not enough data',
    loadTrend: ru ? 'Динамика рабочего веса' : 'Load trend',
    estimatedOneRepMaxTrend: ru ? 'Динамика примерного 1ПМ' : 'Estimated 1RM trend',
    trendEmpty: ru
      ? 'Выполните упражнение минимум в двух тренировках, чтобы увидеть динамику.'
      : 'Log this exercise in at least two workouts to show a trend.',
  };
};
