import { getProgressShareCardCopy } from '@/localization/progressShareCardCopy';
import type { SupportedLocale } from '@/localization/messages';
import type { WeightUnit } from '@/units';
import { weightFromKg } from '@/units';

import type {
  BodyMeasurementShareCard,
  ProgressShareCardViewModel,
  TrainingPrShareCard,
} from './progressShareCardModel';

export type ProgressShareCardPresentationRow = {
  label: string;
  value: string;
};

export type ProgressShareCardPresentation = {
  brand: string;
  title: string;
  subjectLabel: string | null;
  heroLabel: string;
  heroValue: string;
  rows: ProgressShareCardPresentationRow[];
  dateLabel: string;
  footer: string;
};

type PresentationOptions = {
  locale: SupportedLocale;
  weightUnit: WeightUnit;
  formatDate: (
    value: Date | string | number,
    options?: Intl.DateTimeFormatOptions,
  ) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
};

const formatNumber = (
  value: number,
  options: PresentationOptions,
  maximumFractionDigits = 1,
) =>
  options.formatNumber(value, {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  });

const formatWeight = (valueKg: number, options: PresentationOptions) =>
  `${formatNumber(weightFromKg(valueKg, options.weightUnit), options)} ${options.weightUnit}`;

const formatVolume = (valueKgReps: number, options: PresentationOptions) => {
  const copy = getProgressShareCardCopy(options.locale);
  return `${formatNumber(weightFromKg(valueKgReps, options.weightUnit), options, 0)} ${options.weightUnit}·${copy.repsUnit}`;
};

const withSign = (value: number, formatted: string) =>
  value > 0 ? `+${formatted}` : formatted;

const formatWeightDelta = (valueKg: number, options: PresentationOptions) => {
  const converted = weightFromKg(valueKg, options.weightUnit);
  return `${withSign(converted, formatNumber(converted, options))} ${options.weightUnit}`;
};

const formatSourceUnit = (
  value: number,
  unit: BodyMeasurementShareCard['data']['unit'],
  options: PresentationOptions,
) => {
  const suffix = unit === 'percent' ? '%' : unit;
  return `${formatNumber(value, options)} ${suffix}`;
};

const metricLabel = (
  metric: BodyMeasurementShareCard['data']['metric'],
  options: PresentationOptions,
) => {
  const copy = getProgressShareCardCopy(options.locale);
  switch (metric) {
    case 'waist':
      return copy.metricWaist;
    case 'chest':
      return copy.metricChest;
    case 'hips':
      return copy.metricHips;
    case 'shoulders':
      return copy.metricShoulders;
    case 'neck':
      return copy.metricNeck;
    case 'upper_arm':
      return copy.metricUpperArm;
    case 'thigh':
      return copy.metricThigh;
    case 'calf':
      return copy.metricCalf;
    case 'body_fat':
      return copy.metricBodyFat;
    case 'custom':
      return copy.metricCustom;
  }
};

const prMetricLabel = (
  metric: TrainingPrShareCard['data']['metric'],
  options: PresentationOptions,
) => {
  const copy = getProgressShareCardCopy(options.locale);
  switch (metric) {
    case 'load':
      return copy.metricLoad;
    case 'reps':
      return copy.metricReps;
    case 'estimated_1rm':
      return copy.metricEstimated1Rm;
    case 'session_volume':
      return copy.metricSessionVolume;
  }
};

const formatPrValue = (
  card: TrainingPrShareCard,
  value: number,
  options: PresentationOptions,
) => {
  if (card.data.metric === 'reps') {
    return `${formatNumber(value, options, 0)} ${getProgressShareCardCopy(options.locale).repsUnit}`;
  }
  if (card.data.metric === 'session_volume') return formatVolume(value, options);
  return formatWeight(value, options);
};

const recoveryLabel = (
  state: Extract<ProgressShareCardViewModel, { kind: 'weekly_review' }>['data']['recovery']['state'],
  options: PresentationOptions,
) => {
  const copy = getProgressShareCardCopy(options.locale);
  switch (state) {
    case 'unknown':
      return copy.recoveryUnknown;
    case 'neutral':
      return copy.recoveryNeutral;
    case 'caution':
      return copy.recoveryCaution;
    case 'strong_caution':
      return copy.recoveryStrongCaution;
  }
};

