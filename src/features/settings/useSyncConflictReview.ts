import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';

import type { SyncConflictResolutionChoice } from '@/cloud';
import {
  type SyncConflictResolutionReviewItem,
  useSyncConflictResolution,
} from '@/context/useSyncConflictResolution';
import { useWeightSync } from '@/context/SyncContext';
import { useLocalization } from '@/localization';
import { getSyncConflictResolutionUiCopy } from '@/localization/syncConflictResolutionMessages';

import { getSyncConflictResolutionOutcomeMessage } from './syncConflictResolutionPresentation';

type LoadState = 'loading' | 'ready' | 'error';

type RunningResolution = {
  choice: SyncConflictResolutionChoice | null;
  conflictId: string;
};

export type SyncConflictReviewController = {
  conflictCount: number;
  confirmResolution(
    item: SyncConflictResolutionReviewItem,
    choice: SyncConflictResolutionChoice,
  ): void;
  isBusy: boolean;
  isRetryingSync: boolean;
  items: SyncConflictResolutionReviewItem[];
  loadState: LoadState;
  notices: Record<string, string>;
  otherConflictCount: number;
  resumeResolution(item: SyncConflictResolutionReviewItem): Promise<void>;
  retryRemainingConflicts(): Promise<void>;
  runningResolution: RunningResolution | null;
};

export function useSyncConflictReview(): SyncConflictReviewController {
  const { locale } = useLocalization();
  const { conflictCount, status, syncNow } = useWeightSync();
  const { continueResolution, listReviewItems, resolve } = useSyncConflictResolution();
  const resolutionCopy = useMemo(
    () => getSyncConflictResolutionUiCopy(locale),
    [locale],
  );
  const [items, setItems] = useState<SyncConflictResolutionReviewItem[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [runningResolution, setRunningResolution] =
    useState<RunningResolution | null>(null);
  const [isRetryingSync, setIsRetryingSync] = useState(false);
  const [notices, setNotices] = useState<Record<string, string>>({});
  const loadVersionRef = useRef(0);

  const loadItems = useCallback(async () => {
    const version = ++loadVersionRef.current;
    setLoadState('loading');
    try {
      const nextItems = await listReviewItems();
      if (loadVersionRef.current !== version) return;
      setItems(nextItems);
      setLoadState('ready');
    } catch {
      if (loadVersionRef.current === version) setLoadState('error');
    }
  }, [listReviewItems]);

  useEffect(() => {
    void loadItems();
    return () => {
      loadVersionRef.current += 1;
    };
  }, [conflictCount, loadItems]);

  const finishOperation = useCallback(
    async (
      item: SyncConflictResolutionReviewItem,
      choice: SyncConflictResolutionChoice | null,
      operation: () => ReturnType<typeof resolve>,
    ) => {
      setRunningResolution({ conflictId: item.conflictId, choice });
      try {
        const outcome = await operation();
        setNotices((current) => ({
          ...current,
          [item.conflictId]: getSyncConflictResolutionOutcomeMessage(
            resolutionCopy,
            outcome.status,
          ),
        }));
        await loadItems();
      } catch {
        setNotices((current) => ({
          ...current,
          [item.conflictId]: resolutionCopy.outcomeRetryable,
        }));
      } finally {
        setRunningResolution((current) =>
          current?.conflictId === item.conflictId ? null : current,
        );
      }
    },
    [loadItems, resolutionCopy, resolve],
  );

  const runNewResolution = useCallback(
    (item: SyncConflictResolutionReviewItem, choice: SyncConflictResolutionChoice) => {
      if (!item.candidate) return Promise.resolve();
      return finishOperation(item, choice, () => resolve(item.candidate!, choice));
    },
    [finishOperation, resolve],
  );

  const resumeResolution = useCallback(
    (item: SyncConflictResolutionReviewItem) =>
      finishOperation(item, item.intentChoice, () => continueResolution(item)),
    [continueResolution, finishOperation],
  );

  const confirmResolution = useCallback(
    (item: SyncConflictResolutionReviewItem, choice: SyncConflictResolutionChoice) => {
      const keepDevice = choice === 'keep_local';
      Alert.alert(
        keepDevice ? resolutionCopy.confirmDeviceTitle : resolutionCopy.confirmAccountTitle,
        keepDevice ? resolutionCopy.confirmDeviceBody : resolutionCopy.confirmAccountBody,
        [
          { text: resolutionCopy.cancel, style: 'cancel' },
          {
            text: resolutionCopy.confirm,
            style: 'destructive',
            onPress: () => void runNewResolution(item, choice),
          },
        ],
      );
    },
    [resolutionCopy, runNewResolution],
  );

  const retryRemainingConflicts = useCallback(async () => {
    setIsRetryingSync(true);
    try {
      await syncNow();
      await loadItems();
    } finally {
      setIsRetryingSync(false);
    }
  }, [loadItems, syncNow]);

  const isBusy = status === 'syncing' || runningResolution !== null || isRetryingSync;
  const candidateCount = items.filter((item) => item.candidate !== null).length;
  const otherConflictCount = Math.max(0, conflictCount - candidateCount);

  return {
    conflictCount,
    confirmResolution,
    isBusy,
    isRetryingSync,
    items,
    loadState,
    notices,
    otherConflictCount,
    resumeResolution,
    retryRemainingConflicts,
    runningResolution,
  };
}
