import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('LG-3A Settings secondary Liquid Glass controls', () => {
  it('uses the shared 44 pt glass back action in Settings', () => {
    const source = readSource('src/app/settings/index.tsx');

    expect(source).toContain('LiquidGlassIconButton');
    expect(source).toContain('Icon={ChevronLeft}');
    expect(source).toContain('onPress={() => router.back()}');
    expect(source).not.toContain('styles.backButton');
  });

  it('keeps SegmentedControl adaptive with explicit neutral and selected press states', () => {
    const source = readSource('src/components/ui/SegmentedControl.tsx');

    expect(source).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(source).toContain('backgroundColor: glass.controlFill');
    expect(source).toContain('borderColor: glass.controlBorder');
    expect(source).toContain('backgroundColor: glass.controlPressedFill');
    expect(source).toContain('backgroundColor: glass.accentFill');
    expect(source).toContain('backgroundColor: glass.accentPressedFill');
    expect(source).toContain('color: glass.accentText');
    expect(source).toContain('accessibilityRole="tablist"');
    expect(source).toContain('accessibilityRole="tab"');
    expect(source).toContain('accessibilityState={{ selected }}');
    expect(source).toContain('minHeight: 44');
    expect(source).not.toContain('colors.surfaceSecondary');
    expect(source).not.toContain('colors.surfacePrimary');
    expect(source).not.toContain('colors.backgroundSelected');
    expect(source).not.toContain('BlurView');
  });

  it('keeps Personal Details radio controls adaptive without changing their accessibility contract', () => {
    const source = readSource('src/features/settings/PersonalDetailsSettingsCard.tsx');

    expect(source).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(source).toContain('backgroundColor: glass.controlFill');
    expect(source).toContain('borderColor: glass.controlBorder');
    expect(source).toContain('backgroundColor: glass.controlPressedFill');
    expect(source).toContain('backgroundColor: glass.accentFill');
    expect(source).toContain('borderColor: glass.accentBorder');
    expect(source).toContain('backgroundColor: glass.accentPressedFill');
    expect(source).toContain('accessibilityRole="radio"');
    expect(source).toContain('accessibilityState={{ checked: selected }}');
    expect(source).toContain('minHeight: 46');
    expect(source).toContain('updatePersonalDetails({');
    expect(source).not.toContain('backgroundColor: colors.surfaceSecondary');
    expect(source).not.toContain('backgroundColor: colors.backgroundSelected');
    expect(source).not.toContain('pressed: { opacity:');
    expect(source).not.toContain('BlurView');
  });
});
