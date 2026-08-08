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
  'src/features/social/screens/SocialFollowingFeedScreen.tsx',
  'src/features/social/screens/SocialProfileWorkoutPostsScreen.tsx',
  'src/features/social/screens/SocialWorkoutPostDetailScreen.tsx',
];

const styles = readSource(
  'src/features/social/screens/SocialWorkoutPostSurface.styles.ts',
);

describe('Social workout-post shell UX', () => {
  it.each(screens)('%s owns hidden-header top safe area and Lucide back language', (path) => {
    const source = readSource(path);

    expect(source).toContain("import { ChevronLeft } from 'lucide-react-native';");
    expect(source).toContain('paddingTop: insets.top + Spacing.four');
    expect(source).toContain(
      '<ChevronLeft color={colors.textPrimary} size={24} strokeWidth={2} />',
    );
    expect(source).not.toContain('styles.backLabel');
    expect(source).not.toContain('>‹</Text>');
  });

  it('keeps the shared shell free from fixed top spacing and raw back-label styling', () => {
    expect(styles).not.toContain('paddingTop: Spacing.four');
    expect(styles).not.toContain('backLabel:');
    expect(styles).toContain('flexGrow: 1');
  });

  it('gives comment report and delete actions 44 pt touch ownership', () => {
    expect(styles).toMatch(
      /commentDeleteButton:[\s\S]*?minHeight:\s*44[\s\S]*?commentDeleteLabel:/,
    );
    expect(styles).toMatch(
      /commentReportButton:[\s\S]*?minHeight:\s*44[\s\S]*?commentReportLabel:/,
    );
  });

  it('preserves feed, post-list and post-detail behavior boundaries', () => {
    const feed = readSource(
      'src/features/social/screens/SocialFollowingFeedScreen.tsx',
    );
    const profilePosts = readSource(
      'src/features/social/screens/SocialProfileWorkoutPostsScreen.tsx',
    );
    const detail = readSource(
      'src/features/social/screens/SocialWorkoutPostDetailScreen.tsx',
    );

    expect(feed).toContain('cacheStore.load(accountId)');
    expect(feed).toContain('socialApi.listFollowingFeed');
    expect(profilePosts).toContain('socialApi.listWorkoutPosts(username');
    expect(detail).toContain('socialApi.getWorkoutPost(postId)');
    expect(detail).toContain('socialApi.deleteWorkoutPost(postId)');
    expect(detail).toContain('<SocialWorkoutCommentsCard');
    expect(detail).toContain('<SocialReportModal');
  });
});
