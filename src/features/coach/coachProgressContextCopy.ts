import type { SupportedLocale } from '@/localization/messages';

export const getCoachProgressContextCopy = (locale: SupportedLocale) => ({
  title: locale === 'ru' ? 'Контекст из прогресса' : 'Progress context',
  description:
    locale === 'ru'
      ? 'Companion использует только выбранное упражнение и ограниченную историю тренировок.'
      : 'Companion uses only the selected exercise and a bounded slice of training history.',
  exerciseSummary: (exerciseName: string, sessionCount: string, days: string) =>
    locale === 'ru'
      ? `${exerciseName}: ${sessionCount} тренировок за ${days} дн.`
      : `${exerciseName}: ${sessionCount} sessions across ${days} days.`,
  boundedPeriod: (requestedDays: string, retrievalDays: string) =>
    locale === 'ru'
      ? `В Progress выбран период ${requestedDays} дн.; контекст Companion ограничен последними ${retrievalDays} дн.`
      : `Progress is showing ${requestedDays} days; Companion context is bounded to the latest ${retrievalDays} days.`,
  noMatchingHistory:
    locale === 'ru'
      ? 'В ограниченном периоде нет подходящих записей по этому упражнению.'
      : 'No matching exercise history was found in the bounded period.',
  unavailable:
    locale === 'ru'
      ? 'Контекст Progress не удалось безопасно подготовить.'
      : 'The Progress context could not be prepared safely.',
  openProgress: locale === 'ru' ? 'Открыть детали прогресса' : 'Open Progress details',
});
