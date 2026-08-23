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
const source = readFileSync(
  resolve(projectRoot, 'src/features/progress/progressShareCardModel.ts'),
  'utf8',
);
const packageJson = JSON.parse(
  readFileSync(resolve(projectRoot, 'package.json'), 'utf8'),
) as {
  dependencies?: Record<string, string>;
};

describe('Progress share-card S1 source contract', () => {
  it('stays a pure derived Progress model without navigation, state, API, or Social authority', () => {
    expect(source).not.toContain("from '@/context/");
    expect(source).not.toContain("from '@/api/");
    expect(source).not.toContain('expo-router');
    expect(source).not.toContain('/social/');
    expect(source).not.toContain('useAppActions');
    expect(source).not.toContain('AsyncStorage');
    expect(source).not.toContain('SecureStore');
    expect(source).not.toContain('Share.share');
    expect(source).not.toContain('publishSocial');
    expect(source).not.toContain('createSocial');
  });

  it('does not introduce native share/capture dependencies in S1', () => {
    expect(packageJson.dependencies?.['expo-sharing']).toBeUndefined();
    expect(packageJson.dependencies?.['react-native-view-shot']).toBeUndefined();
  });

  it('keeps private notes/photos and automatic publication explicitly excluded', () => {
    expect(source).toContain('includesNotes: false');
    expect(source).toContain('includesPhoto: false');
    expect(source).toContain('publishesAutomatically: false');
  });
});
