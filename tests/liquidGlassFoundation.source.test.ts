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

describe('Liquid Glass foundation', () => {
  it('centralizes adaptive glass tokens for light and dark appearance', () => {
    const source = readSource('src/theme/liquidGlass.ts');

    expect(source).toContain('const darkGlass');
    expect(source).toContain('const lightGlass');
    expect(source).toContain('resolveLiquidGlassPalette');
    expect(source).toContain("blurTint: 'systemMaterialDark'");
    expect(source).toContain("blurTint: 'systemMaterialLight'");
  });

  it('routes shared cards through the reusable glass surface', () => {
    const card = readSource('src/components/ui/AppCard.tsx');
    const surface = readSource('src/components/ui/LiquidGlassSurface.tsx');

    expect(card).toContain('LiquidGlassSurface');
    expect(card).not.toContain('Colors.dark.');
    expect(surface).toContain('resolveLiquidGlassPalette');
    expect(surface).toContain('blur = false');
    expect(surface).toContain('<BlurView');
  });

  it('keeps shared buttons theme-aware with explicit glass interaction states', () => {
    for (const relativePath of [
      'src/components/ui/PrimaryButton.tsx',
      'src/components/ui/SecondaryButton.tsx',
    ]) {
      const source = readSource(relativePath);

      expect(source).toContain('useAppTheme');
      expect(source).toContain('resolveLiquidGlassPalette');
      expect(source).not.toContain('Colors.dark.');
      expect(source).toContain('visuallyDisabled');
      expect(source).toContain('pressed && !state.disabled');
    }
  });

  it('keeps the floating tab bar as the true-blur reference implementation', () => {
    const source = readSource('src/components/navigation/LiquidGlassTabBar.tsx');

    expect(source).toContain('resolveLiquidGlassPalette');
    expect(source).toContain('<BlurView');
    expect(source).toContain('LiquidGeometry');
    expect(source).toContain('usePathInterpolation');
    expect(source).toContain('glass.navPanelFill');
    expect(source).toContain('glass.navBlobGradientStart');
    expect(source).not.toContain('tint="systemMaterialDark"');
  });
});
