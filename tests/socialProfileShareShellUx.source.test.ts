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
const readSource = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), 'utf8');

const publicProfile = readSource(
  'src/features/social/screens/SocialPublicProfileScreen.tsx',
);
const publicProfileStyles = readSource(
  'src/features/social/screens/SocialPublicProfileScreen.styles.ts',
);
const profileEditor = readSource(
  'src/features/social/screens/SocialProfileEditorScreen.tsx',
);
const shareWorkout = readSource(
  'src/features/social/screens/ShareWorkoutScreen.tsx',
);
const shareWorkoutStyles = readSource(
  'src/features/social/screens/ShareWorkoutScreen.styles.ts',
);

describe('Social profile and share shell UX', () => {
  it.each([
    ['public profile', publicProfile, 'paddingTop: insets.top + Spacing.four'],
    ['profile editor', profileEditor, 'paddingTop: insets.top + Spacing.four'],
    ['share workout', shareWorkout, 'paddingTop: insets.top + Spacing.three'],
  ])('%s owns runtime top safe area and Lucide back language', (_name, source, topInset) => {
    expect(source).toContain('ChevronLeft');
    expect(source).toContain(topInset);
    expect(source).toContain('router.back()');
    expect(source).not.toContain('styles.backLabel');
    expect(source).not.toContain('>‹</Text>');
  });

  it('keeps public profile reflow resilient and relationship behavior intact', () => {
    expect(publicProfileStyles).toContain('flexGrow: 1');
    expect(publicProfileStyles).toContain('minWidth: 0');
    expect(publicProfileStyles).not.toContain('paddingTop: Spacing.four');
    expect(publicProfileStyles).not.toContain('backLabel:');
    expect(publicProfile).toContain('socialApi.follow(username)');
    expect(publicProfile).toContain('socialApi.unfollow(username)');
    expect(publicProfile).toContain('socialApi.block(username)');
    expect(publicProfile).toContain('socialApi.unblock(username)');
    expect(publicProfile).toContain('<SocialReportModal');
  });

  it('keeps profile-editor validation, keyboard reachability and save behavior intact on the shared back control', () => {
    expect(profileEditor).toContain('automaticallyAdjustKeyboardInsets');
    expect(profileEditor).toContain('LiquidGlassIconButton');
    expect(profileEditor).toContain('Icon={ChevronLeft}');
    expect(profileEditor).toContain('onPress={() => router.back()}');
    expect(profileEditor).not.toContain('styles.backButton');
    expect(profileEditor).not.toContain('backButton:');
    expect(profileEditor).toContain('validateSocialProfileForm(values)');
    expect(profileEditor).toContain('buildSocialProfileInput(values)');
    expect(profileEditor).toContain('socialApi.upsertOwnProfile');
    expect(profileEditor).not.toContain('backLabel:');
    expect(profileEditor).not.toContain('paddingTop: Spacing.four');
  });

  it('uses the shared 44 pt glass back action while preserving Share Workout publish contracts', () => {
    expect(shareWorkout).toContain('LiquidGlassIconButton');
    expect(shareWorkout).toContain('Icon={ChevronLeft}');
    expect(shareWorkout).toContain('onPress={() => router.back()}');
    expect(shareWorkout).not.toContain('styles.backButton');
    expect(shareWorkoutStyles).not.toContain('backButton:');
    expect(shareWorkoutStyles).not.toContain('backLabel:');
    expect(shareWorkoutStyles).not.toContain('paddingTop: Spacing.three');
    expect(shareWorkout).toContain('await syncNow()');
    expect(shareWorkout).toContain('socialApi.createWorkoutPost');
    expect(shareWorkout).toContain('idempotencyKey: idempotencyKey.current');
    expect(shareWorkout).toContain('await media.releaseAfterPublish()');
  });
});
