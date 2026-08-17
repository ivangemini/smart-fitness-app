import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Labs localization ownership contract', () => {
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

  it('keeps trend-chart accessibility copy in the canonical trend copy owner', () => {
    const copy = read('src/features/labs/labMultiTrendCopy.ts');
    const screen = read('src/app/labs-trends.tsx');

    expect(copy).toContain('chartAccessibilityLabel:');
    expect(copy).toContain('График нескольких показателей');
    expect(copy).toContain('Multi-biomarker trend chart');
    expect(screen).toContain('copy.chartAccessibilityLabel({');
    expect(screen).not.toContain("locale.toLowerCase().startsWith('ru')");
    expect(screen).not.toContain('График нескольких показателей');
    expect(screen).not.toContain('Multi-biomarker trend chart');
  });
});
