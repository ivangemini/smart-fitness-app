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

const modals = readSource('src/features/workouts/components/NewRoutineModals.tsx');
const styles = readSource('src/features/workouts/styles/newRoutineScreenStyles.ts');

describe('new routine action menu material', () => {
  it('uses shared elevated material without duplicating an opaque panel fill', () => {
    expect(modals).toContain('<LiquidGlassSurface radius={22} style={styles.menuPanel} variant="elevated">');
    expect(modals).toContain('style={styles.menuPanelHitArea}');

    const menuPanelStart = styles.indexOf('menuPanel: {');
    const menuPanelEnd = styles.indexOf('menuPanelHitArea: {', menuPanelStart);
    const menuPanel = styles.slice(menuPanelStart, menuPanelEnd);

    expect(menuPanel).not.toContain('backgroundColor');
    expect(styles).toMatch(/menuPanelHitArea:\s*\{[\s\S]*?borderRadius:\s*22/);
  });

  it('keeps backdrop dismissal and safe-area ownership', () => {
    expect(modals).toContain('accessibilityLabel={copy.cancel}');
    expect(modals).toContain('onPress={onClose}');
    expect(modals).toContain('paddingBottom: insets.bottom + Spacing.three');
    expect(modals).toContain('onRequestClose={onClose}');
  });

  it('preserves replace and destructive-delete contracts', () => {
    expect(modals).toContain('onReplace(exercise.id)');
    expect(modals).toContain('Alert.alert(copy.deleteExerciseTitle, copy.deleteExerciseBody');
    expect(modals).toContain('onPress: () => onDelete(exercise.id)');
    expect(styles).toMatch(/menuAction:\s*\{[\s\S]*?minHeight:\s*50/);
  });

  it('leaves the already-scaled picker virtualization intact', () => {
    expect(modals).toContain('data={exercises}');
    expect(modals).toContain('initialNumToRender={8}');
    expect(modals).toContain('maxToRenderPerBatch={8}');
    expect(modals).toContain('windowSize={5}');
  });
});
