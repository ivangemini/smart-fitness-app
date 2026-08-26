import { useEffect, useState } from 'react';

import { formatLocalDate } from '@/lib';

import type { DailyActivityFacts } from './activity-contract';
import { getActivityFactSource } from './activitySourceRuntime';
import type { HealthActivityAvailability } from './steps-contract';

export type DailyActivityFactsState = {
  availability: HealthActivityAvailability;
  facts: DailyActivityFacts | null;
  loading: boolean;
};

export function useDailyActivityFacts(date = new Date()): DailyActivityFactsState {
  const localDate = formatLocalDate(date);
  const [state, setState] = useState<DailyActivityFactsState>({
    availability: 'unavailable',
    facts: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    const source = getActivityFactSource();

    void (async () => {
      const availability = await source.getAvailability();
      const facts =
        availability === 'available'
          ? await source.readDailyActivity(localDate)
          : null;
      if (!cancelled) {
        setState({ availability, facts, loading: false });
      }
    })().catch(() => {
      if (!cancelled) {
        setState({ availability: 'unavailable', facts: null, loading: false });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [localDate]);

  return state;
}
