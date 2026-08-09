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

describe('Coach review touch targets', () => {
  it('keeps Safety & Recovery review navigation and period controls at 44 pt minimum', () => {
    const screen = readSource('src/features/coach/screens/SafetyRecoveryCoachScreen.tsx');
    const styles = readSource(
      'src/features/coach/screens/safetyRecoveryCoachScreen.styles.ts',
    );

    expect(screen).toContain('LiquidGlassIconButton');
    expect(styleBlock(sharedBack, 'pressable')).toContain('height: 44');
    expect(styleBlock(sharedBack, 'pressable')).toContain('width: 44');
    expect(styleBlock(styles, 'periodButton')).toContain('minHeight: 44');
  });

  it('keeps Combined review shared back navigation at 44 pt', () => {
    const screen = readSource('src/features/coach/screens/CombinedCoachScreen.tsx');

    expect(screen).toContain('LiquidGlassIconButton');
    expect(styleBlock(sharedBack, 'pressable')).toContain('height: 44');
    expect(styleBlock(sharedBack, 'pressable')).toContain('width: 44');
  });
});
