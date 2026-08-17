import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Settings dense row responsive source contract', () => {
  it('keeps performance diagnostics label and value shrinkable', () => {
    const source = read('src/features/settings/LocalPerformanceDiagnosticsCard.tsx');
    expect(source).toContain('flexShrink: 1');
    expect(source).toContain('minWidth: 0');
  });

  it('bounds support diagnostic values on compact widths', () => {
    const source = read('src/features/settings/SupportDiagnosticsCard.tsx');
    expect(source).toContain("maxWidth: '58%'");
    expect(source).toContain("alignItems: 'flex-start'");
  });

  it('keeps sync conflict version labels and values independently shrinkable', () => {
    const source = read('src/features/settings/SyncConflictReviewCard.tsx');
    expect(source).toContain("from '@/context/useSyncConflictResolution'");
    expect(source).toContain("maxWidth: '58%'");
    expect(source).toContain('versionLabel: {');
    expect(source).toContain('versionValue: {');
  });
});
