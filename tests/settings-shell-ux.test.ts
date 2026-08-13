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
const settingsLayout = readSource('src/features/settings/SettingsScreenLayout.tsx');
const rootLayout = readSource('src/app/_layout.tsx');

describe('Settings shell UX', () => {
  it('owns safe-area padding in the shared Settings layout because the native stack header is hidden', () => {
    expect(rootLayout).toContain(
      '<Stack.Screen name="settings/index" options={{ headerShown: false }} />',
    );
    expect(settings).toContain('SettingsScreenLayout');
    expect(settingsLayout).toContain('const insets = useSafeAreaInsets();');
    expect(settingsLayout).toContain('paddingTop: insets.top + Spacing.four');
    expect(settingsLayout).toContain('paddingBottom: insets.bottom + Spacing.eight');
  });

  it('keeps Settings inputs reachable with the keyboard open through the shared layout', () => {
    expect(settingsLayout).toContain('automaticallyAdjustKeyboardInsets');
    expect(settingsLayout).toContain(
      "keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}",
    );
    expect(settingsLayout).toContain('keyboardShouldPersistTaps="handled"');
  });

  it('uses current-theme copy colors and the shared glass back action', () => {
    expect(settingsLayout).toContain("import { ChevronLeft } from 'lucide-react-native';");
    expect(settingsLayout).toContain('LiquidGlassIconButton');
    expect(settingsLayout).toContain('Icon={ChevronLeft}');
    expect(settingsLayout).toContain('onPress={() => router.back()}');
    expect(settingsLayout).not.toContain('styles.backButton');
    expect(settingsLayout).not.toContain('>‹</Text>');
    expect(settingsLayout).not.toContain('color: Colors.dark.textPrimary');
    expect(settingsLayout).not.toContain('color: Colors.dark.textSecondary');
  });
});
