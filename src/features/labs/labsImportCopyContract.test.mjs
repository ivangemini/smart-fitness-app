import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Labs import availability localization contract', () => {
  it('keeps import-disabled copy in the canonical Labs copy owner', () => {
    const copy = read('src/features/labs/labsCopy.ts');
    expect(copy).toContain('importUnavailable:');
    expect(copy).toContain('Импорт пока выключен');
    expect(copy).toContain('Import is currently disabled');
  });

  it('keeps the Labs tab free of locale-specific import-disabled strings', () => {
    const screen = read('src/app/(tabs)/labs.tsx');
    expect(screen).toContain('copy.importUnavailable');
    expect(screen).not.toContain('const importUnavailableText');
    expect(screen).not.toContain('Импорт пока выключен');
    expect(screen).not.toContain('Import is currently disabled');
  });
});
