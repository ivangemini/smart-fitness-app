import { describe, expect, it } from 'vitest';

import type { BodyMeasurement, WeightEntry } from '@/types';

import {
  buildProgressPhotoComparison,
  getDefaultProgressPhotoComparisonSelection,
  getFirstComparableProgressPhotoPose,
  getProgressPhotoComparisonCandidates,
  PROGRESS_PHOTO_MEASUREMENT_EVIDENCE_WINDOW_DAYS,
  PROGRESS_PHOTO_WEIGHT_EVIDENCE_WINDOW_DAYS,
} from './progressPhotoComparison';
import type { ProgressPhotoRecord } from './progressPhotoStore';

const photo = (
  id: string,
  pose: ProgressPhotoRecord['pose'],
  capturedAt: string,
  overrides: Partial<ProgressPhotoRecord> = {},
): ProgressPhotoRecord => ({
  id,
  ownerUserId: '11111111-1111-4111-8111-111111111111',
  pose,
  source: 'camera',
  status: 'ready',
  localUri: `file:///smart-fitness-progress-photos/user/${id}.jpg`,
  width: 900,
  height: 1200,
  mimeType: 'image/jpeg',
  capturedAt,
  createdAt: capturedAt,
  ...overrides,
});

const weights: WeightEntry[] = [
  { id: 'w-far', date: 'far', weight: 90, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'w-before', date: 'before', weight: 80, createdAt: '2026-08-09T12:00:00.000Z' },
  { id: 'w-after', date: 'after', weight: 79, createdAt: '2026-08-21T12:00:00.000Z' },
];

const measurements: BodyMeasurement[] = [
  {
    id: 'waist-before',
    label: 'Waist',
    value: '82',
    metric: 'waist',
    numericValue: 82,
    unit: 'cm',
    createdAt: '2026-08-08T12:00:00.000Z',
  },
  {
    id: 'waist-after',
    label: 'Waist',
    value: '80',
    metric: 'waist',
    numericValue: 80,
    unit: 'cm',
    createdAt: '2026-08-20T12:00:00.000Z',
  },
  {
    id: 'invalid-waist-percent',
    label: 'Waist',
    value: '20%',
    metric: 'waist',
    numericValue: 20,
    unit: 'percent',
    createdAt: '2026-08-21T23:00:00.000Z',
  },
  {
    id: 'chest-near',
    label: 'Chest',
    value: '100',
    metric: 'chest',
    numericValue: 100,
    unit: 'cm',
    createdAt: '2026-08-21T11:00:00.000Z',
  },
];

const before = photo('before', 'front', '2026-08-10T12:00:00.000Z');
const after = photo('after', 'front', '2026-08-22T12:00:00.000Z');

describe('progress photo comparison', () => {
  it('builds a same-pose chronological comparison with bounded real evidence', () => {
    const result = buildProgressPhotoComparison({
      photos: [after, before],
      beforeId: before.id,
      afterId: after.id,
      weightHistory: weights,
      bodyMeasurements: measurements,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.pose).toBe('front');
    expect(result.overlayEligible).toBe(true);
    expect(result.evidence.before.weight?.id).toBe('w-before');
    expect(result.evidence.after.weight?.id).toBe('w-after');
    expect(result.evidence.before.waist?.id).toBe('waist-before');
    expect(result.evidence.after.waist?.id).toBe('waist-after');
  });

  it('rejects a comparison across different poses', () => {
    expect(
      buildProgressPhotoComparison({
        photos: [before, photo('side-after', 'side', '2026-08-22T12:00:00.000Z')],
        beforeId: before.id,
        afterId: 'side-after',
        weightHistory: [],
        bodyMeasurements: [],
      }),
    ).toEqual({ ok: false, reason: 'pose_mismatch' });
  });

  it('rejects the same photo and reversed chronology', () => {
    expect(
      buildProgressPhotoComparison({
        photos: [before],
        beforeId: before.id,
        afterId: before.id,
        weightHistory: [],
        bodyMeasurements: [],
      }),
    ).toEqual({ ok: false, reason: 'same_photo' });

    expect(
      buildProgressPhotoComparison({
        photos: [before, after],
        beforeId: after.id,
        afterId: before.id,
        weightHistory: [],
        bodyMeasurements: [],
      }),
    ).toEqual({ ok: false, reason: 'chronology_invalid' });
  });

  it('fails overlay closed when either image is outside the standardized aspect tolerance', () => {
    const nonStandard = photo('wide-after', 'front', '2026-08-22T12:00:00.000Z', {
      width: 1200,
      height: 1200,
    });
    const result = buildProgressPhotoComparison({
      photos: [before, nonStandard],
      beforeId: before.id,
      afterId: nonStandard.id,
      weightHistory: [],
      bodyMeasurements: [],
    });
    expect(result.ok && result.overlayEligible).toBe(false);
  });

  it('keeps evidence windows bounded and ignores non-waist measurements', () => {
    const isolated = photo('isolated', 'front', '2026-06-01T00:00:00.000Z');
    const later = photo('isolated-later', 'front', '2026-06-02T00:00:00.000Z');
    const result = buildProgressPhotoComparison({
      photos: [isolated, later],
      beforeId: isolated.id,
      afterId: later.id,
      weightHistory: weights,
      bodyMeasurements: measurements,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.evidence.before).toEqual({ weight: null, waist: null });
    expect(PROGRESS_PHOTO_WEIGHT_EVIDENCE_WINDOW_DAYS).toBe(7);
    expect(PROGRESS_PHOTO_MEASUREMENT_EVIDENCE_WINDOW_DAYS).toBe(14);
  });

  it('sorts ready same-pose candidates and selects the latest chronological pair', () => {
    const deleting = photo('deleting', 'front', '2026-08-23T12:00:00.000Z', {
      status: 'deleting',
    });
    const oldest = photo('oldest', 'front', '2026-08-01T12:00:00.000Z');
    const candidates = getProgressPhotoComparisonCandidates(
      [after, deleting, oldest, before, photo('side', 'side', '2026-08-12T12:00:00.000Z')],
      'front',
    );
    expect(candidates.map(({ id }) => id)).toEqual(['oldest', 'before', 'after']);
    expect(getDefaultProgressPhotoComparisonSelection(candidates, 'front')).toEqual({
      beforeId: 'before',
      afterId: 'after',
    });
  });

  it('finds the first pose with at least two comparable ready photos', () => {
    expect(
      getFirstComparableProgressPhotoPose([
        photo('front-only', 'front', '2026-08-01T00:00:00.000Z'),
        photo('side-one', 'side', '2026-08-01T00:00:00.000Z'),
        photo('side-two', 'side', '2026-08-02T00:00:00.000Z'),
      ]),
    ).toBe('side');
  });
});
