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
  const match = source.match(
    new RegExp(`${name}:\\s*\\{([\\s\\S]*?)\\n\\s*\\},`),
  );
  return match?.[1] ?? '';
};

describe('Progress compact touch targets', () => {
  it('keeps first-level Progress actions on the shared AppButton boundary instead of restoring range tabs', () => {
    const source = readSource('src/app/(tabs)/progress.tsx');

    expect(source).toContain("import { AppButton } from '@/components/ui/AppButton';");
    expect(source).toContain("label={t('progress.weightDetails')}");
    expect(source).toContain("label={t('progress.addWeight')}");
    expect(source).toContain('label={measurementEditorOpen ? copy.hideMeasurementEditor : copy.addMeasurement}');
    expect(source).toContain('label={copy.openWorkoutHistory}');
    expect(source).not.toContain('accessibilityRole="tablist"');
    expect(source).not.toContain('accessibilityRole="tab"');
    expect(source).not.toContain('rangeTab:');
  });

  it('keeps Safety period and history chips at a 44 pt minimum touch height on detail surfaces', () => {
    const progressStyles = readSource(
      'src/components/progress/SafetyRecoveryProgressCard.styles.ts',
    );
    const weeklyStyles = readSource(
      'src/components/progress/SafetyRecoveryWeeklyTrendCard.styles.ts',
    );

    expect(styleBlock(progressStyles, 'periodChip')).toContain('minHeight: 44');
    expect(styleBlock(weeklyStyles, 'periodChip')).toContain('minHeight: 44');
    expect(styleBlock(weeklyStyles, 'historyButton')).toContain('minHeight: 44');
  });
});
