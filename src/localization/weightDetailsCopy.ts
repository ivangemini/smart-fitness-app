import type { SupportedLocale } from './messages';

export const getWeightDetailsCopy = (locale: SupportedLocale) => ({
  title: locale === 'ru' ? 'Динамика веса' : 'Weight details',
  subtitle: locale === 'ru' ? 'Подробный анализ изменений веса.' : 'Detailed trend view.',
  currentWeight: locale === 'ru' ? 'Текущий вес' : 'Current weight',
  trend: locale === 'ru' ? 'Динамика' : 'Trend',
  period: locale === 'ru' ? 'Период' : 'Period',
  periodAccessibility:
    locale === 'ru' ? 'Период динамики веса' : 'Weight trend period',
  trendForDays: (delta: string, unit: string, days: number) =>
    locale === 'ru'
      ? `${delta} ${unit} за выбранные ${days} дней`
      : `${delta} ${unit} over the selected ${days} days`,
  noComparisonForDays: (days: number) =>
    locale === 'ru'
      ? `Для сравнения за ${days} дней пока недостаточно данных`
      : `Not enough data for a ${days}-day comparison yet`,
  chartEmpty:
    locale === 'ru'
      ? 'Добавьте несколько записей веса, чтобы увидеть динамику.'
      : 'Add a few weigh-ins to see the trend.',
  addAnother:
    locale === 'ru'
      ? 'В выбранном периоде нужна ещё одна запись веса, чтобы построить график.'
      : 'Add another weigh-in in the selected period to reveal the chart.',
  recentWeighIns: locale === 'ru' ? 'Последние записи веса' : 'Recent weigh-ins',
  noWeighIns:
    locale === 'ru' ? 'Записей веса пока нет.' : 'No weigh-ins recorded yet.',
  logWeight: locale === 'ru' ? 'Записать вес' : 'Log weight',
  trainingHistory: locale === 'ru' ? 'История тренировок' : 'Training history',
  trainingHistoryBody:
    locale === 'ru'
      ? 'Откройте завершённые тренировки, записанные подходы, значения RPE и контекст безопасности и восстановления перед каждой сессией.'
      : 'Open completed workouts, logged sets, RPE values and the Safety & Recovery context recorded before each session.',
  openWorkoutHistory:
    locale === 'ru' ? 'Открыть историю тренировок' : 'Open workout history',
  back: locale === 'ru' ? 'Назад' : 'Back',
});
