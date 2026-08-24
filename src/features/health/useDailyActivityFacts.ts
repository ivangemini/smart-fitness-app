import { useCallback, useEffect, useRef, useState } from 'react';

import { formatLocalDate } from '@/lib';

import type { DailyActivityFacts } from './activity-contract';
import { getActivityFactSource } from './activitySourceRuntime';
import type { HealthActivityAvailability } from './steps-contract';

export type DailyActivityFactsState = {
  availability: HealthActivityAvailability;
  facts: DailyActivityFacts | null;
  loading: boolean;
  connect: () => Promise<void>;
  refresh: () => Promise<void>;
};

type ActivityReadMode = 'check' | 'request_permission';

export function useDailyActivityFacts(date = new Date()): DailyActivityFactsState {
  const localDate = formatLocalDate(date);
  const mountedRef = useRef(true);
  const [state, setState] = useState<
    Omit<DailyActivityFactsState, 'connect' | 'refresh'>
  >({
    availability: 'unavailable',
    facts: null,
    loading: true,
  });

  const read = useCallback(
    async (mode: ActivityReadMode) => {
      const source = getActivityFactSource();
      if (mountedRef.current) {
        setState((current) => ({ ...current, loading: true }));
      }

      try {
        const availability =
          mode === 'request_permission'
            ? await source.requestReadPermission()
            : await source.getAvailability();
        const facts =
          availability === 'available'
            ? await source.readDailyActivity(localDate)
            : null;
        if (mountedRef.current) {
          setState({ availability, facts, loading: false });
        }
      } catch {
        if (mountedRef.current) {
          setState({ availability: 'unavailable', facts: null, loading: false });
        }
      }
    },
    [localDate],
  );

  useEffect(() => {
    mountedRef.current = true;
    void read('check');
    return () => {
      mountedRef.current = false;
    };
  }, [read]);

  const connect = useCallback(() => read('request_permission'), [read]);
  const refresh = useCallback(() => read('check'), [read]);

  return { ...state, connect, refresh };
}
