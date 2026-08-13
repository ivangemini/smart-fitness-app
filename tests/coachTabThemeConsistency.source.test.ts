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

const coachSource = readSource('src/app/(tabs)/coach.tsx');

describe('Coach route theme consistency', () => {
  it('resolves the Coach shell from AppThemeProvider', () => {
    expect(coachSource).toContain('useAppTheme');
    expect(coachSource).toContain('createStyles(colors)');
    expect(coachSource).toContain(
      'const createStyles = (colors: typeof Colors.light)',
    );
    expect(coachSource).not.toContain('Colors.dark.');
  });

  it('preserves all Coach action destinations and profile navigation', () => {
    for (const route of [
      '/profile/recovery-check-in',
      '/profile/limitations',
      '/profile/safety-recovery',
      '/profile/combined-review',
      '/profile/combined-proposal',
      '/(tabs)/profile',
    ]) {
      expect(coachSource).toContain(route);
    }
    expect(coachSource).toContain('COACH_ACTIONS.map');
    expect(coachSource).toContain('router.push(action.route)');
  });

  it('uses root-route safe-area clearance and scroll growth after leaving the tab bar', () => {
    expect(coachSource).toContain('safeAreaInsets.bottom + Spacing.eight');
    expect(coachSource).toContain('safeAreaInsets.top + Spacing.four');
    expect(coachSource).toContain('flexGrow: 1');
    expect(coachSource).not.toContain('getFloatingTabBarBottomClearance');
  });
});
