import { describe, expect, it } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as {
  readFileSync(path: string, encoding: string): string;
};
const { resolve } = require('path') as {
  resolve(...parts: string[]): string;
};

const projectRoot = resolve(__dirname, '..');
const source = readFileSync(
  resolve(projectRoot, 'src/features/workouts/components/session/RpeBottomSheet.tsx'),
  'utf8',
);

describe('RPE sheet responsive contract', () => {
  it('keeps the established RPE values and selection lifecycle', () => {
    expect(source).toContain('RPE_VALUES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10]');
    expect(source).toContain('setLocalSelection(value)');
    expect(source).toContain('onSelect(value)');
    expect(source).toContain('setTimeout(() => dismissWithAnimation(), 120)');
    expect(source).toContain('dismissWithAnimation(onSkip)');
  });

  it('uses adaptive wrapping controls with accessible touch targets', () => {
    expect(source).toContain("flexWrap: 'wrap'");
    expect(source).toContain("flexBasis: '18%'");
    expect(source).toContain('minHeight: 44');
    expect(source).toContain('minWidth: 44');
    expect(source).toContain('accessibilityState={{ selected }}');
    expect(source).not.toContain('height: 36');
    expect(source).not.toContain('minHeight: 30');
    expect(source).not.toContain("flexWrap: 'nowrap'");
  });

  it('uses shared elevated material and safe-area bottom spacing', () => {
    expect(source).toContain('<LiquidGlassSurface');
    expect(source).toContain('<SecondaryButton');
    expect(source).toContain('paddingBottom: insets.bottom + Spacing.two');
    expect(source).toContain('useWindowDimensions()');
    expect(source).not.toContain('minHeight: 178');
  });
});
