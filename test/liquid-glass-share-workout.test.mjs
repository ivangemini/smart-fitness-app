import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('LG-3E Share Workout Liquid Glass material', () => {
  it('uses shared back navigation and resolves the active glass palette', () => {
    const source = readSource('src/features/social/screens/ShareWorkoutScreen.tsx');

    expect(source).toContain('LiquidGlassIconButton');
    expect(source).toContain('Icon={ChevronLeft}');
    expect(source).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(source).toContain('createShareWorkoutStyles(colors, glass)');
    expect(source).not.toContain('styles.backButton');
    expect(source).not.toContain('pressed && styles.pressed');
  });

  it('keeps caption, media, preview and progress material adaptive and blur-free', () => {
    const styles = readSource('src/features/social/screens/ShareWorkoutScreen.styles.ts');

    expect(styles).toContain('backgroundColor: glass.controlFill');
    expect(styles).toContain('borderColor: glass.controlBorder');
    expect(styles).toContain('borderCurve: "continuous"');
    expect(styles).not.toContain('colors.surfaceSecondary');
    expect(styles).not.toContain('colors.backgroundSelected');
    expect(styles).not.toContain('backButton:');
    expect(styles).not.toContain('pressed: { opacity:');
    expect(styles).not.toContain('BlurView');
  });

  it('preserves publishing, idempotency, managed-media and themed share-control contracts', () => {
    const source = readSource('src/features/social/screens/ShareWorkoutScreen.tsx');

    expect(source).toContain('socialApi.createWorkoutPost');
    expect(source).toContain('idempotencyKey: idempotencyKey.current');
    expect(source).toContain('await media.releaseAfterPublish()');
    expect(source).toContain('getSocialRateLimitMessage');
    expect(source).toContain('getShareWorkoutError');
    expect(source).toContain('ShareWorkoutMediaCard');
    expect(source).toContain(
      'thumbColor={Platform.OS === "android" ? colors.surfacePrimary : undefined}',
    );
    expect(source).toContain(
      'trackColor={{ false: colors.borderStrong, true: colors.accent }}',
    );
  });
});
