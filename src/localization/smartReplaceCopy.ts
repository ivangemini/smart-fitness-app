type SmartReplaceCopy = {
  title: string;
  description: string;
  loading: string;
  noCandidates: string;
  reviewedReason: string;
  equipmentReason: string;
  viewCandidate: (exerciseName: string) => string;
  disclaimer: string;
};

const en: SmartReplaceCopy = {
  title: 'Smart Replace',
  description: 'Suggestions use only reviewed substitutions and your saved exercise preferences.',
  loading: 'Checking reviewed replacements…',
  noCandidates: 'No reviewed replacement is available after your preferences are applied.',
  reviewedReason: 'Reviewed substitution',
  equipmentReason: 'Matches the explicit equipment context',
  viewCandidate: (exerciseName) => `View ${exerciseName}`,
  disclaimer: 'Opening a suggestion does not change your program or active workout.',
};

const ru: SmartReplaceCopy = {
  title: 'Умная замена',
  description: 'Предложения используют только проверенные замены и сохранённые предпочтения упражнений.',
  loading: 'Проверяем доступные замены…',
  noCandidates: 'После учёта ваших предпочтений подходящих проверенных замен нет.',
  reviewedReason: 'Проверенная замена',
  equipmentReason: 'Совпадает с явно заданным оборудованием',
  viewCandidate: (exerciseName) => `Открыть ${exerciseName}`,
  disclaimer: 'Открытие варианта не меняет программу или активную тренировку.',
};

export function getSmartReplaceCopy(locale: string): SmartReplaceCopy {
  return locale.toLowerCase().startsWith('ru') ? ru : en;
}
