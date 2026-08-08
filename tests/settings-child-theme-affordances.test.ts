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

describe('Settings child theme and affordances', () => {
  it('keeps Personal Details bound to the current app theme', () => {
    const source = readSource('src/features/settings/PersonalDetailsSettingsCard.tsx');

    expect(source).toContain('useAppTheme');
    expect(source).not.toContain('Colors.dark');
  });

  it('uses a Lucide disclosure icon for Coach History in About', () => {
    const source = readSource('src/features/settings/PrivacyAboutCards.tsx');

    expect(source).toContain("import { ChevronRight } from 'lucide-react-native';");
    expect(source).toContain(
      '<ChevronRight color={colors.textMuted} size={24} strokeWidth={2} />',
    );
    expect(source).not.toContain('>›</Text>');
  });
});
