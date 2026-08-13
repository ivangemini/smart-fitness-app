import { describe, expect, it, vi } from 'vitest';

import { uploadLabPhoto } from './labPhotoUpload';

describe('uploadLabPhoto', () => {
  it('uploads selected bytes through the signed URL before completing the document', async () => {
    const createUpload = vi.fn(async () => ({
      document: { id: 'document-1' },
      upload: {
        method: 'PUT' as const,
        url: 'https://storage.example.test/signed-upload',
        headers: { 'x-test-signature': 'signed' },
        expiresAt: '2026-08-13T10:00:00.000Z',
      },
    }));
    const completeUpload = vi.fn(async () => ({ id: 'document-1' }));
    const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.startsWith('file://')) {
        return new Response(new Blob(['lab-image']), { status: 200 });
      }
      expect(url).toBe('https://storage.example.test/signed-upload');
      expect(init?.method).toBe('PUT');
      expect(init?.headers).toMatchObject({
        'x-test-signature': 'signed',
        'content-type': 'image/jpeg',
      });
      expect(init?.body).toBeInstanceOf(Blob);
      return new Response(null, { status: 200 });
    }) as unknown as typeof fetch;

    const result = await uploadLabPhoto(
      {
        uri: 'file:///lab.jpg',
        fileName: 'lab.jpg',
        mimeType: 'image/jpeg',
      },
      { createUpload, completeUpload } as never,
      fetchImpl,
    );

    expect(result).toEqual({ documentId: 'document-1' });
    expect(createUpload).toHaveBeenCalledWith({
      fileName: 'lab.jpg',
      mediaType: 'image/jpeg',
      byteSize: 9,
    });
    expect(completeUpload).toHaveBeenCalledWith('document-1');
  });

  it('rejects unsupported image types before creating an upload', async () => {
    const createUpload = vi.fn();
    const completeUpload = vi.fn();

    await expect(
      uploadLabPhoto(
        {
          uri: 'file:///lab.webp',
          fileName: 'lab.webp',
          mimeType: 'image/webp',
        },
        { createUpload, completeUpload } as never,
      ),
    ).rejects.toThrow('LAB_PHOTO_UNSUPPORTED_TYPE');
    expect(createUpload).not.toHaveBeenCalled();
  });
});
