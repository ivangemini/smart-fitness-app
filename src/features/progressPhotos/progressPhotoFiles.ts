export type ManagedProgressPhotoFileInput = {
  userId: string;
  photoId: string;
  sourceUri: string;
  mimeType: string;
};

const unsupported = async (): Promise<never> => {
  throw new Error('Progress photo file storage is unavailable on this platform.');
};

export const persistProgressPhotoFile = unsupported;
export const deleteProgressPhotoFile = async (_localUri: string): Promise<void> => undefined;
export const deleteProgressPhotoAccountFiles = async (_userId: string): Promise<void> => undefined;
