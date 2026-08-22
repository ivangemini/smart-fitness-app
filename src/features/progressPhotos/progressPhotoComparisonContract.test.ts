import { describe, expect, it } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('node:fs') as {
  readFileSync(path: string, encoding: string): string;
};
const { resolve } = require('node:path') as {
  resolve(...parts: string[]): string;
};

describe('progress photo comparison UI contract', () => {
  const featureDir = resolve(__dirname);
  const screenSource = readFileSync(
    resolve(featureDir, 'ProgressPhotoComparisonScreen.tsx'),
    'utf8',
  );
  const modelSource = readFileSync(
    resolve(featureDir, 'progressPhotoComparison.ts'),
    'utf8',
  );

  it('keeps visual comparison read-only and backed by existing progress state', () => {
    expect(screenSource).toContain('useProgressState');
    expect(screenSource).toContain('progressPhotoRepository.list');
    expect(screenSource).not.toContain('progressPhotoRepository.add');
    expect(screenSource).not.toContain('progressPhotoRepository.remove');
    expect(screenSource).not.toContain('ImagePicker');
  });

  it('uses non-cropping side-by-side rendering and fail-closed overlay eligibility', () => {
    expect(screenSource).toContain('contentFit="contain"');
    expect(screenSource).toContain('comparison.overlayEligible');
    expect(modelSource).toContain('STANDARD_ASPECT_RATIO = 3 / 4');
    expect(modelSource).toContain('OVERLAY_ASPECT_TOLERANCE');
  });

  it('shows date/source identity and keeps nearby facts separate from image evidence', () => {
    expect(screenSource).toContain("photo.source === 'camera'");
    expect(modelSource).toContain('PROGRESS_PHOTO_WEIGHT_EVIDENCE_WINDOW_DAYS = 7');
    expect(modelSource).toContain('PROGRESS_PHOTO_MEASUREMENT_EVIDENCE_WINDOW_DAYS = 14');
    expect(modelSource).toContain("resolved.canonicalUnit === 'cm'");
    expect(modelSource).not.toMatch(/body.?fat/i);
    expect(screenSource).not.toMatch(/vision|model estimate|body.?fat/i);
  });
});
