import type { LabResultDto } from './types';

export type LabMultiTrendMode = 'absolute' | 'relative_reference';

export type LabTrendPoint = {
  collectedAt: string;
  value: number;
};

export function toLabTrendPoint(
  result: LabResultDto,
  mode: LabMultiTrendMode,
): LabTrendPoint | null {
  if (!Number.isFinite(result.value)) return null;
  if (mode === 'absolute') {
    return { collectedAt: result.collectedAt, value: result.value };
  }

  const interval = result.referenceInterval;
  if (
    !interval ||
    interval.low === null ||
    interval.high === null ||
    !Number.isFinite(interval.low) ||
    !Number.isFinite(interval.high) ||
    interval.high <= interval.low ||
    interval.unit !== result.unit
  ) {
    return null;
  }

  return {
    collectedAt: result.collectedAt,
    value: ((result.value - interval.low) / (interval.high - interval.low)) * 100,
  };
}

export function isMarkerCompatibleWithSelection(input: {
  candidate: LabResultDto;
  selected: readonly LabResultDto[];
  mode: LabMultiTrendMode;
}): boolean {
  if (input.mode === 'relative_reference') {
    return toLabTrendPoint(input.candidate, input.mode) !== null;
  }
  if (input.selected.length === 0) return true;
  return input.selected.every((selected) => selected.unit === input.candidate.unit);
}

export function buildLabTrendPoints(
  history: readonly LabResultDto[],
  mode: LabMultiTrendMode,
): LabTrendPoint[] {
  return history
    .map((result) => toLabTrendPoint(result, mode))
    .filter((point): point is LabTrendPoint => point !== null)
    .filter((point) => !Number.isNaN(new Date(point.collectedAt).getTime()))
    .sort((left, right) => left.collectedAt.localeCompare(right.collectedAt));
}
