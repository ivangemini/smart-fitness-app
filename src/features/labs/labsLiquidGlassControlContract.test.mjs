import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Labs Liquid Glass control source contract', () => {
  it('uses material-state feedback for biomarker and document cards instead of opacity', () => {
    const biomarker = read('src/features/labs/LabBiomarkerCard.tsx');
    const document = read('src/features/labs/LabDocumentCard.tsx');

    for (const source of [biomarker, document]) {
      expect(source).toContain('resolveLiquidGlassPalette');
      expect(source).toContain('backgroundColor: glass.controlPressedFill');
      expect(source).not.toContain('pressed: { opacity:');
    }
  });

  it('uses explicit Liquid Glass normal, selected, and pressed states for history windows', () => {
    const source = read('src/features/labs/LabHistoryWindowSelector.tsx');

    expect(source).toContain('backgroundColor: glass.controlFill');
    expect(source).toContain('backgroundColor: glass.controlPressedFill');
    expect(source).toContain('backgroundColor: glass.semanticAccentFill');
    expect(source).toContain('borderColor: glass.accentBorder');
    expect(source).not.toContain('colors.surfacePrimary');
    expect(source).not.toContain('colors.surfaceSecondary');
  });

  it('locks review inputs and switches them to disabled material while a mutation is busy', () => {
    const source = read('src/features/labs/LabReviewResultCard.tsx');

    expect(source).toContain('editable={!disabled}');
    expect(source).toContain('accessibilityState={{ disabled }}');
    expect(source).toContain('disabled ? glass.disabledFill : glass.controlFill');
    expect(source).toContain('disabled ? glass.disabledBorder : glass.controlBorder');
    expect(source).toContain('disabled={busy}');
    expect(source).not.toContain('backgroundColor: colors.surfaceSecondary');
  });
});
