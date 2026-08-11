import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { getSocialStoryCopy } from '@/features/social/socialStoryCopy';

const projectRoot = resolve(__dirname, '..');
const readSource = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), 'utf8');

describe('Story camera authoring source boundary', () => {
  it('captures only an image and reuses the existing managed Story pipeline', () => {
    const acquisition = readSource('src/features/social/socialStoryImage.ts');
    const authoring = readSource('src/features/social/useSocialStoryAuthoring.ts');

    expect(acquisition).toContain('requestCameraPermissionsAsync');
    expect(acquisition).toContain('launchCameraAsync');
    expect(acquisition).toContain("mediaTypes: ['images']");
    expect(acquisition).not.toContain('uploadSignedSocialMedia');
    expect(acquisition).not.toContain("mediaTypes: ['videos']");

    expect(authoring).toContain('captureSocialStoryImage');
    expect(authoring).toContain("source === 'camera'");
    expect(authoring).toContain('runManagedMediaUploadComposition');
    expect(authoring).toContain('api.createStoryImageUpload');
  });

  it('offers camera capture only on native surfaces', () => {
    const screen = readSource(
      'src/features/social/screens/SocialStoryAuthorScreen.tsx',
    );

    expect(screen).toContain("Platform.OS !== 'web'");
    expect(screen).toContain('label={copy.takePhoto}');
    expect(screen).toContain("authoring.chooseImage('camera')");
  });

  it('keeps camera and photo-library disclosures aligned without audio capture', () => {
    const appConfig = JSON.parse(readSource('app.json')) as {
      expo: { plugins: unknown[] };
    };
    const pluginEntries = appConfig.expo.plugins.filter(Array.isArray) as [
      string,
      Record<string, unknown>,
    ][];
    const imagePicker = pluginEntries.find(([name]) => name === 'expo-image-picker');
    const camera = pluginEntries.find(([name]) => name === 'expo-camera');

    expect(imagePicker?.[1].photosPermission).toContain('Stories');
    expect(imagePicker?.[1].cameraPermission).toBe(false);
    expect(imagePicker?.[1].microphonePermission).toBe(false);
    expect(camera?.[1].cameraPermission).toContain('Stories');
    expect(camera?.[1].recordAudioAndroid).toBe(false);
  });

  it('localizes the direct camera action and generic permission recovery', () => {
    const en = getSocialStoryCopy('en');
    const ru = getSocialStoryCopy('ru');

    expect(en.takePhoto).toBe('Take photo');
    expect(ru.takePhoto).toBe('Снять фото');
    expect(en.imagePermissionDenied).toContain('Camera');
    expect(ru.imagePermissionDenied).toContain('камере');
  });
});
