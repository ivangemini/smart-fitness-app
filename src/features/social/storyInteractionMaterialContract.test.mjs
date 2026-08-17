import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Story interaction material source contract', () => {
  it('audience selector uses explicit Liquid Glass pressed and disabled materials', () => {
    const source = read('src/features/social/SocialStoryAudienceSelector.tsx');

    expect(source).toContain('backgroundColor: glass.controlPressedFill');
    expect(source).toContain('backgroundColor: glass.disabledFill');
    expect(source).toContain('borderColor: glass.disabledBorder');
    expect(source).toContain('backgroundColor: glass.semanticAccentFill');
    expect(source).not.toContain('pressed && !disabled ? { opacity:');
  });

  it('reaction choices use material fills for selected, pressed, and disabled states', () => {
    const source = read('src/features/social/SocialStoryReactionSurface.tsx');

    expect(source).toContain('backgroundColor: glass.controlPressedFill');
    expect(source).toContain('backgroundColor: glass.disabledFill');
    expect(source).toContain('borderColor: glass.disabledBorder');
    expect(source).toContain('backgroundColor: glass.semanticAccentFill');
    expect(source).toContain('pressed && !disabled ? styles.choicePressed : null');
    expect(source).not.toContain('choiceDisabled: { opacity:');
  });
});
