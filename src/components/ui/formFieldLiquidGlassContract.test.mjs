import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'src/components/ui/FormField.tsx'),
  'utf8',
);

describe('FormField Liquid Glass source contract', () => {
  it('uses palette-owned normal, focused and disabled materials', () => {
    expect(source).toContain('resolveLiquidGlassPalette');
    expect(source).toContain('backgroundColor: glass.controlFill');
    expect(source).toContain('borderColor: glass.controlBorder');
    expect(source).toContain('backgroundColor: glass.controlPressedFill');
    expect(source).toContain('backgroundColor: glass.disabledFill');
    expect(source).toContain('borderColor: glass.disabledBorder');
    expect(source).not.toContain('backgroundColor: colors.surfaceSecondary');
    expect(source).not.toContain('backgroundColor: colors.surfacePrimary');
  });

  it('exposes editable=false through accessibility state', () => {
    expect(source).toContain('const disabled = inputProps.editable === false;');
    expect(source).toContain('accessibilityState={{ ...accessibilityState, disabled }}');
  });
});
