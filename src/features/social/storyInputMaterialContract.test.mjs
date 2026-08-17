import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Story input material source contract', () => {
  it('reply input uses explicit disabled Liquid Glass material while sending', () => {
    const source = read('src/features/social/SocialStoryReplySurface.tsx');

    expect(source).toContain('backgroundColor: glass.disabledFill');
    expect(source).toContain('borderColor: glass.disabledBorder');
    expect(source).toContain('style={[styles.field, sending ? styles.fieldDisabled : null]}');
  });

  it('author caption input uses explicit disabled Liquid Glass material while media is busy', () => {
    const source = read('src/features/social/screens/SocialStoryAuthorScreen.tsx');

    expect(source).toContain('backgroundColor: glass.disabledFill');
    expect(source).toContain('borderColor: glass.disabledBorder');
    expect(source).toContain(
      'style={[styles.captionInput, busy ? styles.captionInputDisabled : null]}',
    );
  });
});
