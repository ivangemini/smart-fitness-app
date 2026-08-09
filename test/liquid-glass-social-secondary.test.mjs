import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('LG-3C Social interaction Liquid Glass controls', () => {
  it('keeps report reasons on adaptive neutral/selected material with explicit pressed states', () => {
    const source = readSource('src/features/social/SocialReportModal.tsx');

    expect(source).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(source).toContain('backgroundColor: glass.elevatedFill');
    expect(source).toContain('backgroundColor: glass.controlFill');
    expect(source).toContain('borderColor: glass.controlBorder');
    expect(source).toContain('backgroundColor: glass.controlPressedFill');
    expect(source).toContain('backgroundColor: glass.accentFill');
    expect(source).toContain('borderColor: glass.accentBorder');
    expect(source).toContain('backgroundColor: glass.accentPressedFill');
    expect(source).toContain('color: glass.accentText');
    expect(source).toContain('accessibilityRole="radio"');
    expect(source).toContain('accessibilityState={{ checked: selected }}');
    expect(source).toContain('SOCIAL_REPORT_REASON_CODES.map');
    expect(source).not.toContain('colors.surfacePrimary');
    expect(source).not.toContain('colors.surfaceSecondary');
    expect(source).not.toContain('colors.accentSoft');
    expect(source).not.toContain('pressed: { opacity:');
    expect(source).not.toContain('BlurView');
  });

  it('keeps relationship tabs adaptive and the back action shared', () => {
    const screen = readSource('src/features/social/screens/SocialRelationshipListsScreen.tsx');
    const styles = readSource('src/features/social/screens/SocialRelationshipListsScreen.styles.ts');

    expect(screen).toContain('LiquidGlassIconButton');
    expect(screen).toContain('Icon={ChevronLeft}');
    expect(screen).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(screen).toContain('accessibilityRole="tab"');
    expect(screen).toContain('accessibilityState={{ selected: active }}');
    expect(screen).toContain('active ? styles.tabActivePressed : styles.tabPressed');
    expect(styles).toContain('backgroundColor: glass.controlFill');
    expect(styles).toContain('borderColor: glass.controlBorder');
    expect(styles).toContain('backgroundColor: glass.controlPressedFill');
    expect(styles).toContain('backgroundColor: glass.accentFill');
    expect(styles).toContain('borderColor: glass.accentBorder');
    expect(styles).toContain('backgroundColor: glass.accentPressedFill');
    expect(styles).toContain('color: glass.accentText');
    expect(styles).toContain('minHeight: 44');
    expect(styles).not.toContain('backgroundColor: colors.backgroundSelected');
    expect(styles).not.toContain('styles.backButton');
    expect(styles).not.toContain('BlurView');
  });

  it('keeps relationship cards on AppCard and opacity feedback limited to the profile link', () => {
    const card = readSource('src/features/social/SocialRelationshipListCard.tsx');
    const styles = readSource('src/features/social/screens/SocialRelationshipListsScreen.styles.ts');

    expect(card).toContain('AppCard');
    expect(card).toContain('pressed && styles.profilePressed');
    expect(styles).toContain('profilePressed: { opacity: 0.72 }');
    expect(styles).toContain('backgroundColor: glass.controlFill');
    expect(styles).toContain('borderColor: glass.controlBorder');
    expect(styles).not.toContain('pressed: { opacity:');
  });
});
