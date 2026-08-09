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

const styleBlock = (source: string, name: string) => {
  const match = source.match(new RegExp(`${name}:\\s*\\{([\\s\\S]*?)\\n\\s*\\},`));
  return match?.[1] ?? '';
};

const sharedBack = readSource('src/components/ui/LiquidGlassIconButton.tsx');

describe('Coach input touch targets', () => {
  it('keeps Recovery score, clear and shared back controls at 44 pt minimum', () => {
    const picker = readSource('src/features/coach/components/RecoveryScorePicker.tsx');
    const screen = readSource('src/features/coach/screens/RecoveryCheckInScreen.tsx');

    expect(styleBlock(picker, 'scoreButton')).toContain('minHeight: 44');
    expect(styleBlock(picker, 'clearButton')).toContain('minHeight: 44');
    expect(picker).toContain('accessibilityState={{ disabled: value === null }}');
    expect(screen).toContain('LiquidGlassIconButton');
    expect(styleBlock(sharedBack, 'pressable')).toContain('height: 44');
    expect(styleBlock(sharedBack, 'pressable')).toContain('width: 44');
  });

  it('keeps Limitation movement and shared back controls at 44 pt minimum', () => {
    const styles = readSource('src/features/coach/screens/userLimitationScreen.styles.ts');
    const screen = readSource('src/features/coach/screens/UserLimitationScreen.tsx');

    expect(styleBlock(styles, 'movementChoice')).toContain('minHeight: 44');
    expect(screen).toContain('LiquidGlassIconButton');
    expect(styleBlock(sharedBack, 'pressable')).toContain('height: 44');
    expect(styleBlock(sharedBack, 'pressable')).toContain('width: 44');
  });
});
