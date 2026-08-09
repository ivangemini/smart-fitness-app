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

describe('Account Sessions shell and theme', () => {
  it('uses the active app theme and owns hidden-header safe areas', () => {
    const source = readSource('src/app/account/sessions.tsx');

    expect(source).toContain('useAppTheme');
    expect(source).toContain('useSafeAreaInsets');
    expect(source).not.toContain('Colors.dark.');
    expect(source).toContain('paddingTop: safeAreaInsets.top + Spacing.two');
    expect(source).toContain('paddingBottom: safeAreaInsets.bottom + Spacing.four');
    expect(source).toContain('flexGrow: 1');
  });

  it('keeps the 44 pt back target and uses Lucide navigation language', () => {
    const source = readSource('src/app/account/sessions.tsx');

    expect(source).toContain('<ChevronLeft');
    expect(source).not.toContain('>‹</Text>');
    expect(source).toMatch(/backButton:\s*\{[\s\S]*?height:\s*44,[\s\S]*?width:\s*44,/);
    expect(source).toContain("accessibilityLabel={t('common.back')}");
    expect(source).toContain('onPress={() => router.back()}');
  });

  it('preserves session listing, refresh and revoke behavior', () => {
    const source = readSource('src/app/account/sessions.tsx');

    expect(source).toContain('listAuthSessions(accessToken)');
    expect(source).toContain('revokeAuthSession(accessToken, target.id)');
    expect(source).toContain('revokeOtherAuthSessions(accessToken)');
    expect(source).toContain("load('refresh')");
    expect(source).toContain('localizeSessionManagementMessage(error, t)');
  });

  it('remains a hidden-header route whose screen owns its shell', () => {
    const layout = readSource('src/app/_layout.tsx');

    expect(layout).toContain(
      '<Stack.Screen name="account/sessions" options={{ headerShown: false }} />',
    );
  });
});
