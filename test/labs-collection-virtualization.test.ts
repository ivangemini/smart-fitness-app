import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Labs collection virtualization', () => {
  it('keeps trend marker selection on one FlatList boundary', () => {
    const source = readSource('src/app/labs-trends.tsx');

    expect(source).toContain('FlatList');
    expect(source).toContain('data={markers}');
    expect(source).toContain('keyExtractor={(marker) => marker.markerId}');
    expect(source).not.toContain('markers.map((marker)');
    expect(source).not.toContain('<ScrollView');
  });

  it('keeps comparison panel selection on one FlatList boundary', () => {
    const source = readSource('src/app/labs-compare-select.tsx');

    expect(source).toContain('FlatList');
    expect(source).toContain('data={panels}');
    expect(source).toContain('keyExtractor={(panel) => panel.id}');
    expect(source).not.toContain('panels.map((panel)');
    expect(source).not.toContain('<ScrollView');
  });

  it('keeps panel comparison results on one FlatList boundary', () => {
    const source = readSource('src/app/labs-compare.tsx');

    expect(source).toContain('FlatList');
    expect(source).toContain('data={items}');
    expect(source).toContain('keyExtractor={(item) => item.markerId}');
    expect(source).not.toContain('comparison.items.map((item)');
    expect(source).not.toContain('<ScrollView');
  });

  it('keeps document review drafts on one keyboard-aware FlatList boundary', () => {
    const source = readSource('src/app/labs-document/[documentId].tsx');

    expect(source).toContain('FlatList');
    expect(source).toContain('data={reviewResults}');
    expect(source).toContain('keyExtractor={(result) => result.id}');
    expect(source).toContain('automaticallyAdjustKeyboardInsets');
    expect(source).toContain('keyboardShouldPersistTaps="handled"');
    expect(source).not.toContain('results.map((result) => (');
    expect(source).not.toContain('<ScrollView');
  });
});
