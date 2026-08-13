import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const screens = [
  'src/app/(tabs)/labs.tsx',
  'src/app/labs-document/[documentId].tsx',
  'src/app/labs-marker/[markerId].tsx',
  'src/app/labs-compare.tsx',
  'src/app/labs-compare-select.tsx',
  'src/app/labs-trends.tsx',
] as const;

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Labs responsive source contract', () => {
  it.each(screens)('%s uses a scrolling flex-grow content surface', (path) => {
    const source = read(path);
    expect(source).toContain('ScrollView');
    expect(source).toMatch(/flexGrow:\s*1/u);
  });

  it.each(screens)('%s avoids absolute positioning for primary layout', (path) => {
    const source = read(path);
    expect(source).not.toMatch(/position:\s*['"]absolute['"]/u);
  });

  it.each(screens)('%s avoids fixed screen/card heights', (path) => {
    const source = read(path);
    expect(source).not.toMatch(/\bheight:\s*\d+/u);
  });

  it.each(screens)('%s explicitly consumes top safe-area insets', (path) => {
    const source = read(path);
    expect(source).toContain('useSafeAreaInsets');
    expect(source).toMatch(/insets\.top/u);
  });

  it.each(screens.filter((path) => path !== 'src/app/(tabs)/labs.tsx'))(
    '%s explicitly consumes bottom safe-area insets',
    (path) => {
      const source = read(path);
      expect(source).toMatch(/insets\.bottom/u);
    },
  );

  it('the primary tab delegates bottom clearance to the floating-tab layout helper', () => {
    const source = read('src/app/(tabs)/labs.tsx');
    expect(source).toContain('getFloatingTabBarBottomClearance(insets.bottom)');
  });

  it('comparison columns can wrap for large Dynamic Type', () => {
    const source = read('src/app/labs-compare.tsx');
    expect(source).toMatch(/dateRow:\s*\{[^}]*flexWrap:\s*['"]wrap['"]/u);
    expect(source).toMatch(/valueRow:\s*\{[^}]*flexWrap:\s*['"]wrap['"]/u);
  });
});
