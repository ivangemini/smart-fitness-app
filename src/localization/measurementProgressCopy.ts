import type { SupportedLocale } from './messages';

export const getMeasurementProgressCopy = (locale: SupportedLocale) => ({
  title: locale === 'ru' ? 'Измерения тела' : 'Body measurements',
  subtitle:
    locale === 'ru'
      ? 'Динамика окружностей и процента жира по записанным измерениям.'
      : 'Circumference and body-fat trends from recorded measurements.',
  period: locale === 'ru' ? 'Период' : 'Period',
  periodAccessibility:
    locale === 'ru' ? 'Период анализа измерений' : 'Measurement analysis period',
  metric: locale === 'ru' ? 'Показатель' : 'Metric',
  noData:
    locale === 'ru'
      ? 'В выбранном периоде нет сравнимых числовых измерений.'
      : 'No comparable numeric measurements in the selected period.',
  unavailable: locale === 'ru' ? 'Недоступно' : 'Unavailable',
  current: locale === 'ru' ? 'Текущее значение' : 'Current value',
  periodChange: locale === 'ru' ? 'Изменение за период' : 'Period change',
  entries: locale === 'ru' ? 'Записи' : 'Entries',
  trend: locale === 'ru' ? 'Динамика' : 'Trend',
  chartNeedsData:
    locale === 'ru'
      ? 'Нужно минимум два сравнимых измерения этого показателя.'
      : 'At least two comparable measurements are needed for this metric.',
  recentEntries: locale === 'ru' ? 'Недавние записи' : 'Recent entries',
  askCoach:
    locale === 'ru' ? 'Обсудить показатель с Companion' : 'Ask Companion about this metric',
  percentPointsUnit: locale === 'ru' ? 'п.п.' : 'pp',
  pointsTruncated: (count: string) =>
    locale === 'ru'
      ? `Показаны последние 24 точки; всего сравнимых записей: ${count}.`
      : `Showing the latest 24 points; total comparable entries: ${count}.`,
  unresolved: (count: string) =>
    locale === 'ru'
      ? `${count} старых записей в периоде нельзя безопасно преобразовать в числовой ряд.`
      : `${count} legacy entries in the period could not be safely converted to a numeric series.`,
  groupsTruncated:
    locale === 'ru'
      ? 'Показаны последние 20 показателей.'
      : 'Showing the latest 20 measurement metrics.',
  back: locale === 'ru' ? 'Назад' : 'Back',
});
