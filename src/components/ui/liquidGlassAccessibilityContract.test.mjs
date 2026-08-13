import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Liquid Glass accessibility contract', () => {
  it('subscribes to the reduce-transparency accessibility setting', () => {
    const source = read('src/hooks/useReduceTransparency.ts');
    expect(source).toContain('AccessibilityInfo.isReduceTransparencyEnabled()');
    expect(source).toContain("'reduceTransparencyChanged'");
  });

  it('disables blur while preserving the surface fallback', () => {
    const source = read('src/components/ui/LiquidGlassSurface.tsx');
    expect(source).toContain('useReduceTransparency');
    expect(source).toContain('const shouldBlur = blur && !reduceTransparency');
    expect(source).toContain('{shouldBlur ? (');
    expect(source).toContain('backgroundColor');
  });
});
