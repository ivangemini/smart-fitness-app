import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  createSocialApi,
  getSocialApiErrorCode,
  uploadSignedSocialMedia,
  type SocialMediaOwnerAssetDto,
  type SocialStoryOverlayPlacement,
} from '@/api/social';
import { useAuthSession } from '@/hooks/useAuthSession';

import { pollManagedMediaAsset } from './managedMediaPolling';
import { runManagedMediaUploadComposition } from './managedMediaUploadComposition';
import {
  clearSocialStoryMediaDraft,
  loadSocialStoryMediaDraft,
  saveSocialStoryMediaDraft,
} from './socialStoryMediaDraftStore';
import {
  captureSocialStoryImage,
  prepareSocialStoryImage,
  recoverPendingSocialStoryImage,
  selectSocialStoryImage,
  type SelectedSocialStoryImage,
} from './socialStoryImage';
import type { SocialStoryCopy } from './socialStoryCopy';
import {
  getApprovedSocialStoryMediaInput,
  getSocialStoryMediaErrorMessage,
  type SocialStoryMediaOperation,
} from './socialStoryMediaModel';
import {
  resolveSocialStoryPublishIdentity,
  shouldResetSocialStoryPublishIdentity,
  type SocialStoryPublishIdentity,
} from './socialStoryPublishIdentity';
import { requestSocialStoryRefresh } from './socialStoryRefreshSignal';

const POLL_ATTEMPTS = 12;
const POLL_INTERVAL_MS = 2_000;

const createUploadIdempotencyKey = (): string => {
  const randomUuid = globalThis.crypto?.randomUUID?.();
  if (randomUuid) return `story-image-${randomUuid}`;
  return `story-image-${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random()
    .toString(36)
    .slice(2)}`;
};

const isTerminal = (asset: SocialMediaOwnerAssetDto): boolean =>
  asset.state === 'approved' ||
  asset.state === 'review_required' ||
  asset.state === 'rejected' ||
  asset.state === 'failed' ||
  asset.state === 'deleted';

