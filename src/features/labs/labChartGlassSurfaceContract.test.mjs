import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Labs chart Liquid Glass source contract', () => {
  for (const path of [
    'src/features/labs/LabTrendChart.tsx',
    'src/features/labs/LabMultiTrendChart.tsx',
  ]) {
    it(`${path} uses palette-owned chart material`, () => {
      const source = read(path);
      expect(source).toContain('resolveLiquidGlassPalette');
      expect(source).toContain('backgroundColor: glass.controlFill');
      expect(source).toContain('borderColor: glass.controlBorder');
      expect(source).toContain('borderWidth: StyleSheet.hairlineWidth');
      expect(source).not.toContain('backgroundColor: colors.surfaceSecondary');
    });
  }
});
