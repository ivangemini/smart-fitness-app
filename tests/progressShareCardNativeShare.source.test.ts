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
const shareModal = readFileSync(
  resolve(projectRoot, 'src/components/progress/ProgressShareCardShareModal.tsx'),
  'utf8',
);
const weeklySection = readFileSync(
  resolve(projectRoot, 'src/features/progress/WeeklyTrainingReviewSection.tsx'),
  'utf8',
);

describe('Progress share-card S3 authority boundary', () => {
  it('captures locally only after explicit share action', () => {
    expect(shareModal).toContain("makeImageFromView(cardRef)");
    expect(shareModal).toContain('collapsable={false}');
    expect(shareModal).toContain('onPress={() => void shareCard()}');
    expect(shareModal).toContain("Platform.OS === 'ios'");
    expect(shareModal).toContain('ActionSheetIOS.showShareActionSheetWithOptions');
    expect(shareModal).toContain('Share.share');
  });

  it('does not add upload, persistence, Social publication, or a second capture dependency', () => {
    expect(shareModal).not.toContain("from '@/api/");
    expect(shareModal).not.toContain("from '@/context/");
    expect(shareModal).not.toContain('/social/');
    expect(shareModal).not.toContain('AsyncStorage');
    expect(shareModal).not.toContain('SecureStore');
    expect(shareModal).not.toContain('fetch(');
    expect(shareModal).not.toContain('expo-sharing');
    expect(shareModal).not.toContain('react-native-view-shot');
  });

  it('reuses the deterministic S1 weekly card and fails closed when it is unavailable', () => {
    expect(weeklySection).toContain('buildWeeklyReviewShareCard(review)');
    expect(weeklySection).toContain("shareResult.status === 'ready' ? shareResult.card : null");
    expect(weeklySection).toContain('{shareCard ? (');
    expect(weeklySection).toContain('onPress={() => setShareOpen(true)}');
    expect(weeklySection).toContain('<ProgressShareCardShareModal');
  });
});
