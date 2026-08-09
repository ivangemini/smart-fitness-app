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

const settings = readSource('src/app/settings/index.tsx');
const rootLayout = readSource('src/app/_layout.tsx');

describe('Settings shell UX', () => {
  it('owns safe-area padding because the native stack header is hidden', () => {
    expect(rootLayout).toContain(
      '<Stack.Screen name="settings/index" options={{ headerShown: false }} />',
    );
    expect(settings).toContain('const safeAreaInsets = useSafeAreaInsets();');
    expect(settings).toContain('paddingTop: safeAreaInsets.top + Spacing.four');
    expect(settings).toContain('paddingBottom: safeAreaInsets.bottom + Spacing.eight');
  });

  it('keeps personal-details inputs reachable with the keyboard open', () => {
    expect(settings).toContain('automaticallyAdjustKeyboardInsets');
    expect(settings).toContain(
      "keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}",
    );
    expect(settings).toContain('keyboardShouldPersistTaps="handled"');
  });

  it('uses current-theme copy colors and the shared glass back action', () => {
    expect(settings).toContain("import { ChevronLeft } from 'lucide-react-native';");
    expect(settings).toContain('LiquidGlassIconButton');
    expect(settings).toContain('Icon={ChevronLeft}');
    expect(settings).toContain('onPress={() => router.back()}');
    expect(settings).not.toContain('styles.backButton');
    expect(settings).not.toContain('>‹</Text>');
    expect(settings).not.toContain('color: Colors.dark.textPrimary');
    expect(settings).not.toContain('color: Colors.dark.textSecondary');
  });
});
