import { describe, expect, it } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as {
  readFileSync(path: string, encoding: string): string;
};
const { resolve } = require('path') as {
  resolve(...parts: string[]): string;
};

const projectRoot = resolve(__dirname, '..');
const renderer = readFileSync(
  resolve(projectRoot, 'src/components/progress/ProgressShareCardRenderer.tsx'),
  'utf8',
);
const presentation = readFileSync(
  resolve(projectRoot, 'src/features/progress/progressShareCardPresentation.ts'),
  'utf8',
);

describe('Progress share-card S2 authority boundary', () => {
  it('keeps the renderer presentation-only', () => {
    expect(renderer).not.toContain("from '@/api/");
    expect(renderer).not.toContain("from '@/context/");
    expect(renderer).not.toContain('/social/');
    expect(renderer).not.toContain('expo-router');
    expect(renderer).not.toContain('AsyncStorage');
    expect(renderer).not.toContain('SecureStore');
    expect(renderer).not.toContain('Share.share');
    expect(renderer).not.toContain('expo-sharing');
    expect(renderer).not.toContain('react-native-view-shot');
    expect(renderer).not.toContain('LiquidGlass');
  });

  it('formats only the S1 view model instead of rebuilding analytics', () => {
    expect(presentation).toContain("from './progressShareCardModel'");
    expect(presentation).not.toContain('trainingIntelligence');
    expect(presentation).not.toContain('weeklyTrainingReview');
    expect(presentation).not.toContain('WorkoutSession');
    expect(presentation).not.toContain('WeightEntry');
    expect(presentation).not.toContain('BodyMeasurement');
    expect(presentation).not.toContain("from '@/api/");
    expect(presentation).not.toContain("from '@/context/");
    expect(presentation).not.toContain('/social/');
  });

  it('does not introduce image/photo or publication behavior in S2', () => {
    expect(renderer).not.toContain('<Image');
    expect(renderer).not.toContain('photoUri');
    expect(renderer).not.toContain('publish');
    expect(presentation).not.toContain('photoUri');
    expect(presentation).not.toContain('publish');
  });
});
