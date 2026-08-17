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

  it('keeps marker window and chart copy outside the route component', () => {
    const copy = read('src/features/labs/labMarkerCopy.ts');
    const screen = read('src/app/labs-marker/[markerId].tsx');

    expect(copy).toContain('historyWindowLabels');
    expect(copy).toContain('chartAccessibilityLabel:');
    expect(screen).toContain('getLabMarkerCopy(locale)');
    expect(screen).not.toContain("locale.toLowerCase().startsWith('ru')");
    expect(screen).not.toContain("'3 мес'");
    expect(screen).not.toContain('Confirmed points:');
  });

  it('formats visible lab result numbers through the locale formatter', () => {
    const marker = read('src/app/labs-marker/[markerId].tsx');
    const compare = read('src/app/labs-compare.tsx');
    const biomarkerCard = read('src/features/labs/LabBiomarkerCard.tsx');

    expect(marker).toContain('formatLocalizedNumber');
    expect(marker).toContain('formatLabNumber(latest.value, locale)');
    expect(marker).toContain('formatLabNumber(result.value, locale)');
    expect(compare).toContain('formatLocalizedNumber');
    expect(compare).toContain('formatLabValue(item.previous.value, item.previous.unit)');
    expect(compare).toContain('formatLabValue(item.current.value, item.current.unit)');
    expect(biomarkerCard).toContain('formatLocalizedNumber(');
    expect(biomarkerCard).toContain('const valueLabel =');
    expect(biomarkerCard).toContain('accessibilityLabel={`${name}, ${valueLabel}, ${statusLabel}`}');
  });
});
