import { describe, expect, it } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync, readdirSync } = require('fs') as {
  readFileSync(path: string, encoding: string): string;
  readdirSync(path: string): string[];
};
const { resolve } = require('path') as {
  resolve(...parts: string[]): string;
};

const projectRoot = resolve(__dirname, '..');
const coachScreensDir = resolve(projectRoot, 'src/features/coach/screens');

const readSource = (fileName: string) =>
  readFileSync(resolve(coachScreensDir, fileName), 'utf8');

describe('Coach back icon language', () => {
  it('contains no raw text back action glyphs in Coach screens', () => {
    const rawGlyphFiles = readdirSync(coachScreensDir)
      .filter((fileName) => fileName.endsWith('.tsx'))
      .filter((fileName) => readSource(fileName).includes('>‹</Text>'));

    expect(rawGlyphFiles).toEqual([]);
  });

  it.each(['CoachRunHistoryScreen.tsx', 'CoachRunHistoryDetailScreen.tsx'])(
    '%s exposes a localized back accessibility label',
    (fileName) => {
      const source = readSource(fileName);
      expect(source).toContain("accessibilityLabel={t('common.back')}");
      expect(source).toContain("import { ChevronLeft } from 'lucide-react-native';");
    },
  );
});
