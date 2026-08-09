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

const guidelinesScreen = readSource(
  'src/features/social/screens/SocialCommunityGuidelinesScreen.tsx',
);
const notificationScreen = readSource(
  'src/features/social/screens/SocialNotificationScreen.tsx',
);
const relationshipScreen = readSource(
  'src/features/social/screens/SocialRelationshipListsScreen.tsx',
);
const notificationStyles = readSource(
  'src/features/social/screens/SocialNotificationScreen.styles.ts',
);
const relationshipStyles = readSource(
  'src/features/social/screens/SocialRelationshipListsScreen.styles.ts',
);

describe('Social information and list shell UX', () => {
  it('keeps Guidelines on the existing Lucide language and hidden-header safe area', () => {
    expect(guidelinesScreen).toContain("import { ChevronLeft } from 'lucide-react-native';");
    expect(guidelinesScreen).toContain('paddingTop: insets.top + Spacing.four');
    expect(guidelinesScreen).toContain(
      '<ChevronLeft color={colors.textPrimary} size={24} strokeWidth={2} />',
    );
    expect(guidelinesScreen).not.toContain('>‹</Text>');
  });

  it.each([
    ['notification', notificationScreen],
    ['relationship-list', relationshipScreen],
  ])('keeps %s safe area and Lucide language through the shared back control', (_name, source) => {
    expect(source).toContain("import { ChevronLeft } from 'lucide-react-native';");
    expect(source).toContain('paddingTop: insets.top + Spacing.four');
    expect(source).toContain('LiquidGlassIconButton');
    expect(source).toContain('Icon={ChevronLeft}');
    expect(source).toContain('onPress={() => router.back()}');
    expect(source).not.toContain('styles.backButton');
    expect(source).not.toContain('>‹</Text>');
  });

  it('preserves notification navigation/read semantics', () => {
    expect(notificationScreen).toContain('markSocialNotificationReadOptimistically');
    expect(notificationScreen).toMatch(
      /socialApi\s*\.markNotificationRead\(notification\.id\)/,
    );
    expect(notificationScreen).toContain("pathname: '/social/[username]'");
    expect(notificationScreen).toContain("pathname: '/social/workout-post/[postId]'");
  });

  it('preserves relationship list actions and 44 pt tab ownership', () => {
    expect(relationshipScreen).toContain('SOCIAL_RELATIONSHIP_LIST_KINDS.map');
    expect(relationshipScreen).toContain('socialApi.approveFollowRequest(username)');
    expect(relationshipScreen).toContain('socialApi.rejectFollowRequest(username)');
    expect(relationshipScreen).toContain('socialApi.cancelFollowRequest(username)');
    expect(relationshipScreen).toContain('socialApi.unfollow(username)');
    expect(relationshipStyles).toContain('minHeight: 44');
  });

  it('keeps scroll and header copy resilient on the list surfaces', () => {
    for (const styles of [notificationStyles, relationshipStyles]) {
      expect(styles).toContain('flexGrow: 1');
      expect(styles).toContain('minWidth: 0');
      expect(styles).not.toContain('backLabel:');
    }
  });
});
