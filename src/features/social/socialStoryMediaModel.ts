import { isApiError } from '@/api/client';
import {
  getSocialApiErrorCode,
  type SocialMediaOwnerAssetDto,
  type SocialStoryMediaInput,
} from '@/api/social';
import { SignedMediaUploadError } from '@/api/social/signed-media-upload';

import { SocialManagedAvatarImageError } from './socialManagedAvatarErrors';
import type { SocialStoryCopy } from './socialStoryCopy';

export type SocialStoryMediaOperation =
  | 'idle'
  | 'loading'
  | 'selecting'
  | 'preparing'
  | 'uploading'
  | 'completing'
  | 'polling'
  | 'deleting'
  | 'publishing';

export const isSocialStoryMediaBusy = (operation: SocialStoryMediaOperation): boolean =>
  operation !== 'idle';

export const getSocialStoryMediaOperationLabel = (
  operation: SocialStoryMediaOperation,
  copy: SocialStoryCopy,
): string | null => {
  switch (operation) {
    case 'selecting':
      return copy.selectingImage;
    case 'preparing':
      return copy.preparingImage;
    case 'uploading':
      return copy.uploadingImage;
    case 'completing':
      return copy.completingImage;
    case 'polling':
      return copy.processing;
    case 'deleting':
      return copy.removingImage;
    case 'publishing':
      return copy.publishingStory;
    case 'loading':
    case 'idle':
      return null;
  }
};

export const getSocialStoryMediaStatus = (
  asset: SocialMediaOwnerAssetDto | null,
  copy: SocialStoryCopy,
): string | null => {
  if (!asset) return null;
  switch (asset.state) {
    case 'upload_pending':
      return copy.uploadPending;
    case 'quarantined':
    case 'processing':
      return copy.processing;
    case 'review_required':
      return copy.reviewRequired;
    case 'approved':
      return copy.approved;
    case 'rejected':
      return copy.imageRejected;
    case 'failed':
      return copy.failed;
    case 'deleted':
      return copy.removeImage;
  }
};

export const canRefreshSocialStoryMedia = (
  asset: SocialMediaOwnerAssetDto | null,
): boolean =>
  asset?.state === 'upload_pending' ||
  asset?.state === 'quarantined' ||
  asset?.state === 'processing' ||
  asset?.state === 'review_required';

export const getApprovedSocialStoryMediaInput = (
  asset: SocialMediaOwnerAssetDto | null,
): SocialStoryMediaInput | null =>
  asset?.assetType === 'story_image' &&
  asset.state === 'approved' &&
  asset.publicDescriptor?.assetType === 'story_image'
    ? {
        schemaVersion: 1,
        assetId: asset.assetId,
        expectedStateVersion: asset.stateVersion,
      }
    : null;

export const getSocialStoryMediaErrorMessage = (
  error: unknown,
  copy: SocialStoryCopy,
): string => {
  if (error instanceof SocialManagedAvatarImageError) {
    switch (error.code) {
      case 'permission_denied':
        return copy.imagePermissionDenied;
      case 'selection_failed':
        return copy.imageSelectionFailed;
      case 'unsupported_image':
        return copy.imageUnsupported;
      case 'processing_failed':
        return copy.imageProcessingFailed;
      case 'too_large':
        return copy.imageTooLarge;
    }
  }
  if (error instanceof SignedMediaUploadError) {
    if (error.code === 'expired') return copy.imageUploadExpired;
    if (error.code === 'size_mismatch') return copy.imageProcessingFailed;
    if (error.code === 'network') return copy.imageOffline;
    return copy.imageGenericError;
  }

  const code = getSocialApiErrorCode(error);
  if (
    code === 'SOCIAL_MEDIA_UPLOADS_UNAVAILABLE' ||
    code === 'SOCIAL_MEDIA_UPLOAD_STORAGE_UNAVAILABLE'
  ) {
    return copy.imageUploadUnavailable;
  }
  if (code === 'SOCIAL_MEDIA_UPLOAD_EXPIRED') return copy.imageUploadExpired;
  if (code === 'SOCIAL_MEDIA_UPLOAD_VALIDATION_FAILED') {
    return copy.imageValidationFailed;
  }
  if (
    code === 'SOCIAL_MEDIA_UPLOAD_STALE_STATE' ||
    code === 'SOCIAL_STORY_MEDIA_STALE_STATE'
  ) {
    return copy.imageStale;
  }
  if (code === 'SOCIAL_STORY_MEDIA_ALREADY_ATTACHED') {
    return copy.imageAlreadyAttached;
  }
  if (
    code === 'SOCIAL_MEDIA_UPLOAD_OBJECT_MISSING' ||
    code === 'SOCIAL_MEDIA_UPLOAD_OBJECT_MISMATCH' ||
    code === 'SOCIAL_MEDIA_UPLOAD_FINALIZED' ||
    code === 'SOCIAL_STORY_MEDIA_NOT_FOUND' ||
    code === 'SOCIAL_STORY_MEDIA_INVALID_TYPE' ||
    code === 'SOCIAL_STORY_MEDIA_INVALID_DESCRIPTOR' ||
    code === 'SOCIAL_STORY_MEDIA_NOT_APPROVED'
  ) {
    return copy.imageGenericError;
  }
  if (isApiError(error)) {
    if (error.status === 401 || error.code === 'unauthorized') {
      return copy.imageSessionExpired;
    }
    if (error.code === 'network_error' || error.code === 'timeout') {
      return copy.imageOffline;
    }
  }
  return copy.imageGenericError;
};
