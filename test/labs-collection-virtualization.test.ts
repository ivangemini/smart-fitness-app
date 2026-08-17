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
});
