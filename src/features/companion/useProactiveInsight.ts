import { useCallback, useEffect, useState } from 'react';

import { createAsyncStorageAdapter } from '@/storage';
import type { WorkoutSession } from '@/types';

import {
  selectProactiveInsight,
  type ProactiveInsight,
} from './proactiveInsights';
import {
  createProactivePresentationStore,
  type ProactivePresentationStore,
} from './proactivePresentationStore';

const defaultStore = createProactivePresentationStore(createAsyncStorageAdapter());

export const resolveProactiveInsightForPresentation = async ({
  nowAt,
  sessions,
  store,
  userId,
}: {
  nowAt: string;
  sessions: WorkoutSession[];
  store: ProactivePresentationStore;
  userId: string;
}): Promise<ProactiveInsight | null> => {
  try {
    const presentation = await store.read(userId);
    const insight = selectProactiveInsight({ sessions, nowAt, presentation });
    if (!insight) return null;

    // Persist the global cooldown before exposing the card. If persistence fails,
    // fail closed so reopening the screen cannot repeatedly surface the same insight.
    await store.recordShown(userId, nowAt);
    return insight;
  } catch {
    return null;
  }
};

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
