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

describe('Story authoring source boundary', () => {
  it('reuses the managed media upload lifecycle for story_image', () => {
    const mediaApi = readSource('src/api/social/media-api.ts');
    const authoring = readSource('src/features/social/useSocialStoryAuthoring.ts');

    expect(mediaApi).toContain('createStoryImageUpload');
    expect(mediaApi).toContain('input.assetType !== "story_image"');
    expect(authoring).toContain('runManagedMediaUploadComposition');
    expect(authoring).toContain('api.createStoryImageUpload');
    expect(authoring).toContain('api.completeMediaUpload');
    expect(authoring).toContain('pollManagedMediaAsset');
    expect(authoring).not.toContain('fetch(');
    expect(authoring).not.toContain('XMLHttpRequest');
  });

  it('publishes only approved media and forces authoritative Home revalidation', () => {
    const model = readSource('src/features/social/socialStoryMediaModel.ts');
    const authoring = readSource('src/features/social/useSocialStoryAuthoring.ts');
    const stories = readSource('src/features/social/useSocialStories.ts');

    expect(model).toContain("asset.state === 'approved'");
    expect(model).toContain('expectedStateVersion: asset.stateVersion');
    expect(authoring).toContain('api.createStory({');
    expect(authoring).toContain('requestSocialStoryRefresh()');
    expect(stories).toContain('subscribeSocialStoryRefresh');
    expect(stories).toContain('loadFirstPage(true)');
  });

  it('keeps the Home entry and owner deletion on server-authoritative paths', () => {
    const home = readSource('src/app/(tabs)/index.tsx');
    const strip = readSource('src/features/social/SocialStoryStrip.tsx');
    const viewer = readSource('src/features/social/screens/SocialStoryViewerScreen.tsx');

    expect(home).toContain("router.push('/social/story/new')");
    expect(strip).toContain('testID="home-story-add"');
    expect(viewer).toContain('socialApi.getOwnProfile()');
    expect(viewer).toContain('ownProfile?.username === nextStory.author.username');
    expect(viewer).toContain('socialApi.deleteStory(storyId)');
    expect(viewer).toContain('requestSocialStoryRefresh()');
  });
});
