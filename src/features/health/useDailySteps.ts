import { useEffect, useState } from 'react';

import { formatLocalDate } from '@/lib';

import { getStepActivitySource } from './stepSourceRuntime';
import type { DailyStepAggregate, HealthActivityAvailability } from './steps-contract';

export type DailyStepsState = {
  availability: HealthActivityAvailability;
  aggregate: DailyStepAggregate | null;
  loading: boolean;
};

export function useDailySteps(date = new Date()): DailyStepsState {
  const localDate = formatLocalDate(date);
  const [state, setState] = useState<DailyStepsState>({
    availability: 'unavailable',
    aggregate: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    const source = getStepActivitySource();

    void (async () => {
      const availability = await source.getAvailability();
      const aggregate =
        availability === 'available'
          ? await source.readDailySteps(localDate)
          : null;
      if (!cancelled) {
        setState({ availability, aggregate, loading: false });
      }
    })().catch(() => {
      if (!cancelled) {
        setState({ availability: 'unavailable', aggregate: null, loading: false });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [localDate]);

  return state;
}
