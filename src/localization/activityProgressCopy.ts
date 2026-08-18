import type { SupportedLocale } from './messages';

export const getActivityProgressCopy = (locale: SupportedLocale) => ({
  title: locale === 'ru' ? 'Активность' : 'Activity',
  subtitle:
    locale === 'ru'
      ? 'Частота тренировок и регулярность по записанным сессиям.'
      : 'Training frequency and consistency from recorded sessions.',
  period: locale === 'ru' ? 'Период' : 'Period',
  periodAccessibility: locale === 'ru' ? 'Период активности' : 'Activity analysis period',
  summary: locale === 'ru' ? 'Сводка' : 'Summary',
  sessions: locale === 'ru' ? 'Тренировки' : 'Sessions',
  activeDays: locale === 'ru' ? 'Активные дни' : 'Active days',
  workoutsPerWeek: locale === 'ru' ? 'Тренировок в неделю' : 'Workouts per week',
  sessionsLast7Days: locale === 'ru' ? 'За последние 7 дней' : 'Last 7 days',
  latestWorkout: locale === 'ru' ? 'Последняя тренировка' : 'Latest workout',
  noData: locale === 'ru' ? 'В выбранном периоде нет записанных тренировок.' : 'No recorded workouts in the selected period.',
  cadence: locale === 'ru' ? 'Частота по периодам' : 'Training cadence',
  cadenceNeedsData:
    locale === 'ru'
      ? 'Нужно больше истории, чтобы показать динамику частоты.'
      : 'More history is needed to show a cadence trend.',
  bucketSessions: (count: string) =>
    locale === 'ru' ? `${count} трен.` : `${count} sessions`,
  recentSessions: locale === 'ru' ? 'Недавние тренировки' : 'Recent workouts',
  recentSessionsTruncated:
    locale === 'ru'
      ? 'Показаны только последние 12 тренировок выбранного периода.'
      : 'Only the latest 12 workouts in the selected period are shown.',
  openWorkoutHistory: locale === 'ru' ? 'Открыть всю историю' : 'Open full history',
  back: locale === 'ru' ? 'Назад' : 'Back',
});
