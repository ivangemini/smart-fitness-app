import type { SupportedLocale } from '@/localization/messages';

export const getCoachBodyProgressContextCopy = (locale: SupportedLocale) => ({
  title: locale === 'ru' ? 'Контекст веса из Progress' : 'Weight context from Progress',
  description:
    locale === 'ru'
      ? 'Companion использует только записи веса из выбранного периода. Измерения тела в этот контекст не входят.'
      : 'Companion uses only weight entries from the selected period. Body measurements are not included in this context.',
  summary: (entryCount: string, days: string) =>
    locale === 'ru'
      ? `Записей веса: ${entryCount} за ${days} дн.`
      : `${entryCount} weigh-ins across ${days} days.`,
  noMatchingHistory:
    locale === 'ru'
      ? 'В выбранном периоде нет записей веса.'
      : 'No weight entries were found in the selected period.',
  unavailable:
    locale === 'ru'
      ? 'Контекст веса не удалось безопасно подготовить.'
      : 'The weight context could not be prepared safely.',
  openProgress: locale === 'ru' ? 'Открыть динамику веса' : 'Open weight details',
});