export function useSocialStoryAuthoring(copy: SocialStoryCopy) {
  const { isAuthenticated, ready, refresh, session } = useAuthSession();
  const accountId = session?.user.id ?? null;
  const sequence = useRef(0);
  const abortController = useRef<AbortController | null>(null);
  const recoveredPendingAccount = useRef<string | null>(null);
  const publishIdentity = useRef<SocialStoryPublishIdentity | null>(null);
  const [asset, setAsset] = useState<SocialMediaOwnerAssetDto | null>(null);
  const [caption, setCaption] = useState('');
  const [overlayText, setOverlayText] = useState('');
  const [overlayPlacement, setOverlayPlacement] =
    useState<SocialStoryOverlayPlacement>('center');
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [operation, setOperation] = useState<SocialStoryMediaOperation>('loading');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const auth = useMemo(
    () => ({
      getAccessToken: async () => session?.tokens.accessToken ?? null,
      refreshAccessToken: async () => (await refresh())?.tokens.accessToken ?? null,
    }),
    [refresh, session?.tokens.accessToken],
  );
  const api = useMemo(() => createSocialApi(auth), [auth]);
  const attachment = useMemo(() => getApprovedSocialStoryMediaInput(asset), [asset]);

  useEffect(() => {
    publishIdentity.current = null;
    setCaption('');
    setOverlayText('');
    setOverlayPlacement('center');
  }, [accountId]);

  const isCurrent = useCallback(
    (requestSequence: number): boolean => requestSequence === sequence.current,
    [],
  );

  const clearDraft = useCallback(
    async (requestSequence?: number) => {
      if (accountId) await clearSocialStoryMediaDraft(accountId);
      if (requestSequence !== undefined && !isCurrent(requestSequence)) return;
      setAsset(null);
      setPreviewUri(null);
    },
    [accountId, isCurrent],
  );

  const refreshAsset = useCallback(
    async (
      assetId: string,
      requestSequence: number,
    ): Promise<SocialMediaOwnerAssetDto> => {
      const next = await api.getMediaAsset(assetId);
      if (!isCurrent(requestSequence)) return next;
      if (next.assetType !== 'story_image') {
        await clearDraft(requestSequence);
        throw new Error('Invalid Story media asset type');
      }
      setAsset(next);
      if (next.state === 'deleted') await clearDraft(requestSequence);
      return next;
    },
    [api, clearDraft, isCurrent],
  );

  const pollAsset = useCallback(
    async (assetId: string, requestSequence: number): Promise<void> => {
      if (!isCurrent(requestSequence)) return;
      setOperation('polling');
      await pollManagedMediaAsset({
        assetId,
        attempts: POLL_ATTEMPTS,
        intervalMs: POLL_INTERVAL_MS,
        isCurrent: () => isCurrent(requestSequence),
        refreshAsset: (currentAssetId) => refreshAsset(currentAssetId, requestSequence),
        isTerminal,
      });
    },
    [isCurrent, refreshAsset],
  );

  const load = useCallback(async () => {
    const requestSequence = ++sequence.current;
    abortController.current?.abort();
    setAsset(null);
    setPreviewUri(null);
    setUploadProgress(null);
    setErrorMessage(null);
    if (!ready) {
      setOperation('loading');
      return;
    }
    if (!isAuthenticated || !accountId) {
      setOperation('idle');
      return;
    }
    setOperation('loading');
    try {
      const draft = await loadSocialStoryMediaDraft(accountId);
      if (!isCurrent(requestSequence) || !draft) return;
      setPreviewUri(draft.previewUri);
      const restored = await api.getMediaAsset(draft.assetId);
      if (!isCurrent(requestSequence)) return;
      if (restored.assetType !== 'story_image' || restored.state === 'deleted') {
        await clearDraft(requestSequence);
        return;
      }
      setAsset(restored);
    } catch (error) {
      if (isCurrent(requestSequence)) {
        setErrorMessage(getSocialStoryMediaErrorMessage(error, copy));
      }
    } finally {
      if (isCurrent(requestSequence)) setOperation('idle');
    }
  }, [accountId, api, clearDraft, copy, isAuthenticated, isCurrent, ready]);

  useEffect(() => {
    void load();
    return () => {
      sequence.current += 1;
      abortController.current?.abort();
    };
  }, [load]);

  const uploadSelected = useCallback(
    async (selected: SelectedSocialStoryImage): Promise<void> => {
      if (!accountId || !isAuthenticated) return;
      const requestSequence = ++sequence.current;
      setPreviewUri(selected.uri);
      setErrorMessage(null);
      setUploadProgress(null);
      setOperation('preparing');
      try {
        const prepared = await prepareSocialStoryImage(selected);
        if (!isCurrent(requestSequence)) return;
        setPreviewUri(prepared.uri);
        const controller = new AbortController();
        abortController.current = controller;
        const result = await runManagedMediaUploadComposition({
          prepared,
          createUpload: () =>
            api.createStoryImageUpload({
              schemaVersion: 1,
              assetType: 'story_image',
              mediaType: prepared.mediaType,
              byteSize: prepared.byteSize,
              idempotencyKey: createUploadIdempotencyKey(),
            }),
          persistDraft: (createdAsset) =>
            saveSocialStoryMediaDraft(accountId, {
              assetId: createdAsset.assetId,
              previewUri: prepared.uri,
            }),
          uploadSigned: uploadSignedSocialMedia,
          completeUpload: (assetId, expectedStateVersion) =>
            api.completeMediaUpload(assetId, expectedStateVersion),
          validateAsset: (candidate) => {
            if (candidate.assetType !== 'story_image') {
              throw new Error('Invalid Story media asset type');
            }
          },
          isCurrent: () => isCurrent(requestSequence),
          onAsset: setAsset,
          onStage: setOperation,
          onProgress: setUploadProgress,
          signal: controller.signal,
        });
        if (result.outcome === 'completed') {
          await pollAsset(result.asset.assetId, requestSequence);
        }
      } catch (error) {
        if (isCurrent(requestSequence)) {
          setErrorMessage(getSocialStoryMediaErrorMessage(error, copy));
        }
      } finally {
        if (isCurrent(requestSequence)) {
          setOperation('idle');
          setUploadProgress(null);
        }
      }
    },
    [accountId, api, copy, isAuthenticated, isCurrent, pollAsset],
  );

  const replaceWithSelected = useCallback(
    async (selected: SelectedSocialStoryImage): Promise<void> => {
      const requestSequence = sequence.current;
      const previousAsset = asset;
      if (previousAsset && previousAsset.state !== 'deleted') {
        setOperation('deleting');
        await api.deleteMediaAsset(previousAsset.assetId, previousAsset.stateVersion);
        if (!isCurrent(requestSequence)) return;
        await clearDraft(requestSequence);
        if (!isCurrent(requestSequence)) return;
      }
      await uploadSelected(selected);
    },
    [api, asset, clearDraft, isCurrent, uploadSelected],
  );

  const chooseImage = useCallback(
    async (source: 'library' | 'camera' = 'library') => {
      if (!accountId || !isAuthenticated || operation !== 'idle') return;
      const requestSequence = sequence.current;
      setErrorMessage(null);
      setOperation('selecting');
      try {
        const selected =
          source === 'camera'
            ? await captureSocialStoryImage()
            : await selectSocialStoryImage();
        if (!selected || !isCurrent(requestSequence)) {
          if (isCurrent(requestSequence)) setOperation('idle');
          return;
        }
        await replaceWithSelected(selected);
      } catch (error) {
        if (isCurrent(requestSequence)) {
          setErrorMessage(getSocialStoryMediaErrorMessage(error, copy));
          setOperation('idle');
        }
      }
    },
    [accountId, copy, isAuthenticated, isCurrent, operation, replaceWithSelected],
  );

  useEffect(() => {
    if (!accountId || !isAuthenticated) {
      recoveredPendingAccount.current = null;
      return;
    }
    if (operation !== 'idle' || recoveredPendingAccount.current === accountId) return;
    recoveredPendingAccount.current = accountId;
    const requestSequence = sequence.current;
    void recoverPendingSocialStoryImage()
      .then((selected) => {
        if (selected && isCurrent(requestSequence)) {
          void replaceWithSelected(selected);
        }
      })
      .catch((error: unknown) => {
        if (isCurrent(requestSequence)) {
          setErrorMessage(getSocialStoryMediaErrorMessage(error, copy));
        }
      });
  }, [accountId, copy, isAuthenticated, isCurrent, operation, replaceWithSelected]);

  const refreshStatus = useCallback(async () => {
    if (operation !== 'idle' || !asset) return;
    const requestSequence = sequence.current;
    setErrorMessage(null);
    setOperation('loading');
    try {
      await refreshAsset(asset.assetId, requestSequence);
    } catch (error) {
      if (isCurrent(requestSequence)) {
        setErrorMessage(getSocialStoryMediaErrorMessage(error, copy));
      }
    } finally {
      if (isCurrent(requestSequence)) setOperation('idle');
    }
  }, [asset, copy, isCurrent, operation, refreshAsset]);

  const removeImage = useCallback(async () => {
    if (operation !== 'idle') return;
    const requestSequence = sequence.current;
    const target = asset;
    setErrorMessage(null);
    setOperation('deleting');
    try {
      if (target && target.state !== 'deleted') {
        await api.deleteMediaAsset(target.assetId, target.stateVersion);
      }
      if (!isCurrent(requestSequence)) return;
      await clearDraft(requestSequence);
    } catch (error) {
      if (isCurrent(requestSequence)) {
        setErrorMessage(getSocialStoryMediaErrorMessage(error, copy));
      }
    } finally {
      if (isCurrent(requestSequence)) setOperation('idle');
    }
  }, [api, asset, clearDraft, copy, isCurrent, operation]);

  const publish = useCallback(async (): Promise<string | null> => {
    if (!accountId || !attachment || operation !== 'idle') return null;
    const requestSequence = sequence.current;
    const normalizedCaption = caption.trim();
    const normalizedOverlayText = overlayText.trim();
    const composition = {
      assetId: attachment.assetId,
      expectedStateVersion: attachment.expectedStateVersion,
      caption: normalizedCaption || null,
      overlay: normalizedOverlayText
        ? { text: normalizedOverlayText, placement: overlayPlacement }
        : null,
    };
    const identity = resolveSocialStoryPublishIdentity(
      publishIdentity.current,
      composition,
    );
    publishIdentity.current = identity;
    setErrorMessage(null);
    setOperation('publishing');
    try {
      const story = await api.createStory({
        schemaVersion: 1,
        idempotencyKey: identity.idempotencyKey,
        ...(normalizedCaption ? { caption: normalizedCaption } : {}),
        ...(normalizedOverlayText
          ? {
              overlay: {
                schemaVersion: 1,
                text: normalizedOverlayText,
                placement: overlayPlacement,
              },
            }
          : {}),
        image: attachment,
      });
      publishIdentity.current = null;
      await clearSocialStoryMediaDraft(accountId);
      if (!isCurrent(requestSequence)) return story.id;
      setAsset(null);
      setCaption('');
      setOverlayText('');
      setOverlayPlacement('center');
      setPreviewUri(null);
      requestSocialStoryRefresh();
      return story.id;
    } catch (error) {
      if (shouldResetSocialStoryPublishIdentity(getSocialApiErrorCode(error))) {
        publishIdentity.current = null;
      }
      if (isCurrent(requestSequence)) {
        setErrorMessage(getSocialStoryMediaErrorMessage(error, copy));
      }
      return null;
    } finally {
      if (isCurrent(requestSequence)) setOperation('idle');
    }
  }, [
    accountId,
    api,
    attachment,
    caption,
    copy,
    isCurrent,
    operation,
    overlayPlacement,
    overlayText,
  ]);

  const previewAspectRatio =
    asset?.publicDescriptor?.aspectRatio ??
    (asset?.source ? asset.source.width / asset.source.height : 1);

  return {
    asset,
    canPublish: Boolean(attachment) && operation === 'idle',
    caption,
    errorMessage,
    isAuthenticated,
    operation,
    overlayPlacement,
    overlayText,
    previewAspectRatio,
    previewUri,
    ready,
    uploadProgress,
    chooseImage,
    clearError: () => setErrorMessage(null),
    publish,
    refreshStatus,
    removeImage,
    setCaption,
    setOverlayPlacement,
    setOverlayText,
  };
}
