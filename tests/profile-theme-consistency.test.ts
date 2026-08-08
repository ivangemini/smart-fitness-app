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

const presentationFiles = [
  'src/app/(tabs)/profile.tsx',
  'src/features/profile/ProfileGoalsSection.tsx',
  'src/components/profile/ProfileGoalsCard.tsx',
] as const;

describe('Profile theme consistency', () => {
  it.each(presentationFiles)('%s uses the current app theme instead of Colors.dark', (path) => {
    const source = readSource(path);

    expect(source).toContain("useAppTheme");
    expect(source).not.toContain('Colors.dark');
  });

  it('keeps the Profile Settings icon bound to the current theme', () => {
    const source = readSource('src/app/(tabs)/profile.tsx');
    expect(source).toContain('<Settings color={colors.textPrimary}');
  });
});
