import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const workoutsRoute = 'src/app/(tabs)/workouts.tsx';

describe('Workouts History floating material', () => {
  it('uses the shared elevated Liquid Glass material and a fill-based pressed state', () => {
    const source = readSource(workoutsRoute);

    expect(source).toContain('LiquidGlassSurface');
    expect(source).toContain('variant="elevated"');
    expect(source).toMatch(/<LiquidGlassSurface[\s\S]*?\bblur\b/);
    expect(source).toContain('backgroundColor: glass.controlPressedFill');
    expect(source).not.toContain('pressed && styles.pressed');
    expect(source).not.toContain('opacity: 0.68');
    expect(source).not.toContain('backgroundColor: colors.surfacePrimary');
  });

  it('preserves History routing, safe-area clearance and a 44 point interaction floor', () => {
    const source = readSource(workoutsRoute);

    expect(source).toContain("router.push('/workout-history')");
    expect(source).toContain('getFloatingTabBarBottomClearance(insets.bottom, Spacing.two)');
    expect(source).toContain("accessibilityRole=\"button\"");
    expect(source).toMatch(/historyButton:\s*\{[\s\S]*?minHeight: 44/);
    expect(source).toMatch(/historySurface:\s*\{[\s\S]*?minHeight: 44/);
  });
});
