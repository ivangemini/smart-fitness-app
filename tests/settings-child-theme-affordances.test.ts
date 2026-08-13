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

  it('keeps About focused on release and legal information without the removed Coach History affordance', () => {
    const about = readSource('src/app/settings/about.tsx');
    const cards = readSource('src/features/settings/PrivacyAboutCards.tsx');

    expect(about).toContain('<AboutSettingsCard />');
    expect(cards).toContain("t('about.appVersion')");
    expect(cards).toContain("t('about.runtime')");
    expect(cards).toContain("t('about.legalUnavailable')");
    expect(cards).not.toContain('ChevronRight');
    expect(cards).not.toContain('Coach History');
    expect(cards).not.toContain('>›</Text>');
  });
});
