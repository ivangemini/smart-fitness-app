import type { RemoteLabsRepository } from '@/repositories/RemoteLabsRepository';

const MAX_LAB_DOCUMENT_BYTES = 25 * 1024 * 1024;
const SUPPORTED_DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/heic',
] as const;

type SupportedLabDocumentType = (typeof SUPPORTED_DOCUMENT_TYPES)[number];

export type LabDocumentAsset = {
  uri: string;
  fileName?: string | null;
  fileSize?: number;
  mimeType?: string | null;
};

export type LabPhotoAsset = LabDocumentAsset;

export type LabDocumentUploadResult = {
  documentId: string;
};

export type LabPhotoUploadResult = LabDocumentUploadResult;

const isSupportedDocumentType = (value: string): value is SupportedLabDocumentType =>
  SUPPORTED_DOCUMENT_TYPES.includes(value as SupportedLabDocumentType);

const inferDocumentType = (asset: LabDocumentAsset): SupportedLabDocumentType | null => {
  const explicit = asset.mimeType?.toLowerCase().trim();
  if (explicit && isSupportedDocumentType(explicit)) return explicit;

  const fileName = asset.fileName?.toLowerCase().trim() ?? '';
  if (fileName.endsWith('.pdf')) return 'application/pdf';
  if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) return 'image/jpeg';
  if (fileName.endsWith('.png')) return 'image/png';
  if (fileName.endsWith('.heic') || fileName.endsWith('.heif')) return 'image/heic';
  return null;
};

const fallbackFileName = (mediaType: SupportedLabDocumentType): string => {
  switch (mediaType) {
    case 'application/pdf':
      return 'lab-result.pdf';
    case 'image/png':
      return 'lab-result.png';
    case 'image/heic':
      return 'lab-result.heic';
    default:
      return 'lab-result.jpg';
  }
};

export async function uploadLabDocument(
  asset: LabDocumentAsset,
  repository: Pick<RemoteLabsRepository, 'completeUpload' | 'createUpload'>,
  fetchImpl: typeof fetch = globalThis.fetch.bind(globalThis),
): Promise<LabDocumentUploadResult> {
  const mediaType = inferDocumentType(asset);
  if (!mediaType) {
    throw new Error('LAB_DOCUMENT_UNSUPPORTED_TYPE');
  }

  const localResponse = await fetchImpl(asset.uri);
  if (!localResponse.ok) {
    throw new Error('LAB_DOCUMENT_READ_FAILED');
  }
  const body = await localResponse.blob();
  const byteSize = body.size || asset.fileSize || 0;
  if (byteSize <= 0 || byteSize > MAX_LAB_DOCUMENT_BYTES) {
    throw new Error('LAB_DOCUMENT_INVALID_SIZE');
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
    throw new Error('LAB_DOCUMENT_UPLOAD_FAILED');
  }

  await repository.completeUpload(uploadEnvelope.document.id);
  return { documentId: uploadEnvelope.document.id };
}

export async function uploadLabPhoto(
  asset: LabPhotoAsset,
  repository: Pick<RemoteLabsRepository, 'completeUpload' | 'createUpload'>,
  fetchImpl: typeof fetch = globalThis.fetch.bind(globalThis),
): Promise<LabPhotoUploadResult> {
  return uploadLabDocument(asset, repository, fetchImpl);
}
