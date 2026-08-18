import { resolveBodyMeasurementStructuredValue } from '@/features/progress/bodyMeasurementModel';
import type { BodyMeasurement, BodyMeasurementMetric } from '@/types';

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_PERIOD_DAYS = 90;
const MAX_PERIOD_DAYS = 180;
const MAX_GROUPS = 20;
const MAX_POINTS_PER_GROUP = 24;

export type BodyMeasurementSeriesPoint = {
  id: string;
  recordedAt: string;
  canonicalValue: number;
  canonicalUnit: 'cm' | 'percent';
};

export type BodyMeasurementSeriesGroup = {
  key: string;
  metric?: BodyMeasurementMetric;
  label: string;
  canonicalUnit: 'cm' | 'percent';
  currentCanonicalValue: number;
  periodDeltaCanonical: number | null;
  totalMatchingPoints: number;
  pointsTruncated: boolean;
  points: BodyMeasurementSeriesPoint[];
};

export type BodyMeasurementProgressAnalytics = {
  period: { startAt: string; endAt: string; days: number };
  groups: BodyMeasurementSeriesGroup[];
  unresolvedEntryCount: number;
  groupsTruncated: boolean;
};

const clampDays = (value: number | undefined) => {
  if (!Number.isFinite(value)) return DEFAULT_PERIOD_DAYS;
  return Math.min(MAX_PERIOD_DAYS, Math.max(1, Math.trunc(value as number)));
};

const round = (value: number, digits = 2) => {
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
};

const parseTimestamp = (value: string) => {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
};

const groupKey = (measurement: BodyMeasurement) =>
  measurement.metric
    ? `${measurement.metric}:${
        measurement.metric === 'custom' ? measurement.label.trim().toLocaleLowerCase() : ''
      }`
    : `label:${measurement.label.trim().toLocaleLowerCase()}`;

export const buildBodyMeasurementProgressAnalytics = (
  measurements: BodyMeasurement[],
  options: { endAt: string; periodDays?: number },
): BodyMeasurementProgressAnalytics => {
  const endTimestamp = parseTimestamp(options.endAt);
  if (endTimestamp === null) {
    throw new Error('buildBodyMeasurementProgressAnalytics requires a valid endAt timestamp');
  }

  const periodDays = clampDays(options.periodDays);
  const startTimestamp = endTimestamp - periodDays * DAY_MS;
  const grouped = new Map<
    string,
    Array<{
      measurement: BodyMeasurement;
      timestamp: number;
      canonicalValue: number;
      canonicalUnit: 'cm' | 'percent';
    }>
  >();
  let unresolvedEntryCount = 0;

  measurements.forEach((measurement) => {
    const timestamp = parseTimestamp(measurement.createdAt);
    if (timestamp === null || timestamp < startTimestamp || timestamp > endTimestamp) return;
    const resolved = resolveBodyMeasurementStructuredValue(measurement);
    if (
      resolved?.canonicalNumericValue === null ||
      resolved?.canonicalNumericValue === undefined ||
      !resolved.canonicalUnit
    ) {
      unresolvedEntryCount += 1;
      return;
    }
    const key = groupKey(measurement);
    const current = grouped.get(key) ?? [];
    current.push({
      measurement,
      timestamp,
      canonicalValue: resolved.canonicalNumericValue,
      canonicalUnit: resolved.canonicalUnit,
    });
    grouped.set(key, current);
  });

  const allGroups = Array.from(grouped.entries())
    .map(([key, entries]): BodyMeasurementSeriesGroup | null => {
      const sorted = entries.sort((a, b) => a.timestamp - b.timestamp);
      const canonicalUnit = sorted[sorted.length - 1].canonicalUnit;
      const comparable = sorted.filter((entry) => entry.canonicalUnit === canonicalUnit);
      if (comparable.length === 0) return null;
      const latest = comparable[comparable.length - 1];
      const first = comparable[0];
      const selected = comparable.slice(-MAX_POINTS_PER_GROUP);
      return {
        key,
        ...(latest.measurement.metric ? { metric: latest.measurement.metric } : {}),
        label: latest.measurement.label,
        canonicalUnit,
        currentCanonicalValue: round(latest.canonicalValue),
        periodDeltaCanonical:
          comparable.length > 1 ? round(latest.canonicalValue - first.canonicalValue) : null,
        totalMatchingPoints: comparable.length,
        pointsTruncated: comparable.length > selected.length,
        points: selected.map((entry) => ({
          id: entry.measurement.id,
          recordedAt: entry.measurement.createdAt,
          canonicalValue: round(entry.canonicalValue),
          canonicalUnit: entry.canonicalUnit,
        })),
      };
    })
    .filter((group): group is BodyMeasurementSeriesGroup => group !== null)
    .sort((a, b) => {
      const aTime = Date.parse(a.points[a.points.length - 1]?.recordedAt ?? '');
      const bTime = Date.parse(b.points[b.points.length - 1]?.recordedAt ?? '');
      return bTime - aTime || a.label.localeCompare(b.label);
    });

  return {
    period: {
      startAt: new Date(startTimestamp).toISOString(),
      endAt: new Date(endTimestamp).toISOString(),
      days: periodDays,
    },
    groups: allGroups.slice(0, MAX_GROUPS),
    unresolvedEntryCount,
    groupsTruncated: allGroups.length > MAX_GROUPS,
  };
};
