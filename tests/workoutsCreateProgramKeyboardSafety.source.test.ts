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

const componentsSource = readSource(
  'src/features/workouts/screens/WorkoutsScreenComponents.tsx',
);
const stylesSource = readSource('src/features/workouts/screens/workoutsScreen.styles.ts');

describe('Workouts create-program keyboard safety', () => {
  it('keeps the auto-focused form reachable when the keyboard is open', () => {
    expect(componentsSource).toContain('KeyboardAvoidingView');
    expect(componentsSource).toContain("behavior={Platform.OS === 'ios' ? 'padding' : 'height'}");
    expect(componentsSource).toContain('keyboardShouldPersistTaps="handled"');
    expect(componentsSource).toContain("keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}");
    expect(stylesSource).toContain('keyboardAvoidingView:');
    expect(stylesSource).toContain('flexGrow: 1');
  });

  it('owns modal safe-area clearance dynamically', () => {
    expect(componentsSource).toContain('useSafeAreaInsets');
    expect(componentsSource).toContain('paddingBottom: insets.bottom + Spacing.three');
    expect(componentsSource).toContain('paddingTop: insets.top + Spacing.three');
  });
});
