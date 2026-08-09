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
  resolve(projectRoot, 'src/features/social/screens/SocialProfileLookupScreen.tsx'),
  'utf8',
);

describe('Social Profile Lookup UX', () => {
  it('owns hidden-header safe area, keyboard behavior and bounded header layout', () => {
    expect(source).toContain('automaticallyAdjustKeyboardInsets');
    expect(source).toContain(
      "keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}",
    );
    expect(source).toContain('paddingTop: insets.top + Spacing.four');
    expect(source).toContain('flexGrow: 1');
    expect(source).toContain('headerCopy: { flex: 1, gap: Spacing.one, minWidth: 0 }');
  });

  it('uses the shared glass back control while preserving lookup and auth routes', () => {
    expect(source).toContain("import { ChevronLeft } from 'lucide-react-native';");
    expect(source).toContain('LiquidGlassIconButton');
    expect(source).toContain('Icon={ChevronLeft}');
    expect(source).toContain('onPress={() => router.back()}');
    expect(source).not.toContain('styles.backButton');
    expect(source).not.toContain('>‹</Text>');
    expect(source).toContain('validateSocialLookupUsername');
    expect(source).toContain('normalizeSocialLookupUsername');
    expect(source).toContain("pathname: '/social/[username]'");
    expect(source).toContain("router.push('/auth/sign-in')");
  });
});
