import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'src/features/coach/screens/SafetyRecoveryPreflightScreen.tsx'),
  'utf8',
);

describe('Safety recovery readiness Liquid Glass badge contract', () => {
  it('keeps readiness states on semantic glass fills', () => {
    expect(source).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(source).toContain('backgroundColor: glass.semanticWarningFill');
    expect(source).toContain('backgroundColor: glass.semanticPositiveFill');
  });

  it('does not fall back to legacy soft readiness fills', () => {
    expect(source).not.toContain('colors.warningSoft');
    expect(source).not.toContain('colors.successSoft');
  });
});
