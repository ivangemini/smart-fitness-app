import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Profile primary Liquid Glass surfaces', () => {
  it('uses the shared 44 pt glass icon control for Profile settings', () => {
    const source = readSource('src/app/(tabs)/profile.tsx');

    expect(source).toContain('LiquidGlassIconButton');
    expect(source).toContain('Icon={Settings}');
    expect(source).toContain("router.push('/settings')");
    expect(source).not.toContain('styles.settingsButton');
    expect(source).not.toContain('colors.surfacePrimary');
  });

  it('keeps the goals disclosure on adaptive control material without native blur', () => {
    const source = readSource('src/features/profile/ProfileGoalsSection.tsx');

    expect(source).toContain('LiquidGlassSurface');
    expect(source).toContain('variant="control"');
    expect(source).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(source).toContain('backgroundColor: glass.controlPressedFill');
    expect(source).not.toContain('colors.surfacePrimary');
    expect(source).not.toContain('colors.borderSubtle');
    expect(source).not.toContain('BlurView');
    expect(source).not.toContain('blur={true}');
  });

  it('keeps Social Profile entry on shared card/buttons and the active theme', () => {
    const source = readSource('src/features/social/SocialProfileEntryCard.tsx');

    expect(source).toContain('AppCard');
    expect(source).toContain('SecondaryButton');
    expect(source).toContain('useAppTheme');
    expect(source).toContain('color: colors.textPrimary');
    expect(source).toContain('color: colors.textSecondary');
    expect(source).not.toContain('Colors.dark');
  });
});
