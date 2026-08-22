import type { ExerciseFatigueCost, ExerciseMovementPattern } from './exerciseIntelligence';

type ExerciseIntelligenceCopy = {
  title: string;
  reviewed: string;
  movementPattern: string;
  movementPatterns: Record<ExerciseMovementPattern, string>;
  fatigueCost: string;
  fatigue: Record<ExerciseFatigueCost, string>;
  technique: string;
  commonErrors: string;
  rangeOfMotion: string;
  substitutions: string;
  noSubstitutions: string;
  fatigueDisclaimer: string;
  substitutionDisclaimer: string;
};

const en: ExerciseIntelligenceCopy = {
  title: 'Exercise intelligence',
  reviewed: 'Reviewed guidance for this canonical exercise.',
  movementPattern: 'Movement pattern',
  movementPatterns: {
    'horizontal-push': 'Horizontal push',
    'vertical-push': 'Vertical push',
    'vertical-pull': 'Vertical pull',
    'horizontal-pull': 'Horizontal pull',
    'shoulder-adduction': 'Shoulder horizontal adduction',
    'elbow-flexion': 'Elbow flexion',
    'elbow-extension': 'Elbow extension',
    'shoulder-abduction': 'Shoulder abduction',
    squat: 'Squat',
    'knee-dominant': 'Knee-dominant press',
    hinge: 'Hip hinge',
    'plantar-flexion': 'Plantar flexion',
  },
  fatigueCost: 'Fatigue cost',
  fatigue: { low: 'Low', moderate: 'Moderate', high: 'High' },
  technique: 'Technique cues',
  commonErrors: 'Common errors',
  rangeOfMotion: 'Range of motion',
  substitutions: 'Reviewed substitutions',
  noSubstitutions: 'No reviewed substitution is mapped for this exercise.',
  fatigueDisclaimer:
    'Fatigue cost is a qualitative programming label, not a physiological measurement. Actual fatigue depends on load, volume, effort and the individual.',
  substitutionDisclaimer:
    'Substitutions are reviewed alternatives, not automatic workout changes or claims of exact equivalence.',
};

const ru: ExerciseIntelligenceCopy = {
  title: 'Аналитика упражнения',
  reviewed: 'Проверенные рекомендации для этого канонического упражнения.',
  movementPattern: 'Паттерн движения',
  movementPatterns: {
    'horizontal-push': 'Горизонтальный жим',
    'vertical-push': 'Вертикальный жим',
    'vertical-pull': 'Вертикальная тяга',
    'horizontal-pull': 'Горизонтальная тяга',
    'shoulder-adduction': 'Горизонтальное приведение плеча',
    'elbow-flexion': 'Сгибание локтя',
    'elbow-extension': 'Разгибание локтя',
    'shoulder-abduction': 'Отведение плеча',
    squat: 'Присед',
    'knee-dominant': 'Коленно-доминантный жим',
    hinge: 'Тазобедренный наклон',
    'plantar-flexion': 'Подошвенное сгибание',
  },
  fatigueCost: 'Нагрузка на восстановление',
  fatigue: { low: 'Низкая', moderate: 'Умеренная', high: 'Высокая' },
  technique: 'Технические подсказки',
  commonErrors: 'Частые ошибки',
  rangeOfMotion: 'Амплитуда движения',
  substitutions: 'Проверенные замены',
  noSubstitutions: 'Для этого упражнения пока нет проверенной замены.',
  fatigueDisclaimer:
    'Нагрузка на восстановление — качественная метка для программирования, а не физиологическое измерение. Реальная усталость зависит от веса, объёма, усилия и человека.',
  substitutionDisclaimer:
    'Замены — проверенные альтернативы, а не автоматическое изменение тренировки и не утверждение о полной эквивалентности.',
};

export function getExerciseIntelligenceCopy(locale: string): ExerciseIntelligenceCopy {
  return locale.toLowerCase().startsWith('ru') ? ru : en;
}
