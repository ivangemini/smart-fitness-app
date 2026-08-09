import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Home Stories server-authoritative shell', () => {
  it('places Stories between daily metrics and Following without coupling feed ownership', () => {
    const home = readSource('src/app/(tabs)/index.tsx');
    const metricsIndex = home.indexOf('<HomeDailyMetricsPanel');
    const storiesIndex = home.indexOf('<SocialStoryStrip');
    const followingIndex = home.indexOf('<View style={styles.feedHeader}>');

    expect(metricsIndex).toBeGreaterThan(-1);
    expect(storiesIndex).toBeGreaterThan(metricsIndex);
    expect(followingIndex).toBeGreaterThan(storiesIndex);
    expect(home).toContain('const stories = useSocialStories();');
    expect(home).toContain("pathname: '/social/story/[storyId]'");
    expect(home).toContain('stories.markViewed(storyId)');
    expect(home).toContain('stories.loadFirstPage(true)');
    expect(home).toContain('feed.loadFirstPage(true)');
  });

  it('keeps the Story strip adaptive without repeated native blur material', () => {
    const strip = readSource('src/features/social/SocialStoryStrip.tsx');

    expect(strip).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(strip).toContain('item.viewed');
    expect(strip).toContain('glass.controlBorder');
    expect(strip).toContain('colors.accent');
    expect(strip).toContain('onEndReached={onLoadMore}');
    expect(strip).not.toContain('BlurView');
    expect(strip).not.toContain('position: \'absolute\'');
  });

  it('keeps the viewer safe-area and content-driven with shared glass close navigation', () => {
    const viewer = readSource(
      'src/features/social/screens/SocialStoryViewerScreen.tsx',
    );

    expect(viewer).toContain('useSafeAreaInsets()');
    expect(viewer).toContain('contentContainerStyle');
    expect(viewer).toContain('flexGrow: 1');
    expect(viewer).toContain('LiquidGlassIconButton');
    expect(viewer).toContain('Icon={X}');
    expect(viewer).toContain('aspectRatio: story.image.aspectRatio');
    expect(viewer).toContain('socialApi.getStory(storyId)');
    expect(viewer).toContain('socialApi.markStoryViewed(storyId)');
    expect(viewer).not.toContain('BlurView');
    expect(viewer).not.toContain('position: \'absolute\'');
    expect(viewer).not.toContain('minHeight: 320');
  });
});
