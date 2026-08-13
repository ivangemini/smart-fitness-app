import { describe, expect, it } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as {
  readFileSync: (path: string, encoding: string) => string;
};
const { resolve } = require('path') as {
  resolve: (...parts: string[]) => string;
};

const projectRoot = resolve(__dirname, '..');
const readSource = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), 'utf8');

describe('Settings account and security placement', () => {
  it('keeps authenticated account controls reachable through the Account child route', () => {
    const settings = readSource('src/app/settings/index.tsx');
    const account = readSource('src/app/settings/account.tsx');

    expect(settings).toContain("router.push('/settings/account')");
    expect(account).toContain("import { AuthGateCard } from '@/components/auth';");
    expect(account).toContain('<AuthGateCard />');
    expect(account).toContain("title={t('account.title')}");
  });

  it('records pluralization and Settings progress in the focused phase file', () => {
    const roadmap = readSource('docs/roadmap/localization-settings.md');

    expect(roadmap).toContain(
      'deterministic English/Russian one/few/many/other pluralization',
    );
    expect(roadmap).toContain('Account & Security entry and flows');
  });
});