const formatCardDate = (
  card: ProgressShareCardViewModel,
  options: PresentationOptions,
) =>
  options.formatDate(card.source.sourceDate ?? card.source.occurredAt, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export function buildProgressShareCardPresentation(
  card: ProgressShareCardViewModel,
  options: PresentationOptions,
): ProgressShareCardPresentation {
  const copy = getProgressShareCardCopy(options.locale);
  const dateLabel = formatCardDate(card, options);
  const base = {
    brand: copy.brand,
    subjectLabel: card.subjectLabel,
    dateLabel,
    footer: copy.sourceNote,
  };

  switch (card.kind) {
    case 'workout_summary':
      return {
        ...base,
        title: copy.workoutTitle,
        heroLabel: copy.duration,
        heroValue: `${formatNumber(card.data.durationMinutes, options, 0)} ${copy.minuteUnit}`,
        rows: [
          {
            label: copy.exercises,
            value: formatNumber(card.data.exerciseCount, options, 0),
          },
          {
            label: copy.workingSets,
            value: formatNumber(card.data.workingSetCount, options, 0),
          },
          {
            label: copy.volume,
            value: formatVolume(card.data.workingVolumeKgReps, options),
          },
        ],
      };

    case 'training_pr': {
      const previous = card.data.previousValue;
      const rows: ProgressShareCardPresentationRow[] = [
        {
          label: copy.previous,
          value: formatPrValue(card, previous, options),
        },
      ];
      if (card.data.metric === 'reps') {
        rows.push({
          label: copy.metricLoad,
          value: formatWeight(card.data.loadKg, options),
        });
      }
      return {
        ...base,
        title: copy.prTitle,
        heroLabel: prMetricLabel(card.data.metric, options),
        heroValue: formatPrValue(card, card.data.newValue, options),
        rows,
      };
    }

    case 'weekly_review': {
      const rows: ProgressShareCardPresentationRow[] = [];
      if (card.data.plan) {
        rows.push(
          {
            label: copy.completedPlanned,
            value: `${formatNumber(card.data.plan.completedPlannedSessionCount, options, 0)}/${formatNumber(card.data.plan.plannedSessionCount, options, 0)}`,
          },
          {
            label: copy.otherCompleted,
            value: formatNumber(card.data.plan.otherCompletedSessionCount, options, 0),
          },
        );
        if (card.data.plan.unresolvedPlannedSessionCount > 0) {
          rows.push({
            label: copy.unresolvedPlan,
            value: formatNumber(card.data.plan.unresolvedPlannedSessionCount, options, 0),
          });
        }
      }
      rows.push(
        {
          label: copy.activeMuscles,
          value: formatNumber(card.data.coverage.activeMuscleCount, options, 0),
        },
        {
          label: copy.movementPatterns,
          value: formatNumber(card.data.coverage.movementPatternCount, options, 0),
        },
        {
          label: copy.recovery,
          value: recoveryLabel(card.data.recovery.state, options),
        },
        {
          label: copy.adaptive,
          value: card.data.adaptive.available
            ? copy.adaptiveSummary(
                formatNumber(card.data.adaptive.actionCounts.progress, options, 0),
                formatNumber(card.data.adaptive.actionCounts.maintain, options, 0),
                formatNumber(card.data.adaptive.actionCounts.review, options, 0),
              )
            : copy.adaptiveUnavailable,
        },
      );
      return {
        ...base,
        title: copy.weeklyTitle,
        heroLabel: copy.workingSets,
        heroValue: formatNumber(card.data.coverage.workingSetCount, options, 0),
        rows,
      };
    }

    case 'weight_milestone': {
      const rows: ProgressShareCardPresentationRow[] = [];
      if (card.data.previousWeightKg !== null) {
        rows.push({
          label: copy.previous,
          value: formatWeight(card.data.previousWeightKg, options),
        });
      }
      if (card.data.deltaKg !== null) {
        rows.push({
          label: copy.change,
          value: formatWeightDelta(card.data.deltaKg, options),
        });
      }
      return {
        ...base,
        title: copy.weightTitle,
        heroLabel: copy.current,
        heroValue: formatWeight(card.data.weightKg, options),
        rows,
      };
    }

    case 'body_measurement': {
      const rows: ProgressShareCardPresentationRow[] = [];
      if (card.data.previousValue !== null) {
        rows.push({
          label: copy.previous,
          value: formatSourceUnit(card.data.previousValue, card.data.unit, options),
        });
      }
      if (card.data.delta !== null) {
        rows.push({
          label: copy.change,
          value: `${withSign(card.data.delta, formatNumber(card.data.delta, options))} ${card.data.unit === 'percent' ? '%' : card.data.unit}`,
        });
      }
      return {
        ...base,
        title: copy.measurementTitle,
        subjectLabel: card.subjectLabel ?? metricLabel(card.data.metric, options),
        heroLabel: metricLabel(card.data.metric, options),
        heroValue: formatSourceUnit(card.data.value, card.data.unit, options),
        rows,
      };
    }
  }
}
