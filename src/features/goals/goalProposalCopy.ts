import type { GoalProposalChange } from './goalProposal';

type Locale = 'en' | 'ru';
type GoalProposalField = GoalProposalChange['field'];

export type GoalProposalCopy = {
  reviewChanges: string;
  reviewTitle: string;
  reviewBody: string;
  fieldLabels: Record<GoalProposalField, string>;
  apply: string;
  cancel: string;
  boundary: string;
  staleTitle: string;
  staleBody: string;
  noChangesTitle: string;
  noChangesBody: string;
  savedTitle: string;
  savedBody: string;
  perWeek: string;
};

const COPY: Record<Locale, GoalProposalCopy> = {
  en: {
    reviewChanges: 'Review changes',
    reviewTitle: 'Review goal changes',
    reviewBody: 'This is still a preview. Nothing is saved until you confirm.',
    fieldLabels: {
      goalType: 'Goal',
      targetWeight: 'Target weight',
      weeklyWeightChangeGoal: 'Weekly weight change',
      trainingDaysPerWeek: 'Training days per week',
    },
    apply: 'Apply goal changes',
    cancel: 'Keep editing',
    boundary:
      'Only the listed goal fields will change. Nutrition targets and training programs stay unchanged.',
    staleTitle: 'Goals changed elsewhere',
    staleBody:
      'Your saved goals changed after this preview was created. Review the latest values before applying a new proposal.',
    noChangesTitle: 'No goal changes',
    noChangesBody: 'The proposed values already match your saved goals.',
    savedTitle: 'Goals updated',
    savedBody:
      'Your goal changes are saved. Nutrition targets and training programs were not changed.',
    perWeek: '/week',
  },
  ru: {
    reviewChanges: 'Проверить изменения',
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
      'Изменятся только перечисленные поля целей. Цели питания и тренировочные программы останутся без изменений.',
    staleTitle: 'Сохранённые цели изменились',
    staleBody:
      'После создания предпросмотра сохранённые цели изменились. Проверь актуальные значения перед применением.',
    noChangesTitle: 'Изменений целей нет',
    noChangesBody: 'Предложенные значения уже совпадают с сохранёнными целями.',
    savedTitle: 'Цели обновлены',
    savedBody:
      'Изменения целей сохранены. Цели питания и тренировочные программы не изменялись.',
    perWeek: '/нед.',
  },
};

export const getGoalProposalCopy = (locale: Locale): GoalProposalCopy => COPY[locale];
