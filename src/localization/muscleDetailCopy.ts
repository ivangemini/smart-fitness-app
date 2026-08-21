import type { SupportedLocale } from '@/localization/messages';

export const getMuscleDetailCopy = (locale: SupportedLocale) => ({
  subtitle:
    locale === 'ru'
      ? 'Упражнения с подтверждённым сопоставлением и ваша история по ним.'
      : 'Exercises with confirmed mapping and your training history for them.',
  primary: locale === 'ru' ? 'Основная мышца' : 'Primary muscle',
  secondary: locale === 'ru' ? 'Дополнительная мышца' : 'Secondary muscle',
  sessions: locale === 'ru' ? 'Сессии' : 'Sessions',
  completedSets: locale === 'ru' ? 'Завершённые подходы' : 'Completed sets',
  lastTrained: locale === 'ru' ? 'Последняя тренировка' : 'Last trained',
  noHistory: locale === 'ru' ? 'Истории пока нет' : 'No history yet',
  noExercises:
    locale === 'ru'
      ? 'Нет упражнений с точным сопоставлением этой мышцы.'
      : 'No exercises have an exact mapping for this muscle.',
  loadError:
    locale === 'ru'
      ? 'Не удалось загрузить библиотеку упражнений.'
      : 'Could not load the exercise library.',
  loading: locale === 'ru' ? 'Загрузка упражнений…' : 'Loading exercises…',
  openExercise: locale === 'ru' ? 'Открыть упражнение' : 'Open exercise',
  back: locale === 'ru' ? 'Назад' : 'Back',
  invalidMuscle: locale === 'ru' ? 'Неизвестная мышечная группа' : 'Unknown muscle group',
});