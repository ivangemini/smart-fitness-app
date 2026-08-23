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
          exercise_gap: 'Давний перерыв по упражнению',
        }
      : {
          plateau: 'Stable performance',
          rep_progression: 'More reps at the same load',
          regression: 'Estimated performance decline',
          volume_spike: 'Large training-volume increase',
          muscle_exposure_imbalance: 'Training exposure is concentrated',
          muscle_gap: 'Long gap for a muscle group',
          exercise_gap: 'Long gap for an exercise',
        };
    return titles[kind];
  };

  return {
    title: ru ? 'Тренировочная аналитика' : 'Training intelligence',
    subtitle: ru
      ? 'Детерминированные факты из завершённых тренировок.'
      : 'Deterministic facts from completed training history.',
    coverage: ru ? 'Покрытие тренировок' : 'Training coverage',
    coverageHint: ru
      ? 'Показывает только фактические завершённые рабочие подходы выбранного периода. Это журнал нагрузки, а не оценка оптимальности или восстановления.'
      : 'Shows only completed working-set evidence from the selected period. This is training exposure, not an optimality or recovery score.',
    muscleLoad: ru ? 'Нагрузка по мышцам' : 'Muscle exposure',
    muscleLoadHint: ru
      ? 'Карта использует каноническую мышечную таксономию и точный ID упражнения. Цвет отражает относительный объём подходов, где мышца указана основной; значения не измеряют активацию мышцы.'
      : 'The map uses the canonical muscle taxonomy and exact exercise ID. Color reflects relative volume where a muscle is primary; values do not measure muscle activation.',
    primarySets: ru ? 'основных подходов' : 'primary sets',
    secondarySets: ru ? 'доп. подходов' : 'secondary sets',
    workingSets: ru ? 'рабочих подходов' : 'working sets',
    sessions: ru ? 'сессий' : 'sessions',
    mappedVolume: ru ? 'объём' : 'volume',
    previousWindow: ru ? 'к предыдущему периоду' : 'vs previous window',
    newWindowData: ru ? 'нет сопоставимого прошлого периода' : 'no comparable previous window',
    noMappedData: ru
      ? 'За этот период нет подходов с подтверждённым сопоставлением мышц.'
      : 'No sets with confirmed muscle mapping in this period.',
    movementPatterns: ru ? 'Паттерны движений' : 'Movement patterns',
    movementPatternsHint: ru
      ? 'Паттерн засчитывается только при точном каноническом ID с проверенной записью exercise-intelligence-v1. Неизвестные и несопоставленные упражнения остаются неизвестными.'
      : 'A pattern counts only for an exact canonical ID with reviewed exercise-intelligence-v1 data. Unknown and unmapped exercises remain unknown.',
    noMovementPatterns: ru
      ? 'За этот период нет подходов с проверенным паттерном движения.'
      : 'No sets with a reviewed movement pattern in this period.',
    contributors: ru ? 'Упражнения' : 'Exercises',
    eligibleSets: ru ? 'Завершённых рабочих подходов' : 'Completed working sets',
    mappedMuscleSets: ru ? 'С мышечным сопоставлением' : 'Muscle-mapped sets',
    reviewedPatternSets: ru ? 'С проверенным паттерном' : 'Reviewed-pattern sets',
    unmappedPatternSets: ru ? 'Без проверенного паттерна' : 'Unmapped-pattern sets',
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
    repsShort: ru ? 'повт.' : 'reps',
    exposures: ru ? 'сопоставимых тренировок' : 'comparable exposures',
    days: ru ? 'дн.' : 'days',
    median: ru ? 'медиана' : 'median',
    primarySetsEvidence: ru ? 'основных подходов' : 'primary sets',
    findingTitle,
  };
};
