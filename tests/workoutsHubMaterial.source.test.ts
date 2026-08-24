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

const screenSource = readSource('src/features/workouts/screens/WorkoutsScreen.tsx');
const componentsSource = readSource(
  'src/features/workouts/screens/WorkoutsScreenComponents.tsx',
);
const stylesSource = readSource(
  'src/features/workouts/screens/workoutsScreen.styles.ts',
);

describe('Workouts hub material convergence', () => {
  it('uses shared interactive chrome for search and the sticky workout action', () => {
    expect(screenSource).toContain('LiquidGlassIconButton');
    expect(screenSource).toContain('testID="workouts-search-glass-button"');
    expect(screenSource).toContain('<PrimaryButton');
    expect(screenSource).toContain('icon={Play}');
    expect(screenSource).not.toContain('<Pressable');
    expect(stylesSource).not.toContain('searchButton:');
    expect(stylesSource).not.toContain('footerLabel:');
  });

  it('keeps the sticky action above the shared auxiliary tab-bar controls', () => {
    expect(screenSource).toContain('getFloatingTabBarBottomClearance(bottomInset, 0)');
    expect(screenSource).toContain('FLOATING_COMPANION_ENTRY_GAP');
    expect(screenSource).toContain('FLOATING_COMPANION_ENTRY_SIZE');
    expect(screenSource).toContain('getWorkoutsStickyActionBottom(insets.bottom)');
    expect(screenSource).toContain('bottom: stickyActionBottom');
    expect(screenSource).toContain(
      'stickyActionBottom + WORKOUTS_STICKY_ACTION_MIN_HEIGHT + Spacing.six',
    );
    expect(stylesSource).toContain("position: 'absolute'");
  });

  it('uses shared modal surface and actions without changing the program flow', () => {
    expect(componentsSource).toContain('<AppCard style={styles.panel}>');
    expect(componentsSource).toContain('<SecondaryButton');
    expect(componentsSource).toContain('<PrimaryButton');
    expect(componentsSource).toContain('disabled={!canCreate}');
    expect(componentsSource).toContain('onCreate(name)');
    expect(stylesSource).not.toContain('createButton:');
    expect(stylesSource).not.toContain('cancelButton:');
  });
});
