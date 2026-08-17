import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'src/features/coach/screens/UserLimitationFormFields.tsx'),
  'utf8',
);

describe('User limitation semantic Liquid Glass materials', () => {
  it('keeps choice and movement selector materials palette-owned', () => {
    expect(source).toContain('selected ? glass.semanticAccentFill : glass.controlFill');
    expect(source).toContain('selected ? glass.accentBorder : glass.controlBorder');
    expect(source).toContain('active ? glass.semanticAccentFill : glass.controlFill');
    expect(source).toContain('active ? glass.accentBorder : glass.controlBorder');
  });

  it('keeps limitation status and row border materials palette-owned', () => {
    expect(source).toContain("limitation.status === 'active'\n                  ? glass.semanticWarningFill\n                  : glass.semanticPositiveFill");
    expect(source).toContain('borderColor: glass.cardBorder');
  });

  it('removes legacy selector and status fills from this owner', () => {
    for (const token of [
      'colors.accentSoft',
      'colors.surfaceElevated',
      'colors.borderSubtle',
      'colors.warningSoft',
      'colors.successSoft',
    ]) {
      expect(source).not.toContain(token);
    }
  });
});
