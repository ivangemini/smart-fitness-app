import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const media = readSource('src/features/exercises/components/ExerciseMediaPreview.tsx');
const muscleMap = readSource('src/features/exercises/components/MuscleMap.tsx');
const bodyMuscleSvg = readSource('src/features/exercises/components/BodyMuscleSvg.tsx');
const detailStyles = readSource('src/features/exercises/screens/ExerciseDetailScreen.styles.ts');

describe('Exercise media Liquid Glass contract', () => {
  it('uses active Liquid Glass materials for reusable media loading and placeholder frames', () => {
    expect(media).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(media).toContain('createStyles(colors, glass)');
    expect(media).toContain('backgroundColor: glass.controlFill');
    expect(media).toContain('borderColor: glass.controlBorder');
    expect(media).toContain('backgroundColor: glass.elevatedFill');
  });

  it('uses active Liquid Glass materials for muscle-map canvas and shared SVG surfaces', () => {
    expect(muscleMap).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(muscleMap).toContain('BodyMuscleSvg');
    expect(muscleMap).toContain('backgroundColor: glass.cardFill');
    expect(muscleMap).toContain('borderColor: glass.cardBorder');
    expect(bodyMuscleSvg).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(bodyMuscleSvg).toContain('const baseFill = glass.elevatedFill');
    expect(bodyMuscleSvg).toContain('const stroke = glass.controlBorder');
    expect(muscleMap).not.toContain('data:image/svg+xml');
    expect(bodyMuscleSvg).not.toContain('data:image/svg+xml');
  });

  it('prevents detail and anatomy media surfaces from falling back to legacy direct fills', () => {
    for (const source of [media, muscleMap, bodyMuscleSvg, detailStyles]) {
      expect(source).not.toContain('colors.surfaceSecondary');
    }
    expect(media).not.toContain('colors.borderSubtle');
    expect(muscleMap).not.toContain('colors.borderSubtle');
    expect(bodyMuscleSvg).not.toContain('colors.borderSubtle');
  });
});