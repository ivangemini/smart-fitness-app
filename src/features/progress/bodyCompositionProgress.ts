import { buildBodyMeasurementProgressAnalytics } from '@/lib/progress/bodyMeasurementSeries';
import { getWeightAnalytics } from '@/lib/progress/weight';
import { getWeightTrendEntries, type WeightTrendRange } from '@/lib/progress/weightTrend';
import type { BodyMeasurement, WeightEntry } from '@/types';

import type { ProgressPhotoPose, ProgressPhotoRecord } from '../progressPhotos/progressPhotoStore';

export type BodyCompositionPeriodDays = Extract<WeightTrendRange, 30 | 90>;
const DEFAULT_PERIOD_DAYS: BodyCompositionPeriodDays = 90;
const MAX_PHOTO_TIMELINE_ITEMS = 24;
const POSES: readonly ProgressPhotoPose[] = ['front', 'side', 'back'];

export type BodyCompositionProgress = {
  period: { startAt: string; endAt: string; days: number };
  weight: ReturnType<typeof getWeightAnalytics>;
  weightTrend: WeightEntry[];
  measurements: ReturnType<typeof buildBodyMeasurementProgressAnalytics>;
  waist: {
    currentCm: number;
    deltaCm: number | null;
    entries: number;
  } | null;
  photos: {
    total: number;
    firstAt: string | null;
    latestAt: string | null;
    byPose: Record<ProgressPhotoPose, number>;
    comparablePoses: ProgressPhotoPose[];
    timeline: ProgressPhotoRecord[];
    timelineTruncated: boolean;
  };
  evidence: {
    hasWeight: boolean;
    hasWaist: boolean;
    hasPhotos: boolean;
  };
};

const timestamp = (value: string): number | null => {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const buildBodyCompositionProgress = (input: {
  weightHistory: readonly WeightEntry[];
  bodyMeasurements: readonly BodyMeasurement[];
  progressPhotos: readonly ProgressPhotoRecord[];
  endAt: string;
  periodDays?: BodyCompositionPeriodDays;
}): BodyCompositionProgress => {
  const endTimestamp = timestamp(input.endAt);
  if (endTimestamp === null) {
    throw new Error('buildBodyCompositionProgress requires a valid endAt timestamp');
  }

  const periodDays = input.periodDays ?? DEFAULT_PERIOD_DAYS;
  const measurements = buildBodyMeasurementProgressAnalytics(
    [...input.bodyMeasurements],
    { endAt: input.endAt, periodDays },
  );
  const startTimestamp = Date.parse(measurements.period.startAt);
  const periodWeightHistory = input.weightHistory.filter((entry) => {
    const value = timestamp(entry.createdAt);
    return value !== null && value >= startTimestamp && value <= endTimestamp;
  });
  const weight = getWeightAnalytics([...periodWeightHistory]);
  const weightTrend = getWeightTrendEntries([...periodWeightHistory], periodDays);
  const waistGroup = measurements.groups.find(
    (group) => group.metric === 'waist' && group.canonicalUnit === 'cm',
  );

  const periodPhotos = input.progressPhotos
    .filter((photo) => {
      if (photo.status !== 'ready') return false;
      const value = timestamp(photo.capturedAt);
      return value !== null && value >= startTimestamp && value <= endTimestamp;
    })
    .sort((a, b) => {
      const delta = Date.parse(a.capturedAt) - Date.parse(b.capturedAt);
      return delta !== 0 ? delta : a.id.localeCompare(b.id);
    });
  const byPose: Record<ProgressPhotoPose, number> = { front: 0, side: 0, back: 0 };
  for (const photo of periodPhotos) byPose[photo.pose] += 1;
  const comparablePoses = POSES.filter((pose) => byPose[pose] >= 2);
  const timeline = [...periodPhotos].reverse().slice(0, MAX_PHOTO_TIMELINE_ITEMS);

  return {
    period: measurements.period,
    weight,
    weightTrend,
    measurements,
    waist: waistGroup
      ? {
          currentCm: waistGroup.currentCanonicalValue,
          deltaCm: waistGroup.periodDeltaCanonical,
          entries: waistGroup.totalMatchingPoints,
        }
      : null,
    photos: {
      total: periodPhotos.length,
      firstAt: periodPhotos[0]?.capturedAt ?? null,
      latestAt: periodPhotos[periodPhotos.length - 1]?.capturedAt ?? null,
      byPose,
      comparablePoses,
      timeline,
      timelineTruncated: periodPhotos.length > timeline.length,
    },
    evidence: {
      hasWeight: weight.currentWeight !== null,
      hasWaist: Boolean(waistGroup),
      hasPhotos: periodPhotos.length > 0,
    },
  };
};
