import { resolveBodyMeasurementStructuredValue } from '@/features/progress/bodyMeasurementModel';
import type { BodyMeasurement, WeightEntry } from '@/types';

import type { ProgressPhotoPose, ProgressPhotoRecord } from './progressPhotoStore';

export const PROGRESS_PHOTO_WEIGHT_EVIDENCE_WINDOW_DAYS = 7;
export const PROGRESS_PHOTO_MEASUREMENT_EVIDENCE_WINDOW_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;
const STANDARD_ASPECT_RATIO = 3 / 4;
const OVERLAY_ASPECT_TOLERANCE = 0.015;

export type ProgressPhotoComparisonReason =
  | 'missing_photo'
  | 'same_photo'
  | 'pose_mismatch'
  | 'chronology_invalid';

export type ProgressPhotoEndpointEvidence = {
  weight: WeightEntry | null;
  waist: BodyMeasurement | null;
};

export type ProgressPhotoComparison =
  | { ok: false; reason: ProgressPhotoComparisonReason }
  | {
      ok: true;
      before: ProgressPhotoRecord;
      after: ProgressPhotoRecord;
      pose: ProgressPhotoPose;
      overlayEligible: boolean;
      evidence: {
        before: ProgressPhotoEndpointEvidence;
        after: ProgressPhotoEndpointEvidence;
      };
    };

type ComparisonInput = {
  photos: readonly ProgressPhotoRecord[];
  beforeId: string | null;
  afterId: string | null;
  weightHistory: readonly WeightEntry[];
  bodyMeasurements: readonly BodyMeasurement[];
};

const parseTime = (value: string): number | null => {
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
};

const compareEvidenceCandidates = <T extends { id: string; createdAt: string }>(
  a: T,
  b: T,
  targetTime: number,
) => {
  const aTime = parseTime(a.createdAt) ?? Number.POSITIVE_INFINITY;
  const bTime = parseTime(b.createdAt) ?? Number.POSITIVE_INFINITY;
  const distance = Math.abs(aTime - targetTime) - Math.abs(bTime - targetTime);
  if (distance !== 0) return distance;
  if (aTime !== bTime) return aTime - bTime;
  return a.id.localeCompare(b.id);
};

const pickNearest = <T extends { id: string; createdAt: string }>(
  values: readonly T[],
  targetAt: string,
  windowDays: number,
): T | null => {
  const targetTime = parseTime(targetAt);
  if (targetTime === null) return null;
  const maxDistance = windowDays * DAY_MS;
  const eligible = values.filter((value) => {
    const time = parseTime(value.createdAt);
    return time !== null && Math.abs(time - targetTime) <= maxDistance;
  });
  if (eligible.length === 0) return null;
  return [...eligible].sort((a, b) => compareEvidenceCandidates(a, b, targetTime))[0] ?? null;
};

const hasStandardAspect = (photo: ProgressPhotoRecord) => {
  if (photo.width <= 0 || photo.height <= 0) return false;
  return Math.abs(photo.width / photo.height - STANDARD_ASPECT_RATIO) <= OVERLAY_ASPECT_TOLERANCE;
};

const isComparableWaistMeasurement = (measurement: BodyMeasurement): boolean => {
  if (measurement.metric !== 'waist') return false;
  const resolved = resolveBodyMeasurementStructuredValue(measurement);
  return Boolean(
    resolved &&
      resolved.canonicalUnit === 'cm' &&
      resolved.canonicalNumericValue !== null &&
      Number.isFinite(resolved.canonicalNumericValue) &&
      resolved.canonicalNumericValue > 0,
  );
};

const buildEndpointEvidence = (
  photo: ProgressPhotoRecord,
  weightHistory: readonly WeightEntry[],
  bodyMeasurements: readonly BodyMeasurement[],
): ProgressPhotoEndpointEvidence => ({
  weight: pickNearest(
    weightHistory,
    photo.capturedAt,
    PROGRESS_PHOTO_WEIGHT_EVIDENCE_WINDOW_DAYS,
  ),
  waist: pickNearest(
    bodyMeasurements.filter(isComparableWaistMeasurement),
    photo.capturedAt,
    PROGRESS_PHOTO_MEASUREMENT_EVIDENCE_WINDOW_DAYS,
  ),
});

export const getProgressPhotoComparisonCandidates = (
  photos: readonly ProgressPhotoRecord[],
  pose: ProgressPhotoPose,
): ProgressPhotoRecord[] =>
  photos
    .filter((photo) => photo.status === 'ready' && photo.pose === pose)
    .sort((a, b) => {
      const aTime = parseTime(a.capturedAt) ?? Number.POSITIVE_INFINITY;
      const bTime = parseTime(b.capturedAt) ?? Number.POSITIVE_INFINITY;
      const delta = aTime - bTime;
      return delta !== 0 ? delta : a.id.localeCompare(b.id);
    });

export const getDefaultProgressPhotoComparisonSelection = (
  photos: readonly ProgressPhotoRecord[],
  pose: ProgressPhotoPose,
): { beforeId: string; afterId: string } | null => {
  const candidates = getProgressPhotoComparisonCandidates(photos, pose);
  if (candidates.length < 2) return null;
  const after = candidates[candidates.length - 1];
  const before = candidates[candidates.length - 2];
  return before && after ? { beforeId: before.id, afterId: after.id } : null;
};

export const getFirstComparableProgressPhotoPose = (
  photos: readonly ProgressPhotoRecord[],
): ProgressPhotoPose | null => {
  for (const pose of ['front', 'side', 'back'] as const) {
    if (getProgressPhotoComparisonCandidates(photos, pose).length >= 2) return pose;
  }
  return null;
};

export const buildProgressPhotoComparison = ({
  photos,
  beforeId,
  afterId,
  weightHistory,
  bodyMeasurements,
}: ComparisonInput): ProgressPhotoComparison => {
  if (!beforeId || !afterId) return { ok: false, reason: 'missing_photo' };
  if (beforeId === afterId) return { ok: false, reason: 'same_photo' };

  const before = photos.find((photo) => photo.id === beforeId && photo.status === 'ready');
  const after = photos.find((photo) => photo.id === afterId && photo.status === 'ready');
  if (!before || !after) return { ok: false, reason: 'missing_photo' };
  if (before.pose !== after.pose) return { ok: false, reason: 'pose_mismatch' };

  const beforeTime = parseTime(before.capturedAt);
  const afterTime = parseTime(after.capturedAt);
  if (beforeTime === null || afterTime === null || beforeTime >= afterTime) {
    return { ok: false, reason: 'chronology_invalid' };
  }

  return {
    ok: true,
    before,
    after,
    pose: before.pose,
    overlayEligible: hasStandardAspect(before) && hasStandardAspect(after),
    evidence: {
      before: buildEndpointEvidence(before, weightHistory, bodyMeasurements),
      after: buildEndpointEvidence(after, weightHistory, bodyMeasurements),
    },
  };
};
