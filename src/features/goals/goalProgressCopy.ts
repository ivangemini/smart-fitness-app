import type { GoalFacts } from './goalFacts';

type Locale = 'en' | 'ru';

const copy = {
  en: {
    title: 'Goals',
    subtitle: 'Current goal context from your saved fitness profile.',
    goal: 'Goal',
    targetWeight: 'Target weight',
    currentWeight: 'Current weight',
    trainingActual: 'Active days · last 7 days',
    openProfile: 'Edit goals',
    unavailable: 'Not recorded',
    goalType: {
      lose_fat: 'Fat loss',
      maintain: 'Maintain',
      gain_muscle: 'Muscle gain',
    },
  },
  ru: {
    title: 'Цели',
    subtitle: 'Текущая цель из сохранённого фитнес-профиля.',
    goal: 'Цель',
    targetWeight: 'Целевой вес',
    currentWeight: 'Текущий вес',
    trainingActual: 'Активных дней · 7 дней',
    openProfile: 'Изменить цели',
    unavailable: 'Нет данных',
    goalType: {
      lose_fat: 'Снижение жира',
      maintain: 'Поддержание',
      gain_muscle: 'Набор мышц',
    },
  },
} as const;

export const getGoalProgressCopy = (locale: Locale) => copy[locale];

export const getGoalTypeCopy = (locale: Locale, goalType: GoalFacts['goalType']) =>
  copy[locale].goalType[goalType];
