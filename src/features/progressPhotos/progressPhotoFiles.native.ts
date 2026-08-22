import { Directory, File, Paths } from 'expo-file-system';

import type { ManagedProgressPhotoFileInput } from './progressPhotoFiles';

const ROOT_DIRECTORY_NAME = 'smart-fitness-progress-photos';
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const requireUuid = (value: string, label: string): string => {
  const normalized = value.trim();
  if (!UUID_PATTERN.test(normalized)) {
    throw new Error(`${label} is invalid.`);
  }
  return normalized;
};

const extensionForMimeType = (mimeType: string): string => {
  switch (mimeType.toLowerCase()) {
    case 'image/png':
      return 'png';
    case 'image/heic':
    case 'image/heif':
      return 'heic';
    case 'image/webp':
      return 'webp';
    default:
      return 'jpg';
  }
};

const rootDirectory = () => new Directory(Paths.document, ROOT_DIRECTORY_NAME);
const accountDirectory = (userId: string) =>
  new Directory(rootDirectory(), requireUuid(userId, 'Progress photo account identifier'));

export const persistProgressPhotoFile = async ({
  userId,
  photoId,
  sourceUri,
  mimeType,
}: ManagedProgressPhotoFileInput): Promise<string> => {
  if (!sourceUri.startsWith('file://')) {
    throw new Error('Progress photo source must be a local file URI.');
  }

  const directory = accountDirectory(userId);
  directory.create({ idempotent: true, intermediates: true });
  const destination = new File(
    directory,
    `${requireUuid(photoId, 'Progress photo identifier')}.${extensionForMimeType(mimeType)}`,
  );
  if (destination.exists) destination.delete();
  await new File(sourceUri).copy(destination);
  return destination.uri;
};

export const deleteProgressPhotoFile = async (localUri: string): Promise<void> => {
  if (!localUri.startsWith('file://') || !localUri.includes(`/${ROOT_DIRECTORY_NAME}/`)) {
    throw new Error('Refusing to delete an unmanaged progress photo path.');
  }
  const file = new File(localUri);
  if (file.exists) file.delete();
};

export const deleteProgressPhotoAccountFiles = async (userId: string): Promise<void> => {
  const directory = accountDirectory(userId);
  if (directory.exists) directory.delete();
};
