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

describe('social-first Home', () => {
  it('uses one expandable personal metrics owner before Stories and the existing following feed', () => {
    const home = readSource('src/app/(tabs)/index.tsx');

    const metricsIndex = home.indexOf('<HomeDailyMetricsPanel');
    const storiesIndex = home.indexOf('<SocialStoryStrip');
    const feedIndex = home.indexOf('<FlatList<SocialWorkoutPostDto>');
    expect(metricsIndex).toBeGreaterThan(-1);
    expect(storiesIndex).toBeGreaterThan(metricsIndex);
    expect(feedIndex).toBeGreaterThan(storiesIndex);
    expect(home).toContain('useSocialStories()');
    expect(home).toContain('useSocialFollowingFeed()');
    expect(home).toContain('<SocialWorkoutPostCard');
    expect(home).not.toContain('<HomeSummaryCard');
    expect(home).not.toContain('<QuickActionsCard');
    expect(home).not.toContain('<HomeSnapshotCard');
  });

  it('uses real program schedule state and does not fabricate steps or Story data', () => {
    const home = readSource('src/app/(tabs)/index.tsx');
    const storyHook = readSource('src/features/social/useSocialStories.ts');

    expect(home).toContain('getWorkoutProgramSchedule(currentProgram)');
    expect(home).toContain('programSchedule?.isRestDayToday');
    expect(home).toContain('stepsValue="—"');
    expect(home).not.toMatch(/stepsValue="\d/);
    expect(home).toContain('stories.stories');
    expect(storyHook).toContain('socialApi.listStories({ limit: PAGE_SIZE })');
    expect(storyHook).toContain('getDefaultSocialStoryCacheStore()');
    expect(home).not.toContain('demoStories');
    expect(home).not.toContain('mockStories');
  });

  it('keeps metrics expansion local, accessible and non-persisted', () => {
    const metrics = readSource('src/components/home/HomeDailyMetricsPanel.tsx');

    expect(metrics).toContain('const [expanded, setExpanded] = useState(false)');
    expect(metrics).toContain('accessibilityState={{ expanded }}');
    expect(metrics).toContain('LayoutAnimation.configureNext');
    expect(metrics).toContain('minHeight: 44');
    expect(metrics).not.toContain('AsyncStorage');
  });

  it('reuses the existing account-scoped feed cache and server pagination', () => {
    const feed = readSource('src/features/social/useSocialFollowingFeed.ts');
    const standalone = readSource(
      'src/features/social/screens/SocialFollowingFeedScreen.tsx',
    );

    expect(feed).toContain('getDefaultSocialFollowingFeedCacheStore()');
    expect(feed).toContain('socialApi.listFollowingFeed({ limit: PAGE_SIZE })');
    expect(feed).toContain('PAGE_SIZE = 20');
    expect(feed).toContain('mergeSocialWorkoutPosts');
    expect(standalone).toContain('useSocialFollowingFeed()');
  });
});
