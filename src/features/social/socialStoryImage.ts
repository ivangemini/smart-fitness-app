import * as ImagePicker from 'expo-image-picker';

import { SocialManagedAvatarImageError } from './socialManagedAvatarErrors';
import {
  prepareSocialWorkoutPostImage,
  recoverPendingSocialWorkoutPostImage,
  selectSocialWorkoutPostImage,
  type PreparedSocialWorkoutPostImage,
  type SelectedSocialWorkoutPostImage,
} from './socialWorkoutPostImage';

export const prepareSocialStoryImage = prepareSocialWorkoutPostImage;
export const recoverPendingSocialStoryImage = recoverPendingSocialWorkoutPostImage;
export const selectSocialStoryImage = selectSocialWorkoutPostImage;

export type PreparedSocialStoryImage = PreparedSocialWorkoutPostImage;
export type SelectedSocialStoryImage = SelectedSocialWorkoutPostImage;

const toCapturedStoryImage = (
  result: ImagePicker.ImagePickerResult | ImagePicker.ImagePickerErrorResult | null,
): SelectedSocialStoryImage | null => {
  if (!result || 'code' in result) {
    if (result && 'code' in result) {
      throw new SocialManagedAvatarImageError('selection_failed');
    }
    return null;
  }
  if (result.canceled) return null;
  const asset = result.assets?.[0];
  if (
    !asset ||
    asset.type !== 'image' ||
    !asset.uri ||
    !Number.isFinite(asset.width) ||
    !Number.isFinite(asset.height) ||
    asset.width < 1 ||
    asset.height < 1
  ) {
    throw new SocialManagedAvatarImageError('unsupported_image');
  }
  return { uri: asset.uri, width: asset.width, height: asset.height };
};

export const captureSocialStoryImage = async (): Promise<SelectedSocialStoryImage | null> => {
  try {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      throw new SocialManagedAvatarImageError('permission_denied');
    }
    return toCapturedStoryImage(
      await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        exif: false,
        mediaTypes: ['images'],
        quality: 1,
      }),
    );
  } catch (error) {
    if (error instanceof SocialManagedAvatarImageError) throw error;
    throw new SocialManagedAvatarImageError('selection_failed');
  }
};
