import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const media = readSource('src/features/exercises/components/ExerciseMediaPreview.tsx');
const muscleMap = readSource('src/features/exercises/components/MuscleMap.tsx');
const detailStyles = readSource('src/features/exercises/screens/ExerciseDetailScreen.styles.ts');

describe('Exercise media Liquid Glass contract', () => {
  it('uses active Liquid Glass materials for reusable media loading and placeholder frames', () => {
    expect(media).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(media).toContain('createStyles(colors, glass)');
    expect(media).toContain('backgroundColor: glass.controlFill');
    expect(media).toContain('borderColor: glass.controlBorder');
    expect(media).toContain('backgroundColor: glass.elevatedFill');
  });

  it('uses active Liquid Glass materials for muscle-map canvas and generated SVG surfaces', () => {
    expect(muscleMap).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(muscleMap).toContain('createSvgUri(side, highlights, colors, glass)');
    expect(muscleMap).toContain('const baseFill = glass.elevatedFill');
    expect(muscleMap).toContain('const stroke = glass.cardBorder');
    expect(muscleMap).toContain('fill="${glass.controlFill}"');
    expect(muscleMap).toContain('backgroundColor: glass.cardFill');
    expect(muscleMap).toContain('borderColor: glass.cardBorder');
  });

  it('prevents detail media surfaces from falling back to legacy direct fills', () => {
    for (const source of [media, muscleMap, detailStyles]) {
      expect(source).not.toContain('colors.surfaceSecondary');
    }
    expect(media).not.toContain('colors.borderSubtle');
    expect(muscleMap).not.toContain('colors.borderSubtle');
  });
});
