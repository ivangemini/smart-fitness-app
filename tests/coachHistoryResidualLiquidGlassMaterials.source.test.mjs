import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const history = readFileSync(
  resolve(process.cwd(), 'src/features/coach/screens/CoachRunHistoryScreen.tsx'),
  'utf8',
);
const applied = readFileSync(
  resolve(process.cwd(), 'src/features/coach/components/CoachAppliedChangeCard.tsx'),
  'utf8',
);

describe('Coach history residual Liquid Glass materials', () => {
  it('uses active control materials for history filters', () => {
    expect(history).toContain('backgroundColor: selected ? glass.semanticAccentFill : glass.controlFill');
    expect(history).toContain('borderColor: selected ? glass.accentBorder : glass.controlBorder');
    expect(history).toContain('backgroundColor: glass.controlPressedFill');
    expect(history).not.toMatch(/colors\.borderSubtle\b/);
  });

  it('uses card materials for nested applied-change surfaces while preserving divider semantics', () => {
    expect(applied).toContain('combinedRows: { backgroundColor: glass.cardFill, borderColor: glass.cardBorder');
    expect(applied).toContain('snapshot: { backgroundColor: glass.cardFill, borderColor: glass.cardBorder');
    expect(applied).toContain('changeBlock: { borderTopColor: colors.borderSubtle');
    expect(applied).toContain('setBlock: { borderTopColor: colors.borderSubtle');
  });
});
