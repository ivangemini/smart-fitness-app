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

const history = readSource(
  'src/features/coach/screens/CoachRunHistoryScreen.tsx',
);

describe('Coach run history UX', () => {
  it('virtualizes the bounded 50-run history collection with stable ids', () => {
    expect(history).toContain('limit: 50');
    expect(history).toContain('<FlatList');
    expect(history).toContain('data={ready && isAuthenticated ? items : []}');
    expect(history).toContain('keyExtractor={(item) => item.id}');
    expect(history).not.toContain('items.map(');
  });

  it('preserves filters, retry, auth, and run-detail navigation', () => {
    expect(history).toContain("<FilterRow<CoachDomain | 'all'>");
    expect(history).toContain("<FilterRow<CoachRunStatus | 'all'>");
    expect(history).toContain("router.push('/auth/sign-in')");
    expect(history).toContain('label={copy.retry}');
    expect(history).toContain('router.push(`/profile/coach-history/${item.id}`)');
  });
});
