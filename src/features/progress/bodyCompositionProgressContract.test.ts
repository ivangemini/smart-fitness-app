import { describe, expect, it } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('node:fs') as {
  readFileSync(path: string, encoding: string): string;
};
const { resolve } = require('node:path') as {
  resolve(...parts: string[]): string;
};

describe('body composition progress source contract', () => {
  const featureDir = resolve(__dirname);
  const screenSource = readFileSync(resolve(featureDir, 'BodyCompositionProgressScreen.tsx'), 'utf8');
  const modelSource = readFileSync(resolve(featureDir, 'bodyCompositionProgress.ts'), 'utf8');
  const copySource = readFileSync(resolve(featureDir, 'bodyCompositionProgressCopy.ts'), 'utf8');

  it('composes existing progress authorities instead of introducing a second analytics engine', () => {
    expect(modelSource).toContain('getWeightAnalytics');
    expect(modelSource).toContain('getWeightTrendEntries');
    expect(modelSource).toContain('buildBodyMeasurementProgressAnalytics');
    expect(screenSource).toContain('ProgressTrendChart');
    expect(screenSource).toContain('progressPhotoRepository.list');
    expect(screenSource).toContain('buildBodyCompositionProgress');
  });

  it('keeps the surface read-only and private-photo aware', () => {
    expect(screenSource).not.toContain('progressPhotoRepository.add');
    expect(screenSource).not.toContain('progressPhotoRepository.remove');
    expect(screenSource).not.toContain('ImagePicker');
    expect(screenSource).not.toMatch(/upload|apiClient|fetch\(/);
  });

  it('uses explicit bounded time and never invents photo-derived body-fat precision', () => {
    expect(modelSource).toContain('endAt: string');
    expect(modelSource).toContain('value >= startTimestamp && value <= endTimestamp');
    expect(modelSource).not.toContain('bodyFatEstimate');
    expect(screenSource).not.toContain('bodyFatEstimate');
    expect(copySource).toContain('not inferred from photos');
    expect(copySource).toContain('does not estimate body-fat percentage from images');
  });
});
