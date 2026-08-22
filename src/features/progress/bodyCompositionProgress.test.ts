import { describe, expect, it } from 'vitest';

import type { BodyMeasurement, WeightEntry } from '@/types';
import type { ProgressPhotoRecord } from '../progressPhotos/progressPhotoStore';

import { buildBodyCompositionProgress } from './bodyCompositionProgress';

const weights: WeightEntry[] = [
  { id: 'old-weight', date: '2026-01-01', weight: 90, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'w1', date: '2026-07-01', weight: 80, createdAt: '2026-07-01T00:00:00.000Z' },
  { id: 'w2', date: '2026-08-20', weight: 78, createdAt: '2026-08-20T00:00:00.000Z' },
  { id: 'future', date: '2026-09-01', weight: 70, createdAt: '2026-09-01T00:00:00.000Z' },
];

const measurements: BodyMeasurement[] = [
  {
    id: 'waist-1',
    label: 'Waist',
    value: '84 cm',
    metric: 'waist',
    numericValue: 84,
    unit: 'cm',
    createdAt: '2026-07-15T00:00:00.000Z',
  },
  {
    id: 'waist-2',
    label: 'Waist',
    value: '80 cm',
    metric: 'waist',
    numericValue: 80,
    unit: 'cm',
    createdAt: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'body-fat-user-entry',
    label: 'Body fat',
    value: '14 %',
    metric: 'body_fat',
    numericValue: 14,
    unit: 'percent',
    createdAt: '2026-08-18T00:00:00.000Z',
  },
];

const photo = (
  id: string,
  pose: ProgressPhotoRecord['pose'],
  capturedAt: string,
  status: ProgressPhotoRecord['status'] = 'ready',
): ProgressPhotoRecord => ({
  id,
  ownerUserId: '11111111-1111-4111-8111-111111111111',
  pose,
  source: 'camera',
  status,
  localUri: `file:///smart-fitness-progress-photos/user/${id}.jpg`,
  width: 900,
  height: 1200,
  mimeType: 'image/jpeg',
  capturedAt,
  createdAt: capturedAt,
});

describe('body composition progress composition', () => {
  it('composes existing analytics with period-bounded ready-photo facts', () => {
    const result = buildBodyCompositionProgress({
      weightHistory: weights,
      bodyMeasurements: measurements,
      progressPhotos: [
        photo('old', 'front', '2026-01-01T00:00:00.000Z'),
        photo('front-1', 'front', '2026-07-20T00:00:00.000Z'),
        photo('front-2', 'front', '2026-08-21T00:00:00.000Z'),
        photo('side-1', 'side', '2026-08-10T00:00:00.000Z'),
        photo('deleting', 'back', '2026-08-15T00:00:00.000Z', 'deleting'),
      ],
      endAt: '2026-08-22T00:00:00.000Z',
      periodDays: 90,
    });

    expect(result.weight.currentWeight).toBe(78);
    expect(result.weight.recentEntries.some(({ id }) => id === 'old-weight')).toBe(false);
    expect(result.weight.recentEntries.some(({ id }) => id === 'future')).toBe(false);
    expect(result.weightTrend.map(({ id }) => id)).toEqual(['w1', 'w2']);
    expect(result.waist).toMatchObject({ currentCm: 80, deltaCm: -4, entries: 2 });
    expect(result.photos.total).toBe(3);
    expect(result.photos.byPose).toEqual({ front: 2, side: 1, back: 0 });
    expect(result.photos.comparablePoses).toEqual(['front']);
    expect(result.photos.timeline.map(({ id }) => id)).toEqual(['front-2', 'side-1', 'front-1']);
    expect(result.photos.timelineTruncated).toBe(false);
    expect(result.evidence).toEqual({ hasWeight: true, hasWaist: true, hasPhotos: true });
  });

  it('uses one explicit period boundary for weight, measurements and photos', () => {
    const result = buildBodyCompositionProgress({
      weightHistory: weights,
      bodyMeasurements: measurements,
      progressPhotos: [photo('july', 'front', '2026-07-01T00:00:00.000Z')],
      endAt: '2026-08-22T00:00:00.000Z',
      periodDays: 30,
    });

    expect(result.period.days).toBe(30);
    expect(result.weight.recentEntries.map(({ id }) => id)).toEqual(['w2']);
    expect(result.weightTrend.map(({ id }) => id)).toEqual(['w2']);
    expect(result.measurements.groups.some((group) => group.key === 'waist:')).toBe(true);
    expect(result.photos.total).toBe(0);
  });

  it('keeps user-entered body-fat data as stored measurement evidence without inventing a photo estimate', () => {
    const result = buildBodyCompositionProgress({
      weightHistory: weights,
      bodyMeasurements: measurements,
      progressPhotos: [],
      endAt: '2026-08-22T00:00:00.000Z',
      periodDays: 90,
    });

    expect(result.measurements.groups.some((group) => group.metric === 'body_fat')).toBe(true);
    expect('bodyFatEstimate' in result).toBe(false);
    expect(result.evidence.hasPhotos).toBe(false);
  });

  it('requires an explicit valid endAt boundary', () => {
    expect(() =>
      buildBodyCompositionProgress({
        weightHistory: [],
        bodyMeasurements: [],
        progressPhotos: [],
        endAt: 'invalid',
      }),
    ).toThrow(/valid endAt/);
  });
});
