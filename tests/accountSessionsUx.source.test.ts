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

const sessions = readSource('src/app/account/sessions.tsx');

describe('Account sessions UX', () => {
  it('virtualizes the unbounded active-session collection with stable ids', () => {
    expect(sessions).toContain('<FlatList');
    expect(sessions).toContain('data={sessions}');
    expect(sessions).toContain('keyExtractor={(item) => item.id}');
    expect(sessions).not.toContain('<ScrollView');
    expect(sessions).not.toContain('sessions.map(');
  });

  it('preserves refresh and session revocation actions', () => {
    expect(sessions).toContain("onRefresh={() => void load('refresh')}");
    expect(sessions).toContain('revokeAuthSession(accessToken, target.id)');
    expect(sessions).toContain('revokeOtherAuthSessions(accessToken)');
    expect(sessions).toContain('onPress={() => confirmRevoke(item)}');
    expect(sessions).toContain('onPress={confirmRevokeOthers}');
  });
});
