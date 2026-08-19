import type { SupportedLocale } from '@/localization/messages';

export const getCoachActivityProgressContextCopy = (locale: SupportedLocale) => ({
  title: locale === 'ru' ? 'Контекст активности из Progress' : 'Activity context from Progress',
  description:
    locale === 'ru'
      ? 'Companion использует ограниченную сводку тренировочной активности за выбранный период без передачи истории тренировок через навигацию.'
      : 'Companion uses a bounded training-activity summary for the selected period without passing workout history through navigation.',
  summary: (sessions: string, days: string) =>
    locale === 'ru'
      ? `Тренировок: ${sessions} за ${days} дн.`
      : `${sessions} workouts across ${days} days.`,
  noMatchingHistory:
    locale === 'ru'
      ? 'В выбранном периоде нет записанных тренировок.'
      : 'No recorded workouts were found in the selected period.',
  unavailable:
    locale === 'ru'
      ? 'Контекст активности не удалось безопасно подготовить.'
      : 'The activity context could not be prepared safely.',
  boundedPeriod: (requested: string, used: string) =>
    locale === 'ru'
      ? `Запрошено ${requested} дн.; для Companion безопасно используется максимум ${used} дн.`
      : `${requested} days were selected; Companion safely uses at most ${used} days.`,
  openProgress: locale === 'ru' ? 'Открыть активность' : 'Open activity',
});
