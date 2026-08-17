import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const guidelines = readFileSync(
  resolve(process.cwd(), 'src/features/social/screens/SocialCommunityGuidelinesScreen.tsx'),
  'utf8',
);

describe('Social residual Liquid Glass materials', () => {
  it('keeps community-guidelines emergency note on semantic warning glass', () => {
    expect(guidelines).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(guidelines).toContain('backgroundColor: glass.semanticWarningFill');
    expect(guidelines).toContain('borderColor: glass.semanticWarningBorder');
    expect(guidelines).not.toContain('colors.warningSoft');
  });
});
