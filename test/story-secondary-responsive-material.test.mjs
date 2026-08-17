import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Story secondary responsive Liquid Glass states', () => {
  it('keeps story settings push controls adaptive and theme-aligned', () => {
    const source = readSource('src/features/social/screens/SocialStorySettingsScreen.tsx');

    expect(source).toContain("import { Platform, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';");
    expect(source).toMatch(/switchText:\s*\{[\s\S]*?flexShrink:\s*1,[\s\S]*?minWidth:\s*0,/u);
    expect(source).toContain(
      "thumbColor={Platform.OS === 'android' ? colors.surfacePrimary : undefined}",
    );
    expect(source).toContain(
      'trackColor={{ false: colors.borderStrong, true: colors.accent }}',
    );
  });

  it('keeps close-friend usernames shrinkable beside the remove action', () => {
    const source = readSource(
      'src/features/social/screens/SocialStoryCloseFriendsScreen.tsx',
    );

    expect(source).toMatch(/username:\s*\{[\s\S]*?flex:\s*1,[\s\S]*?flexShrink:\s*1,[\s\S]*?minWidth:\s*0,/u);
  });

  it('allows story activity mode controls to wrap for large Dynamic Type', () => {
    const source = readSource('src/features/social/screens/SocialStoryActivityScreen.tsx');

    expect(source).toMatch(/controls:\s*\{[^}]*flexDirection:\s*'row',[^}]*flexWrap:\s*'wrap',/u);
  });
});
