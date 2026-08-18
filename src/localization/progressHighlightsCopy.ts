import type { SupportedLocale } from './messages';

export const getProgressHighlightsCopy = (locale: SupportedLocale) => ({
  title: locale === 'ru' ? 'Главное' : 'Highlights',
  subtitle:
    locale === 'ru'
      ? 'Рекорды и силовые сигналы из записанных рабочих подходов.'
      : 'Records and strength signals from recorded working sets.',
  period: locale === 'ru' ? 'Период' : 'Period',
  periodAccessibility: locale === 'ru' ? 'Период основных сигналов' : 'Highlights analysis period',
  summary: locale === 'ru' ? 'Сводка сигналов' : 'Signal summary',
  records: locale === 'ru' ? 'Новые расчётные рекорды 1ПМ' : 'New estimated 1RM records',
  improving: locale === 'ru' ? 'Рост' : 'Trending up',
  declining: locale === 'ru' ? 'Снижение' : 'Trending down',
  stable: locale === 'ru' ? 'Стабильно' : 'Stable',
  sessions: locale === 'ru' ? 'Тренировки' : 'Sessions',
  comparableSets: locale === 'ru' ? 'Подходы для e1RM' : 'e1RM-comparable sets',
  noTraining:
    locale === 'ru'
      ? 'В выбранном периоде недостаточно тренировочных данных для сигналов.'
      : 'There is not enough training evidence for highlights in the selected period.',
  noItems: locale === 'ru' ? 'Нет сигналов этой категории.' : 'No signals in this category.',
  recordDetail: (value: string, unit: string, date: string) =>
    locale === 'ru' ? `${value} ${unit} e1RM · ${date}` : `${value} ${unit} e1RM · ${date}`,
  trendDetail: (previous: string, recent: string, unit: string) =>
    locale === 'ru'
      ? `${previous} → ${recent} ${unit} e1RM`
      : `${previous} → ${recent} ${unit} e1RM`,
  truncated:
    locale === 'ru'
      ? 'Показаны первые 12 упражнений этой категории.'
      : 'Showing the first 12 exercises in this category.',
  openStrength: locale === 'ru' ? 'Открыть силу и тренировки' : 'Open Strength & Training',
  back: locale === 'ru' ? 'Назад' : 'Back',
});
