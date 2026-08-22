import type { SupportedLocale } from './messages';

export const getWorkoutAssistantCopy = (locale: SupportedLocale) => ({
  add15Seconds: locale === 'ru' ? 'Добавить 15 секунд отдыха' : 'Add 15 seconds of rest',
  adjustmentApply: locale === 'ru' ? 'Применить' : 'Apply',
  adjustmentDecrease:
    locale === 'ru' ? 'Снизить оставшийся рабочий вес' : 'Lower remaining working weight',
  adjustmentIgnore: locale === 'ru' ? 'Игнорировать' : 'Ignore',
  adjustmentIncrease:
    locale === 'ru' ? 'Повысить оставшийся рабочий вес' : 'Raise remaining working weight',
  amrap: 'AMRAP',
  backoff: locale === 'ru' ? 'Облегчённый' : 'Back-off',
  drop: locale === 'ru' ? 'Дроп' : 'Drop',
  editSet: locale === 'ru' ? 'Изменить подход' : 'Edit set',
  linkSuperset: (exercise: string) =>
    locale === 'ru' ? `Связать в суперсет с «${exercise}»` : `Link superset with ${exercise}`,
  nextSetType: (type: string) =>
    locale === 'ru' ? `Следующий тип: ${type}` : `Next type: ${type}`,
  pauseRest: locale === 'ru' ? 'Поставить таймер отдыха на паузу' : 'Pause rest timer',
  reduce15Seconds: locale === 'ru' ? 'Уменьшить отдых на 15 секунд' : 'Reduce rest by 15 seconds',
  restTimer: (remaining: string) =>
    locale === 'ru' ? `Таймер отдыха: ${remaining}` : `Rest timer: ${remaining}`,
  resumeRest: locale === 'ru' ? 'Продолжить таймер отдыха' : 'Resume rest timer',
  skipRest: locale === 'ru' ? 'Пропустить отдых' : 'Skip rest',
  superset: locale === 'ru' ? 'Суперсет' : 'Superset',
  unlinkSuperset: locale === 'ru' ? 'Убрать связь суперсета' : 'Remove superset link',
  warmup: locale === 'ru' ? 'Разминочные подходы' : 'Warm-up sets',
  warmupAdd: locale === 'ru' ? 'Добавить разминку' : 'Add warm-up sets',
  warmupSkip: locale === 'ru' ? 'Пропустить разминку' : 'Skip warm-up',
  warmupShort: locale === 'ru' ? 'Р' : 'WU',
  working: locale === 'ru' ? 'Рабочий' : 'Working',
});

export type WorkoutAssistantCopy = ReturnType<typeof getWorkoutAssistantCopy>;
