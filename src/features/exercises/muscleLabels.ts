import type { SupportedLocale } from '@/localization/messages';

import { CANONICAL_MUSCLES, type CanonicalMuscleId } from './muscleTaxonomy';

const RU_LABELS: Record<CanonicalMuscleId, string> = {
  chest: 'Грудь',
  'front-delts': 'Передние дельты',
  'side-delts': 'Средние дельты',
  'rear-delts': 'Задние дельты',
  biceps: 'Бицепс',
  triceps: 'Трицепс',
  forearms: 'Предплечья',
  abs: 'Пресс',
  obliques: 'Косые мышцы',
  lats: 'Широчайшие',
  traps: 'Трапеции',
  'lower-back': 'Поясница',
  glutes: 'Ягодичные',
  quads: 'Квадрицепс',
  hamstrings: 'Бицепс бедра',
  calves: 'Икры',
};

export const getCanonicalMuscleLabel = (id: CanonicalMuscleId, locale: SupportedLocale) =>
  locale === 'ru'
    ? RU_LABELS[id]
    : CANONICAL_MUSCLES.find((muscle) => muscle.id === id)?.label ?? id;