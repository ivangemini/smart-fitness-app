import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { formatLocalDate } from '@/lib';

import { getNextLocalDayRefreshDelay } from './daily-step-refresh';
import { getStepActivitySource } from './stepSourceRuntime';
import type { DailyStepAggregate, HealthActivityAvailability } from './steps-contract';

export type DailyStepsState = {
  availability: HealthActivityAvailability;
  aggregate: DailyStepAggregate | null;
  loading: boolean;
};

export function useDailySteps(date?: Date): DailyStepsState {
  const fixedDateTimestamp = date?.getTime() ?? null;
  const [liveDate, setLiveDate] = useState(() => date ?? new Date());
  const [refreshRevision, setRefreshRevision] = useState(0);
  const localDate = formatLocalDate(date ?? liveDate);
  const [state, setState] = useState<DailyStepsState>({
    availability: 'unavailable',
    aggregate: null,
    loading: true,
  });

  useEffect(() => {
    if (fixedDateTimestamp !== null) return;

    const refresh = () => {
      setLiveDate(new Date());
      setRefreshRevision((current) => current + 1);
    };

    const timeout = setTimeout(
      refresh,
      getNextLocalDayRefreshDelay(new Date()),
    );
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') refresh();
    });

    return () => {
      clearTimeout(timeout);
      subscription.remove();
    };
  }, [fixedDateTimestamp, localDate, refreshRevision]);

  useEffect(() => {
    let cancelled = false;
    const source = getStepActivitySource();

    setState((current) => ({
      ...current,
      aggregate:
        current.aggregate?.localDate === localDate ? current.aggregate : null,
      loading: true,
    }));

    void (async () => {
      const availability = await source.getAvailability();
      const aggregate =
        availability === 'available'
          ? await source.readDailySteps(localDate)
          : null;

      if (aggregate && aggregate.localDate !== localDate) {
        throw new Error('step_date_mismatch');
      }

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
  }, [localDate, refreshRevision]);

  return state;
}
