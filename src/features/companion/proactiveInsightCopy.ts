import type { ProactiveInsight } from './proactiveInsights';

type Locale = 'en' | 'ru';

type FormatNumber = (
  value: number,
  options?: { maximumFractionDigits?: number },
) => string;

export type ProactiveInsightCopy = {
  eyebrow: string;
  title: string;
  body: string;
  evidenceAction: string;
  dismissAction: string;
};

export const getProactiveInsightCopy = (
  locale: Locale,
  insight: ProactiveInsight,
  formatNumber: FormatNumber,
): ProactiveInsightCopy => {
  const isRu = locale === 'ru';

  if (insight.kind === 'strength_progress') {
    const percent = formatNumber(insight.evidence.relativeChange * 100, {
      maximumFractionDigits: 1,
    });
    return isRu
      ? {
          eyebrow: 'Наблюдение по тренировкам',
          title: `Тренд силы: ${insight.exerciseName}`,
          body: `Лучший сопоставимый расчётный 1ПМ за последние 14 дней на ${percent}% выше, чем за предыдущие 14 дней. Основано на ${formatNumber(insight.evidence.sessionCount)} тренировках и ${formatNumber(insight.evidence.workingSetCount)} рабочих подходах.`,
          evidenceAction: 'Посмотреть данные',
          dismissAction: 'Скрыть',
        }
      : {
          eyebrow: 'Training observation',
          title: `Strength trend: ${insight.exerciseName}`,
          body: `Your best comparable estimated 1RM in the recent 14 days is ${percent}% higher than in the previous 14 days. Based on ${formatNumber(insight.evidence.sessionCount)} sessions and ${formatNumber(insight.evidence.workingSetCount)} working sets.`,
          evidenceAction: 'View evidence',
          dismissAction: 'Dismiss',
        };
  }

  if (insight.kind === 'strength_stagnation') {
    return isRu
      ? {
          eyebrow: 'Наблюдение по тренировкам',
          title: `Стабильный тренд силы: ${insight.exerciseName}`,
          body: `Лучший сопоставимый расчётный 1ПМ остаётся в стабильном диапазоне между двумя половинами последних 28 дней. Основано на ${formatNumber(insight.evidence.sessionCount)} тренировках и ${formatNumber(insight.evidence.workingSetCount)} рабочих подходах. Это наблюдение за данными, а не оценка программы.`,
          evidenceAction: 'Посмотреть данные',
          dismissAction: 'Скрыть',
        }
      : {
          eyebrow: 'Training observation',
          title: `Stable strength trend: ${insight.exerciseName}`,
          body: `Your best comparable estimated 1RM remains within the stable range across the two halves of the last 28 days. Based on ${formatNumber(insight.evidence.sessionCount)} sessions and ${formatNumber(insight.evidence.workingSetCount)} working sets. This is a data pattern, not a judgment about your program.`,
          evidenceAction: 'View evidence',
          dismissAction: 'Dismiss',
        };
  }

  return isRu
    ? {
        eyebrow: 'Наблюдение по тренировкам',
        title: 'Тренировочный ритм вырос',
        body: `За последние 14 дней у тебя ${formatNumber(insight.evidence.recentActiveDays)} уникальных тренировочных дней против ${formatNumber(insight.evidence.previousActiveDays)} за предыдущие 14 дней. Несколько тренировок в один день считаются одним активным днём.`,
        evidenceAction: 'Посмотреть данные',
        dismissAction: 'Скрыть',
      }
    : {
        eyebrow: 'Training observation',
        title: 'Training rhythm increased',
        body: `You trained on ${formatNumber(insight.evidence.recentActiveDays)} unique days in the recent 14 days, up from ${formatNumber(insight.evidence.previousActiveDays)} in the previous 14 days. Multiple sessions on one day count as one active day.`,
        evidenceAction: 'View evidence',
        dismissAction: 'Dismiss',
      };
};
