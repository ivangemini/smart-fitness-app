import { useCallback, useEffect, useRef, useState } from 'react';

import { getStepActivitySource } from '@/features/health/stepSourceRuntime';

export function useHomeDailySteps(localDate: string) {
  const [steps, setSteps] = useState<number | null>(null);
  const requestSequence = useRef(0);

  const refresh = useCallback(async () => {
    const sequence = requestSequence.current + 1;
    requestSequence.current = sequence;

    try {
      const source = getStepActivitySource();
      const availability = await source.getAvailability();
      if (requestSequence.current !== sequence) return;

      if (availability !== 'available') {
        setSteps(null);
        return;
      }

      const aggregate = await source.readDailySteps(localDate);
      if (requestSequence.current === sequence) {
        setSteps(aggregate?.steps ?? null);
      }
    } catch {
      if (requestSequence.current === sequence) {
        setSteps(null);
      }
    }
  }, [localDate]);

  useEffect(() => {
    void refresh();
    return () => {
      requestSequence.current += 1;
    };
  }, [refresh]);

  return { refresh, steps };
}
