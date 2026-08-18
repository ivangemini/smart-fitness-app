import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const layout = readFileSync(resolve(process.cwd(), 'src/app/_layout.tsx'), 'utf8');
const listRow = readFileSync(resolve(process.cwd(), 'src/components/ui/ListRow.tsx'), 'utf8');

describe('shared shell residual Liquid Glass materials', () => {
  it('routes navigation chrome and shared badges through the active glass palette', () => {
    expect(layout).toContain('card: glass.cardFill');
    expect(layout).toContain('border: glass.cardBorder');
    expect(layout).toContain('headerStyle: { backgroundColor: glass.cardFill }');
    expect(listRow).toContain('backgroundColor: glass.semanticAccentFill');
    expect(listRow).toContain('borderColor: glass.accentBorder');
  });

  it('does not use the inventoried legacy shell/badge tokens', () => {
    expect(layout).not.toMatch(/colors\.(surfacePrimary|borderSubtle)\b/);
    expect(listRow).not.toMatch(/colors\.accentSoft\b/);
  });
});
