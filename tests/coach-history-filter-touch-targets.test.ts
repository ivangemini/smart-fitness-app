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
  resolve(projectRoot, 'src/features/coach/screens/CoachRunHistoryScreen.tsx'),
  'utf8',
);

describe('Coach history filter controls', () => {
  it('keeps compact filters at the 44 pt interaction floor', () => {
    expect(source).toContain('minHeight: 44');
    expect(source).toContain("alignItems: 'center'");
    expect(source).toContain("justifyContent: 'center'");
  });

  it('exposes the active filter as selected to accessibility', () => {
    expect(source).toContain(
      'accessibilityState={{ selected: option.value === value }}',
    );
  });
});
