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

const sharedBackScreens = [
  'src/features/coach/screens/SafetyRecoveryPreflightScreen.tsx',
  'src/features/coach/screens/CoachRunHistoryDetailScreen.tsx',
  'src/features/coach/screens/NutritionCoachScreen.tsx',
  'src/features/coach/screens/StrengthCoachScreen.tsx',
  'src/features/coach/screens/NutritionTargetProposalScreen.tsx',
  'src/features/coach/screens/CombinedCoachProposalScreen.tsx',
] as const;

const styleBlock = (source: string, name: string) => {
  const match = source.match(new RegExp(`${name}:\\s*\\{([\\s\\S]*?)\\n\\s*\\},`));
  return match?.[1] ?? '';
};

describe('Coach shared back touch targets', () => {
  it.each(sharedBackScreens)('%s delegates back navigation to the shared icon control', (path) => {
    const source = readSource(path);

    expect(source).toContain('LiquidGlassIconButton');
    expect(source).toContain('Icon={ChevronLeft}');
    expect(source).not.toContain('backButton:');
  });

  it('keeps the shared Liquid Glass icon control at 44 by 44', () => {
    const source = readSource('src/components/ui/LiquidGlassIconButton.tsx');
    const pressable = styleBlock(source, 'pressable');
    const surface = styleBlock(source, 'surface');

    expect(pressable).toContain('height: 44');
    expect(pressable).toContain('width: 44');
    expect(surface).toContain('height: 44');
    expect(surface).toContain('width: 44');
  });
});
