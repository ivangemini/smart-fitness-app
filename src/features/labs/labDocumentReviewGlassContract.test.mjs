import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'src/app/labs-document/[documentId].tsx'),
  'utf8',
);

describe('Labs document review Liquid Glass contract', () => {
  it('keeps the collection-date input on palette-owned control material', () => {
    expect(source).toContain('resolveLiquidGlassPalette');
    expect(source).toContain('backgroundColor: glass.controlFill');
    expect(source).toContain('borderColor: glass.controlBorder');
    expect(source).toContain('borderWidth: StyleSheet.hairlineWidth');
    expect(source).not.toContain('backgroundColor: colors.surfaceSecondary');
  });
});
