import { describe, expect, it } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as {
  readFileSync: (path: string, encoding: string) => string;
};
const { resolve } = require('path') as {
  resolve: (...parts: string[]) => string;
};

const projectRoot = resolve(__dirname, '..');
const readSource = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), 'utf8');

describe('Social secondary Liquid Glass states', () => {
  it('renders the profile lookup auth-hydration state inside the shared loading card', () => {
    const source = readSource('src/features/social/screens/SocialProfileLookupScreen.tsx');

    expect(source).toContain("import { LoadingState } from '@/components/ui/LoadingState';");
    expect(source).toContain('!ready ? (');
    expect(source).toContain('<LoadingState label={copy.loading} />');
    expect(source).toContain('ready && !isAuthenticated ? (');
    expect(source).toContain('ready && isAuthenticated ? (');
  });

  it('keeps relationship identity copy shrinkable on compact widths', () => {
    const source = readSource(
      'src/features/social/screens/SocialRelationshipListsScreen.styles.ts',
    );

    expect(source).toContain("identityCopy: { flex: 1, gap: Spacing.one, minWidth: 0 }");
    expect(source).toMatch(/displayName:\s*\{[\s\S]*?flexShrink: 1,[\s\S]*?minWidth: 0,/u);
    expect(source).toMatch(/username:\s*\{[\s\S]*?flexShrink: 1,[\s\S]*?minWidth: 0,/u);
    expect(source).toMatch(/visibility:\s*\{[\s\S]*?flexShrink: 1,[\s\S]*?minWidth: 0,/u);
  });

  it('does not describe share-workout hydration as an active publication', () => {
    const screen = readSource('src/features/social/screens/ShareWorkoutScreen.tsx');
    const copy = readSource('src/features/social/shareWorkoutCopy.ts');

    expect(screen).toContain('<LoadingState label={copy.loading} />');
    expect(screen).not.toContain('<LoadingState label={copy.publishing} />');
    expect(copy).toContain('loading: "Загрузка тренировки…"');
    expect(copy).toContain('loading: "Loading workout…"');
  });
});
