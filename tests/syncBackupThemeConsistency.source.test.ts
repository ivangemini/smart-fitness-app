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
const source = readFileSync(resolve(projectRoot, 'src/app/sync-backup.tsx'), 'utf8');

describe('Sync Backup theme consistency', () => {
  it('resolves presentation from AppThemeProvider without a static dark palette', () => {
    expect(source).toContain('useAppTheme');
    expect(source).toContain('createStyles(colors)');
    expect(source).not.toContain('Colors.dark.');
  });

  it('uses runtime safe-area spacing and scroll reachability instead of legacy clearance', () => {
    expect(source).toContain('safeAreaInsets.bottom + Spacing.eight');
    expect(source).toContain('flexGrow: 1');
    expect(source).not.toContain('safeAreaInsets.bottom + 120');
  });

  it('preserves sync, recovery, conflict and diagnostics behavior', () => {
    expect(source).toContain('useWeightSync');
    expect(source).toContain('onPress={() => void syncNow()}');
    expect(source).toContain('<DataRecoveryCard />');
    expect(source).toContain('<SyncConflictReviewCard />');
    expect(source).toContain('<SupportDiagnosticsCard');
  });
});
