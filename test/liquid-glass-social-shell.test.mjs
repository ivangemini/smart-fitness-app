import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('LG-3D Social shell Liquid Glass controls', () => {
  it('keeps Notifications on shared back navigation and adaptive card press material', () => {
    const screen = readSource('src/features/social/screens/SocialNotificationScreen.tsx');
    const styles = readSource('src/features/social/screens/SocialNotificationScreen.styles.ts');

    expect(screen).toContain('LiquidGlassIconButton');
    expect(screen).toContain('Icon={ChevronLeft}');
    expect(screen).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(screen).toContain('pressed && styles.notificationPressed');
    expect(screen).toContain('markSocialNotificationReadOptimistically');
    expect(screen).toMatch(/socialApi\s*\.markNotificationRead\(notification\.id\)/);
    expect(styles).toContain('backgroundColor: glass.cardFill');
    expect(styles).toContain('borderColor: glass.cardBorder');
    expect(styles).toContain('backgroundColor: glass.controlPressedFill');
    expect(styles).not.toContain('colors.backgroundSelected');
    expect(styles).not.toContain('pressed: { opacity:');
    expect(styles).not.toContain('BlurView');
  });

  it('keeps Profile Lookup on the shared back control without changing lookup semantics', () => {
    const source = readSource('src/features/social/screens/SocialProfileLookupScreen.tsx');

    expect(source).toContain('LiquidGlassIconButton');
    expect(source).toContain('Icon={ChevronLeft}');
    expect(source).toContain('onPress={() => router.back()}');
    expect(source).toContain('validateSocialLookupUsername');
    expect(source).toContain('normalizeSocialLookupUsername');
    expect(source).toContain("pathname: '/social/[username]'");
    expect(source).toContain("router.push('/auth/sign-in')");
    expect(source).not.toContain('styles.backButton');
    expect(source).not.toContain('pressed: { opacity:');
    expect(source).not.toContain('BlurView');
  });

  it('keeps Community Guidelines content intact while moving back navigation to the shared control', () => {
    const source = readSource('src/features/social/screens/SocialCommunityGuidelinesScreen.tsx');

    expect(source).toContain('LiquidGlassIconButton');
    expect(source).toContain('Icon={ChevronLeft}');
    expect(source).toContain("accessibilityLabel={t('common.back')}");
    expect(source).toContain('onPress={() => router.back()}');
    expect(source).toContain('copy.sections.map');
    expect(source).toContain('copy.emergencyNote');
    expect(source).toContain('<AppCard>');
    expect(source).not.toContain('styles.backButton');
    expect(source).not.toContain('pressed: { opacity:');
    expect(source).not.toContain('Pressable');
    expect(source).not.toContain('BlurView');
  });

  it('keeps Social Profile Editor validation and save flow on the shared back control', () => {
    const source = readSource('src/features/social/screens/SocialProfileEditorScreen.tsx');

    expect(source).toContain('LiquidGlassIconButton');
    expect(source).toContain('Icon={ChevronLeft}');
    expect(source).toContain('onPress={() => router.back()}');
    expect(source).toContain('validateSocialProfileForm(values)');
    expect(source).toContain('buildSocialProfileInput(values)');
    expect(source).toContain('socialApi.upsertOwnProfile');
    expect(source).toContain('automaticallyAdjustKeyboardInsets');
    expect(source).not.toContain('styles.backButton');
    expect(source).not.toContain('backButton:');
    expect(source).not.toContain('Pressable');
    expect(source).not.toContain('pressed: { opacity:');
    expect(source).not.toContain('BlurView');
  });

  it('keeps workout-post feed/list/detail shells on shared glass backs without changing domain ownership', () => {
    const feed = readSource('src/features/social/screens/SocialFollowingFeedScreen.tsx');
    const profilePosts = readSource(
      'src/features/social/screens/SocialProfileWorkoutPostsScreen.tsx',
    );
    const detail = readSource('src/features/social/screens/SocialWorkoutPostDetailScreen.tsx');
    const comments = readSource('src/features/social/SocialWorkoutCommentsCard.tsx');
    const styles = readSource('src/features/social/screens/SocialWorkoutPostSurface.styles.ts');

    for (const source of [feed, profilePosts, detail]) {
      expect(source).toContain('LiquidGlassIconButton');
      expect(source).toContain('Icon={ChevronLeft}');
      expect(source).toContain('onPress={() => router.back()}');
      expect(source).not.toContain('styles.backButton');
      expect(source).not.toContain('BlurView');
    }

    expect(feed).toContain('useSocialFollowingFeed()');
    expect(profilePosts).toContain('socialApi.listWorkoutPosts(username');
    expect(detail).toContain('socialApi.getWorkoutPost(postId)');
    expect(detail).toContain('socialApi.deleteWorkoutPost(postId)');
    expect(detail).toContain('useSocialWorkoutComments({');
    expect(detail).toContain('<SocialWorkoutCommentsHeader');
    expect(detail).toContain('<SocialWorkoutCommentRow');
    expect(detail).toContain('<SocialWorkoutCommentsControls');
    expect(comments).toContain('socialApi.listWorkoutPostComments(postId');
    expect(comments).toContain('socialApi.createWorkoutPostComment(postId, pending)');
    expect(comments).toContain('socialApi.deleteWorkoutPostComment(postId, commentId)');
    expect(detail).toContain('<SocialReportModal');
    expect(styles).not.toContain('backButton:');
    expect(styles).toContain('pressed: { opacity: 0.72 }');
    expect(styles).not.toContain('BlurView');
  });
});
