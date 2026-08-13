import type { DailyStepsState } from './useDailySteps';

export function formatDailyStepsLabel(
  state: DailyStepsState,
  formatNumber: (value: number) => string,
): string {
  if (state.loading || state.availability !== 'available' || !state.aggregate) {
    return '—';
  }

  return formatNumber(state.aggregate.steps);
}
