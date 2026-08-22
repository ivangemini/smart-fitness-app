import { describe, expect, it } from 'vitest';

import { DATA_ACCESS_EXPORT_SURFACES } from '@/privacy/dataAccessExportContract';
import { MOBILE_ACCOUNT_DATA_SURFACES } from '@/privacy/mobileAccountDataInventory';

import { getProgressPhotoCopy } from './progressPhotoCopy';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('node:fs') as {
  readFileSync(path: string, encoding: string): string;
};
const { resolve } = require('node:path') as {
  resolve(...parts: string[]): string;
};
const root = resolve(__dirname, '..', '..', '..');
const readSource = (path: string) => readFileSync(resolve(root, path), 'utf8');

describe('P20-A progress photo privacy contract', () => {
  it('records local metadata and file-system surfaces with no transmission', () => {
    expect(
      MOBILE_ACCOUNT_DATA_SURFACES.find(({ id }) => id === 'progress_photo_metadata'),
    ).toMatchObject({ deletion: 'account_cleanup', transmission: 'none' });
    expect(
      MOBILE_ACCOUNT_DATA_SURFACES.find(({ id }) => id === 'progress_photo_files'),
    ).toMatchObject({ deletion: 'account_cleanup', storage: 'file_system', transmission: 'none' });
  });

  it('keeps export blocked while inventorying photo metadata', () => {
    const progress = DATA_ACCESS_EXPORT_SURFACES.find(
      ({ id }) => id === 'progress_measurements_and_weight',
    );
    expect(progress?.status).toBe('blocked');
    expect(progress?.candidateDataClasses).toContain('progress_photo_metadata');
    expect(progress?.excludedDataClasses).toContain('unreviewed_embedded_location_metadata');
  });

  it('disables EXIF collection and contains no upload call in the P20-A screen/repository', () => {
    const screen = readSource('src/features/progressPhotos/ProgressPhotosScreen.tsx');
    const repository = readSource('src/features/progressPhotos/progressPhotoRepository.ts');
    expect(screen).toContain('exif: false');
    expect(screen).not.toMatch(/upload|fetch\(|apiClient|cloudProvider/u);
    expect(repository).not.toMatch(/upload|fetch\(|apiClient|cloudProvider/u);
  });

  it('localizes the private-by-default and blocked-export disclosure', () => {
    for (const locale of ['en', 'ru'] as const) {
      const copy = getProgressPhotoCopy(locale);
      expect(copy.privateDescription.length).toBeGreaterThan(40);
      expect(copy.exportNotice.length).toBeGreaterThan(20);
    }
  });
});
