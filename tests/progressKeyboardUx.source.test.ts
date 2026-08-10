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

const progress = readSource('src/app/(tabs)/progress.tsx');

describe('Progress keyboard UX', () => {
  it('keeps the embedded body-measurement form keyboard-aware', () => {
    expect(progress).toContain("import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';");
    expect(progress).toContain('automaticallyAdjustKeyboardInsets');
    expect(progress).toContain(
      "keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}",
    );
    expect(progress).toContain('keyboardShouldPersistTaps="handled"');
    expect(progress).toContain('<AddBodyMeasurementCard');
  });

  it('preserves floating-tab clearance and the measurement save boundary', () => {
    expect(progress).toContain('getFloatingTabBarBottomClearance(safeAreaInsets.bottom)');
    expect(progress).toContain('addBodyMeasurement(result.measurement)');
  });
});
