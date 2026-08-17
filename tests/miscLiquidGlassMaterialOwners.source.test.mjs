import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const capability = read('src/capabilities/CapabilityStatusNotice.tsx');
const deleteAccount = read('src/components/auth/DeleteAccountModal.tsx');
const profileActions = read('src/components/profile/ProfileActionsCard.tsx');

describe('misc Liquid Glass material owners', () => {
  it('keeps capability notice material palette-owned', () => {
    expect(capability).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(capability).toContain('backgroundColor: glass.cardFill');
    expect(capability).toContain('borderColor: glass.cardBorder');
    expect(capability).not.toContain('colors.surfaceSecondary');
    expect(capability).not.toContain('colors.borderSubtle');
  });

  it('keeps destructive account warning material palette-owned', () => {
    expect(deleteAccount).toContain('backgroundColor: glass.destructiveFill');
    expect(deleteAccount).toContain('borderColor: glass.destructiveBorder');
    expect(deleteAccount).not.toContain('backgroundColor: colors.errorSoft');
  });

  it('keeps profile developer badge material palette-owned', () => {
    expect(profileActions).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(profileActions).toContain('backgroundColor: glass.semanticAccentFill');
    expect(profileActions).not.toContain('colors.backgroundSelected');
  });
});
