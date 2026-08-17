import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'src/features/progress/ProgressPlanningSections.tsx'),
  'utf8',
);

describe('Progress planning Liquid Glass source contract', () => {
  it('uses the active app theme rather than hard-coded dark colors', () => {
    expect(source).toContain('useAppTheme');
    expect(source).toContain('resolveLiquidGlassPalette');
    expect(source).not.toContain('Colors.dark.');
  });

  it('uses explicit Liquid Glass normal and pressed disclosure materials', () => {
    expect(source).toContain('backgroundColor: glass.controlFill');
    expect(source).toContain('borderColor: glass.controlBorder');
    expect(source).toContain('backgroundColor: glass.controlPressedFill');
    expect(source).not.toContain('opacity: 0.78');
  });

  it('keeps long planning copy shrinkable on compact widths', () => {
    expect(source).toContain("copy: { flex: 1, gap: 4, minWidth: 0 }");
    expect(source).toContain('flexShrink: 1');
  });
});
