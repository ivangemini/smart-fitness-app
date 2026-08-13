import type { LabResultDto } from './types';

export type LabHistoryWindow = '3m' | '6m' | '1y' | 'all';

const WINDOW_DAYS: Readonly<Record<Exclude<LabHistoryWindow, 'all'>, number>> = {
  '3m': 90,
  '6m': 180,
  '1y': 365,
};

export function filterLabHistoryWindow(
  results: readonly LabResultDto[],
  window: LabHistoryWindow,
): LabResultDto[] {
  const ordered = [...results]
    .filter((result) => !Number.isNaN(new Date(result.collectedAt).getTime()))
    .sort((left, right) => left.collectedAt.localeCompare(right.collectedAt));
  if (window === 'all' || ordered.length === 0) return ordered;

  const anchor = new Date(ordered.at(-1)!.collectedAt).getTime();
  const cutoff = anchor - WINDOW_DAYS[window] * 24 * 60 * 60 * 1000;
  return ordered.filter((result) => new Date(result.collectedAt).getTime() >= cutoff);
}
