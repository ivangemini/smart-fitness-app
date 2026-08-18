import type { SupportedLocale } from './messages';

export const getProgressOverviewCopy = (locale: SupportedLocale) => ({
  body: locale === 'ru' ? 'Тело' : 'Body',
  bodyPeriod: locale === 'ru' ? 'Текущие данные и динамика за 7 дней' : 'Current data and 7-day trend',
  bodyNoWeight: locale === 'ru' ? 'Добавьте вес, чтобы начать отслеживать динамику.' : 'Log weight to start tracking your trend.',
  bodyMeasurements: locale === 'ru' ? 'Измерения' : 'Measurements',
  bodyLatestMeasurement: locale === 'ru' ? 'Последнее измерение' : 'Latest measurement',
  bodyNoMeasurements: locale === 'ru' ? 'Измерений пока нет' : 'No measurements yet',
  weightDetails: locale === 'ru' ? 'Вес' : 'Weight',
  measurementsDetails: locale === 'ru' ? 'Измерения' : 'Measurements',
  logWeight: locale === 'ru' ? 'Записать вес' : 'Log weight',

  training: locale === 'ru' ? 'Сила и тренировки' : 'Strength & Training',
  trainingPeriod: locale === 'ru' ? 'Последние 28 дней' : 'Last 28 days',
  workouts: locale === 'ru' ? 'Тренировок' : 'Workouts',
  workoutsPerWeek: locale === 'ru' ? 'В неделю' : 'Per week',
  improvingExercises: locale === 'ru' ? 'Рост силы' : 'Strength trending up',
  trainingNoData:
    locale === 'ru'
      ? 'Завершите тренировку, чтобы здесь появились частота и силовая динамика.'
      : 'Finish a workout to reveal frequency and strength trends.',
  openWorkoutHistory: locale === 'ru' ? 'История' : 'History',

  activity: locale === 'ru' ? 'Активность' : 'Activity',
  activityPeriod: locale === 'ru' ? 'Сегодня' : 'Today',
  steps: locale === 'ru' ? 'шагов' : 'steps',
  activityUnavailable:
    locale === 'ru'
      ? 'Данные шагов недоступны или ещё не разрешены на этом устройстве.'
      : 'Step data is unavailable or not yet permitted on this device.',

  highlights: locale === 'ru' ? 'Главное' : 'Highlights',
  highlightsPeriod: locale === 'ru' ? 'Значимые изменения за 28 дней' : 'Meaningful changes over 28 days',
  estimatedOneRepMaxPr: (exercise: string, value: string) =>
    locale === 'ru'
      ? `${exercise}: новый расчётный 1ПМ ${value}`
      : `${exercise}: new estimated 1RM ${value}`,
  highlightsEmpty:
    locale === 'ru'
      ? 'Пока нет новых силовых рекордов с достаточными данными.'
      : 'No new strength records with sufficient data yet.',
  openExercise: locale === 'ru' ? 'Открыть упражнение' : 'Open exercise',

  bodyMeasurementsTitle: locale === 'ru' ? 'Измерения тела' : 'Body measurements',
  bodyMeasurementsSubtitle:
    locale === 'ru'
      ? 'История и новые записи без перегрузки основного экрана Progress.'
      : 'History and new entries without crowding the Progress overview.',
  recentMeasurements: locale === 'ru' ? 'Последние измерения' : 'Recent measurements',
  addMeasurement: locale === 'ru' ? 'Добавить измерение' : 'Add measurement',
  back: locale === 'ru' ? 'Назад' : 'Back',
});
