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
const readSource = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), 'utf8');

const screens = [
  'src/features/coach/screens/StrengthCoachScreen.tsx',
  'src/features/coach/screens/NutritionCoachScreen.tsx',
  'src/features/coach/screens/NutritionTargetProposalScreen.tsx',
] as const;

describe('Coach strategy back icon language', () => {
  it.each(screens)('%s uses the Lucide ChevronLeft action icon', (path) => {
    const source = readSource(path);

    expect(source).toContain("import { ChevronLeft } from 'lucide-react-native';");
    expect(source).toContain(
      '<ChevronLeft color={colors.textPrimary} size={24} strokeWidth={2} />',
    );
    expect(source).not.toContain('>‹</Text>');
  });
});
