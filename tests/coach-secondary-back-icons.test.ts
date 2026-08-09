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
  'src/features/coach/screens/CombinedCoachScreen.tsx',
  'src/features/coach/screens/RecoveryCheckInScreen.tsx',
  'src/features/coach/screens/SafetyRecoveryCoachScreen.tsx',
  'src/features/coach/screens/UserLimitationScreen.tsx',
  'src/features/coach/screens/CoachRunHistoryScreen.tsx',
] as const;

describe('secondary Coach back icon language', () => {
  it.each(screens)('%s uses the shared Liquid Glass ChevronLeft action', (path) => {
    const source = readSource(path);

    expect(source).toContain("import { ChevronLeft } from 'lucide-react-native';");
    expect(source).toContain('LiquidGlassIconButton');
    expect(source).toContain('Icon={ChevronLeft}');
    expect(source).toContain('onPress={() => router.back()}');
    expect(source).not.toContain('styles.backButton');
    expect(source).not.toContain('themedStyles.backButton');
    expect(source).not.toContain('>‹</Text>');
  });
});
