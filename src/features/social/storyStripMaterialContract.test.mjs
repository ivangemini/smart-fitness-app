import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Story strip material source contract', () => {
  it('uses explicit Liquid Glass pressed material instead of opacity-only feedback', () => {
    const source = read('src/features/social/SocialStoryStrip.tsx');

    expect(source).toContain('backgroundColor: glass.controlPressedFill');
    expect(source).toContain('pressed ? styles.addRingPressed : null');
    expect(source).toContain('pressed ? styles.ringPressed : null');
    expect(source).not.toContain('pressed: { opacity:');
  });

  it('preserves virtualized Story identity and viewed-state semantics', () => {
    const source = read('src/features/social/SocialStoryStrip.tsx');

    expect(source).toContain('<FlatList');
    expect(source).toContain('keyExtractor={(story) => story.id}');
    expect(source).toContain('item.viewed');
    expect(source).toContain('onOpen(item.id)');
  });
});
