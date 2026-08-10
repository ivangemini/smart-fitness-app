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

const screen = readSource('src/features/coach/screens/UserLimitationScreen.tsx');
const styles = readSource('src/features/coach/screens/userLimitationScreen.styles.ts');

describe('User Limitations UX', () => {
  it('owns one virtualized boundary for the unbounded limitations collection', () => {
    expect(screen).toContain('<FlatList');
    expect(screen).toContain('data={userLimitations}');
    expect(screen).toContain('keyExtractor={(item) => item.id}');
    expect(screen).not.toContain('<ScrollView');
    expect(screen).not.toContain('userLimitations.map(');
  });

  it('keeps the current-record collection visually grouped instead of splitting records into unrelated cards', () => {
    expect(screen).toContain('styles.recordsGroupHeader');
    expect(screen).toContain('styles.recordsGroupRow');
    expect(screen).toContain('styles.recordsGroupLastRow');
    expect(styles).toContain('recordsGroupHeader:');
    expect(styles).toContain('recordsGroupRow:');
    expect(styles).toContain('borderBottomLeftRadius: 0');
    expect(styles).toContain('borderTopWidth: 0');
  });

  it('preserves record mutation, sync, and add-form behavior', () => {
    expect(screen).toContain('upsertUserLimitation(result.limitation)');
    expect(screen).toContain('deleteUserLimitation(limitation.id)');
    expect(screen).toContain('void syncNow()');
    expect(screen).toContain('onPress={saveLimitation}');
    expect(screen).toContain("onPress={() => router.push('/profile/safety-recovery')}");
    expect(screen).toContain('automaticallyAdjustKeyboardInsets');
  });
});