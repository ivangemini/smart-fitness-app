import type { AppLocale } from '@/localization';
import type { GoalPlanningField } from './goalPlanningProposal';

export type GoalPlanningCopy = {
  reviewTitle: string;
  reviewBody: string;
  fieldLabels: Record<GoalPlanningField, string>;
  apply: string;
  cancel: string;
  boundary: string;
  staleTitle: string;
  staleBody: string;
  noChangesTitle: string;
  noChangesBody: string;
  savedTitle: string;
  savedBody: string;
  nutritionTitle: string;
  nutritionBody: string;
  recalculateNutrition: string;
  keepNutrition: string;
};

const COPY: Record<AppLocale, GoalPlanningCopy> = {
  en: {
    reviewTitle: 'Review goal changes',
    reviewBody: 'These changes are still a preview. Nothing is saved until you confirm.',
    fieldLabels: {
      goalType: 'Goal',
      targetWeight: 'Target weight',
      weeklyWeightChangeGoal: 'Weekly weight change',
      trainingDaysPerWeek: 'Training days per week',
    },
    apply: 'Apply goal changes',
    cancel: 'Keep editing',
    boundary:
      'Only the listed goal fields will change. Nutrition targets stay unchanged unless you confirm a separate recalculation after saving.',
    staleTitle: 'Goals changed elsewhere',
    staleBody:
      'Your saved goals changed after this preview was created. Review the latest values before applying a new proposal.',
    noChangesTitle: 'No goal changes',
    noChangesBody: 'The proposed values already match your saved goals.',
    savedTitle: 'Goals saved',
    savedBody: 'Your goal settings were updated. Nutrition targets were not changed.',
    nutritionTitle: 'Recalculate nutrition targets?',
    nutritionBody:
      'This is a separate change based on your current recorded weight, activity level and saved goal.',
    recalculateNutrition: 'Recalculate nutrition',
    keepNutrition: 'Keep current nutrition',
  },
  ru: {
    reviewTitle: 'Проверь изменения целей',
    reviewBody: 'Пока это только предпросмотр. Ничего не сохранится до подтверждения.',
    fieldLabels: {
      goalType: 'Цель',
      targetWeight: 'Целевой вес',
      weeklyWeightChangeGoal: 'Изменение веса в неделю',
      trainingDaysPerWeek: 'Тренировочных дней в неделю',
    },
    apply: 'Применить изменения целей',
    cancel: 'Продолжить редактирование',
    boundary:
      'Изменятся только перечисленные поля целей. Цели по питанию останутся прежними, пока ты отдельно не подтвердишь пересчёт после сохранения.',
    staleTitle: 'Сохранённые цели изменились',
    staleBody:
      'После создания предпросмотра сохранённые цели изменились. Сначала проверь актуальные значения и создай новый предпросмотр.',
    noChangesTitle: 'Изменений целей нет',
    noChangesBody: 'Предложенные значения уже совпадают с сохранёнными целями.',
    savedTitle: 'Цели сохранены',
    savedBody: 'Настройки целей обновлены. Цели по питанию не изменялись.',
    nutritionTitle: 'Пересчитать цели по питанию?',
    nutritionBody:
      'Это отдельное изменение на основе текущего записанного веса, уровня активности и сохранённой цели.',
    recalculateNutrition: 'Пересчитать питание',
    keepNutrition: 'Оставить текущее питание',
  },
};

export const getGoalPlanningCopy = (locale: AppLocale): GoalPlanningCopy => COPY[locale];
