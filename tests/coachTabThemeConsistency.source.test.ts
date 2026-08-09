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

describe('Coach tab theme consistency', () => {
  it('resolves the public Coach shell from AppThemeProvider', () => {
    expect(coachSource).toContain('useAppTheme');
    expect(coachSource).toContain('createStyles(colors)');
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

  it('preserves floating-tab clearance and scroll growth', () => {
    expect(coachSource).toContain('getFloatingTabBarBottomClearance(safeAreaInsets.bottom)');
    expect(coachSource).toContain('flexGrow: 1');
  });
});
