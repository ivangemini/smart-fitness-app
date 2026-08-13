import type { RemoteLabsRepository } from '@/repositories/RemoteLabsRepository';

const MAX_LAB_DOCUMENT_BYTES = 25 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/heic',
] as const;

type SupportedLabImageType = (typeof SUPPORTED_IMAGE_TYPES)[number];

export type LabPhotoAsset = {
  uri: string;
  fileName?: string | null;
  fileSize?: number;
  mimeType?: string | null;
};

export type LabPhotoUploadResult = {
  documentId: string;
};

const isSupportedImageType = (value: string): value is SupportedLabImageType =>
  SUPPORTED_IMAGE_TYPES.includes(value as SupportedLabImageType);

const fallbackFileName = (mediaType: SupportedLabImageType): string => {
  switch (mediaType) {
    case 'image/png':
      return 'lab-result.png';
    case 'image/heic':
      return 'lab-result.heic';
    default:
      return 'lab-result.jpg';
  }
};

export async function uploadLabPhoto(
  asset: LabPhotoAsset,
  repository: Pick<RemoteLabsRepository, 'completeUpload' | 'createUpload'>,
  fetchImpl: typeof fetch = globalThis.fetch.bind(globalThis),
): Promise<LabPhotoUploadResult> {
  const mediaType = asset.mimeType?.toLowerCase().trim();
  if (!mediaType || !isSupportedImageType(mediaType)) {
    throw new Error('LAB_PHOTO_UNSUPPORTED_TYPE');
  }

  const localResponse = await fetchImpl(asset.uri);
  if (!localResponse.ok) {
    throw new Error('LAB_PHOTO_READ_FAILED');
  }
  const body = await localResponse.blob();
  const byteSize = body.size || asset.fileSize || 0;
  if (byteSize <= 0 || byteSize > MAX_LAB_DOCUMENT_BYTES) {
    throw new Error('LAB_PHOTO_INVALID_SIZE');
  }

  const uploadEnvelope = await repository.createUpload({
    fileName: asset.fileName?.trim() || fallbackFileName(mediaType),
    mediaType,
    byteSize,
  });

  const uploadResponse = await fetchImpl(uploadEnvelope.upload.url, {
    method: uploadEnvelope.upload.method,
    headers: {
      ...uploadEnvelope.upload.headers,
      'content-type': mediaType,
    },
    body,
  });
  if (!uploadResponse.ok) {
    throw new Error('LAB_PHOTO_UPLOAD_FAILED');
  }

  await repository.completeUpload(uploadEnvelope.document.id);
  return { documentId: uploadEnvelope.document.id };
}
