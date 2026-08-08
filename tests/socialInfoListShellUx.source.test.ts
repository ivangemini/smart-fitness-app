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

const screens = [
  'src/features/social/screens/SocialCommunityGuidelinesScreen.tsx',
  'src/features/social/screens/SocialNotificationScreen.tsx',
  'src/features/social/screens/SocialRelationshipListsScreen.tsx',
];

const notificationStyles = readSource(
  'src/features/social/screens/SocialNotificationScreen.styles.ts',
);
const relationshipStyles = readSource(
  'src/features/social/screens/SocialRelationshipListsScreen.styles.ts',
);

describe('Social information and list shell UX', () => {
  it.each(screens)('%s owns hidden-header top safe area and Lucide back language', (path) => {
    const source = readSource(path);

    expect(source).toContain("import { ChevronLeft } from 'lucide-react-native';");
    expect(source).toContain('paddingTop: insets.top + Spacing.four');
    expect(source).toContain(
      '<ChevronLeft color={colors.textPrimary} size={24} strokeWidth={2} />',
    );
    expect(source).not.toContain('>‹</Text>');
  });

  it('preserves notification navigation/read semantics', () => {
    const source = readSource('src/features/social/screens/SocialNotificationScreen.tsx');

    expect(source).toContain('markSocialNotificationReadOptimistically');
    expect(source).toMatch(
      /socialApi\s*\.markNotificationRead\(notification\.id\)/,
    );
    expect(source).toContain("pathname: '/social/[username]'");
    expect(source).toContain("pathname: '/social/workout-post/[postId]'");
  });

  it('preserves relationship list actions and 44 pt tab ownership', () => {
    const source = readSource('src/features/social/screens/SocialRelationshipListsScreen.tsx');

    expect(source).toContain('SOCIAL_RELATIONSHIP_LIST_KINDS.map');
    expect(source).toContain('socialApi.approveFollowRequest(username)');
    expect(source).toContain('socialApi.rejectFollowRequest(username)');
    expect(source).toContain('socialApi.cancelFollowRequest(username)');
    expect(source).toContain('socialApi.unfollow(username)');
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
