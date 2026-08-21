import type { SupportedLocale } from '@/localization/messages';

import type { TrainingFindingKind, TrainingPrType } from './trainingIntelligence';

export const getTrainingIntelligenceCopy = (locale: SupportedLocale) => {
  const ru = locale === 'ru';
  const findingTitle = (kind: TrainingFindingKind, prType?: TrainingPrType) => {
    if (kind === 'new_pr') {
      const labels: Record<TrainingPrType, string> = ru
        ? {
            load: 'Новый рекорд по весу',
            reps: 'Новый рекорд повторений',
            estimated_1rm: 'Новый рекорд расчётного e1RM',
            session_volume: 'Новый рекорд объёма за сессию',
          }
        : {
            load: 'New load PR',
            reps: 'New rep PR',
            estimated_1rm: 'New estimated e1RM PR',
            session_volume: 'New session-volume PR',
          };
      return labels[prType ?? 'load'];
    }
    const titles: Record<Exclude<TrainingFindingKind, 'new_pr'>, string> = ru
      ? {
          plateau: 'Стабильная производительность',
          rep_progression: 'Рост повторений при том же весе',
          regression: 'Снижение расчётной производительности',
          volume_spike: 'Резкий рост тренировочного объёма',
          muscle_exposure_imbalance: 'Концентрация нагрузки на одной группе',
          muscle_gap: 'Давний перерыв по мышечной группе',
        }
      : {
          plateau: 'Stable performance',
          rep_progression: 'More reps at the same load',
          regression: 'Estimated performance decline',
          volume_spike: 'Large training-volume increase',
          muscle_exposure_imbalance: 'Training exposure is concentrated',
          muscle_gap: 'Long gap for a muscle group',
        };
    return titles[kind];
  };

  return {
    title: ru ? 'Тренировочная аналитика' : 'Training intelligence',
    subtitle: ru
      ? 'Детерминированные факты из завершённых тренировок.'
      : 'Deterministic facts from completed training history.',
    period: ru ? 'Период' : 'Period',
    muscleLoad: ru ? 'Нагрузка по мышцам' : 'Muscle load',
    muscleLoadHint: ru
      ? 'Цвет показывает относительный объём рабочих подходов, где мышца указана основной. Значения по мышцам не складываются в общий объём и не измеряют активацию мышцы.'
      : 'Color shows relative working-set volume where a muscle is mapped as primary. Muscle values are not additive and do not measure muscle activation.',
    primarySets: ru ? 'основных подходов' : 'primary sets',
    secondarySets: ru ? 'доп. подходов' : 'secondary sets',
    sessions: ru ? 'сессий' : 'sessions',
    mappedVolume: ru ? 'объём' : 'volume',
    previousWindow: ru ? 'к предыдущему периоду' : 'vs previous window',
    newWindowData: ru ? 'нет сопоставимого прошлого периода' : 'no comparable previous window',
    noMappedData: ru
      ? 'За этот период нет подходов с подтверждённым сопоставлением мышц.'
      : 'No sets with confirmed muscle mapping in this period.',
    findings: ru ? 'Сигналы прогрессии' : 'Progression signals',
    findingsHint: ru
      ? 'Правила версии training-intelligence-v1. Это наблюдения по истории, а не автоматические рекомендации.'
      : 'Ruleset training-intelligence-v1. These are historical observations, not automatic recommendations.',
    noFindings: ru
      ? 'Недостаточно сопоставимых данных для сигналов.'
      : 'Not enough comparable evidence for a signal.',
    evidence: ru ? 'Основание' : 'Evidence',
    mappedExercises: ru ? 'Сопоставлено упражнений' : 'Mapped exercises',
    unmappedSets: ru ? 'Подходов без сопоставления' : 'Unmapped sets',
    unavailable: ru
      ? 'Не удалось загрузить метаданные упражнений. Остальной экран прогресса доступен.'
      : 'Exercise metadata could not be loaded. The rest of Progress remains available.',
    loading: ru ? 'Загрузка карты мышц…' : 'Loading muscle map…',
    front: ru ? 'Спереди' : 'Front',
    back: ru ? 'Сзади' : 'Back',
    findingTitle,
  };
};