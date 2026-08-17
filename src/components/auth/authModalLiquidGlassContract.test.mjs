import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const changePassword = readSource('src/components/auth/ChangePasswordModal.tsx');
const deleteAccount = readSource('src/components/auth/DeleteAccountModal.tsx');

describe('auth modal Liquid Glass source contract', () => {
  it('keeps Change Password on palette-owned sheet/input materials and freezes fields while busy', () => {
    expect(changePassword).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(changePassword).toContain('backgroundColor: glass.elevatedFill');
    expect(changePassword).toContain('borderColor: glass.cardBorder');
    expect(changePassword).toContain('backgroundColor: glass.controlFill');
    expect(changePassword).toContain('backgroundColor: glass.disabledFill');
    expect(changePassword).toContain('editable={!disabled}');
    expect(changePassword).toContain('accessibilityState={{ disabled }}');
    expect(changePassword).not.toContain('backgroundColor: colors.surfacePrimary');
    expect(changePassword).not.toContain('backgroundColor: colors.surfaceSecondary');
  });

  it('keeps Delete Account on palette-owned sheet/input materials with explicit busy input state', () => {
    expect(deleteAccount).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(deleteAccount).toContain('backgroundColor: glass.elevatedFill');
    expect(deleteAccount).toContain('borderColor: glass.cardBorder');
    expect(deleteAccount).toContain('backgroundColor: glass.controlFill');
    expect(deleteAccount).toContain('backgroundColor: glass.disabledFill');
    expect(deleteAccount).toContain('editable={!busy}');
    expect(deleteAccount).toContain('accessibilityState={{ disabled: busy }}');
    expect(deleteAccount).toContain('style={[styles.input, busy && styles.inputDisabled]}');
    expect(deleteAccount).not.toContain('backgroundColor: colors.surfacePrimary');
    expect(deleteAccount).not.toContain('backgroundColor: colors.surfaceSecondary');
  });
});
