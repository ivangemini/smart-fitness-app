import type { SupportedLocale } from '@/localization/messages';

export const getCoachHighlightsProgressContextCopy = (locale: SupportedLocale) => ({
  title: locale === 'ru' ? 'Контекст: силовые сигналы' : 'Context: strength signals',
  description:
    locale === 'ru'
      ? 'Companion заново собрал ограниченные силовые тренды из записанных тренировок.'
      : 'Companion rebuilt bounded strength trends from recorded workouts.',
  summary: (sessions: string, days: string) =>
    locale === 'ru'
      ? `${sessions} тренировок за ${days} дн. использовано для трендов.`
      : `${sessions} workouts across ${days} days were used for trend evidence.`,
  noMatchingHistory:
    locale === 'ru'
      ? 'Недостаточно сопоставимых силовых данных для трендов.'
      : 'There is not enough comparable strength evidence for trends.',
  recordBoundary:
    locale === 'ru'
      ? 'Статус all-time рекордов не передаётся: Companion сохраняет 90-дневную границу истории.'
      : 'All-time record status is not handed off: Companion keeps the 90-day history boundary.',
  boundedPeriod: (requested: string, used: string) =>
    locale === 'ru'
      ? `На экране выбрано ${requested} дн.; Companion использует максимум ${used} дн.`
      : `Progress selected ${requested} days; Companion uses at most ${used} days.`,
  openProgress: locale === 'ru' ? 'Открыть Главное' : 'Open Highlights',
});
