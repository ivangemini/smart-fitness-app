import { useCallback, useEffect, useState } from 'react';

import { createAsyncStorageAdapter } from '@/storage';
import type { WorkoutSession } from '@/types';

import type { ProactiveInsight } from './proactiveInsights';
import { resolveProactiveInsightForPresentation } from './proactiveInsightPresentation';
import {
  createProactivePresentationStore,
  type ProactivePresentationStore,
} from './proactivePresentationStore';

const defaultStore = createProactivePresentationStore(createAsyncStorageAdapter());

export const useProactiveInsight = ({
  sessions,
  userId,
  store = defaultStore,
}: {
  sessions: WorkoutSession[];
  userId: string | null;
  store?: ProactivePresentationStore;
}) => {
  const [insight, setInsight] = useState<ProactiveInsight | null>(null);

  useEffect(() => {
    let cancelled = false;
    setInsight(null);
    if (!userId) return () => undefined;

    const nowAt = new Date().toISOString();
    void resolveProactiveInsightForPresentation({
      nowAt,
      sessions,
      store,
      userId,
    }).then((nextInsight) => {
      if (!cancelled) setInsight(nextInsight);
    });

    return () => {
      cancelled = true;
    };
  }, [sessions, store, userId]);

  const dismiss = useCallback(async () => {
    if (!insight || !userId) return false;
    try {
      await store.dismiss(userId, insight.key);
      setInsight((current) => (current?.key === insight.key ? null : current));
      return true;
    } catch {
      return false;
    }
  }, [insight, store, userId]);

  return { dismiss, insight };
};
