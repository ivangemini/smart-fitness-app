import type { GoalFacts } from '@/features/goals/goalFacts';

const copy = {
  en: {
    title: 'Goal context',
    description: 'Companion rebuilt this from your saved goal, recorded weight and completed training history.',
    goal: 'Goal',
    targetWeight: 'Target weight',
    currentWeight: 'Current weight',
    trainingDays: 'Active days · last 7 days',
    unavailable: 'Not recorded',
    openProgress: 'Open Progress',
    goalType: {
      lose_fat: 'Fat loss',
      maintain: 'Maintain',
      gain_muscle: 'Muscle gain',
    },
  },
  ru: {
    title: 'Контекст цели',
    description: 'Компаньон заново собрал эти данные из сохранённой цели, записанного веса и истории завершённых тренировок.',
    goal: 'Цель',
    targetWeight: 'Целевой вес',
    currentWeight: 'Текущий вес',
    trainingDays: 'Активных дней · 7 дней',
    unavailable: 'Нет данных',
    openProgress: 'Открыть прогресс',
    goalType: {
      lose_fat: 'Снижение жира',
      maintain: 'Поддержание',
      gain_muscle: 'Набор мышц',
    },
  },
} as const;

export const getCoachGoalProgressContextCopy = (locale: 'en' | 'ru') => copy[locale];

export const getCoachGoalTypeCopy = (
  locale: 'en' | 'ru',
  goalType: GoalFacts['goalType'],
) => copy[locale].goalType[goalType];
