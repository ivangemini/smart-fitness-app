import type { SupportedLocale } from '@/localization/messages';

export const getCoachMeasurementProgressContextCopy = (locale: SupportedLocale) => ({
  title:
    locale === 'ru' ? 'Контекст измерения из Progress' : 'Measurement context from Progress',
  description:
    locale === 'ru'
      ? 'Companion использует только выбранный показатель измерений за ограниченный период. Вес и другие измерения в этот контекст не входят.'
      : 'Companion uses only the selected measurement metric for a bounded period. Weight and other measurements are excluded from this context.',
  summary: (label: string, entryCount: string, days: string) =>
    locale === 'ru'
      ? `${label}: записей ${entryCount} за ${days} дн.`
      : `${label}: ${entryCount} entries across ${days} days.`,
  noMatchingHistory:
    locale === 'ru'
      ? 'В выбранном периоде нет записей этого показателя.'
      : 'No entries for this metric were found in the selected period.',
  unavailable:
    locale === 'ru'
      ? 'Контекст измерения не удалось безопасно подготовить.'
      : 'The measurement context could not be prepared safely.',
  boundedPeriod: (requested: string, used: string) =>
    locale === 'ru'
      ? `Запрошено ${requested} дн.; для Companion безопасно используется максимум ${used} дн.`
      : `${requested} days were selected; Companion safely uses at most ${used} days.`,
  openProgress: locale === 'ru' ? 'Открыть измерения' : 'Open measurements',
});
