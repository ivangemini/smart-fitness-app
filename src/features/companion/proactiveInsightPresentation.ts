import type { WorkoutSession } from '@/types';

import {
  selectProactiveInsight,
  type ProactiveInsight,
} from './proactiveInsights';
import type { ProactivePresentationStore } from './proactivePresentationStore';

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
