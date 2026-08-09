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

const headerSource = readSource(
  'src/features/workouts/components/session/SessionHeader.tsx',
);

describe('workout session header responsive contract', () => {
  it('uses safe-area-aware shared glass navigation controls', () => {
    expect(headerSource).toContain('LiquidGlassIconButton');
    expect(headerSource).toContain('Icon={ChevronDown}');
    expect(headerSource).toContain('Icon={Ellipsis}');
    expect(headerSource).toContain('paddingTop: insets.top + Spacing.one');
    expect(headerSource).not.toContain('flatIconButton');
    expect(headerSource).not.toContain('overflowButton');
  });

  it('keeps timer and summary content-driven instead of offset-positioned', () => {
    expect(headerSource).toContain('<View style={styles.summaryStack}>');
    expect(headerSource).toContain('gap: Spacing.four');
    expect(headerSource).toContain('paddingBottom: Spacing.six');
    expect(headerSource).not.toContain('paddingBottom: 52');
    expect(headerSource).not.toContain('marginTop: 48');
    expect(headerSource).not.toContain('minHeight: 50');
  });

  it('preserves finish gating and the live workout summary', () => {
    expect(headerSource).toContain('accessibilityState={{ disabled: finishDisabled }}');
    expect(headerSource).toContain('disabled={finishDisabled}');
    expect(headerSource).toContain('finishDisabledReason');
    expect(headerSource).toContain('onPress={onFinish}');
    expect(headerSource).toContain("t('workouts.session.sets')");
    expect(headerSource).toContain("t('workouts.session.reps')");
    expect(headerSource).toContain("t('workouts.session.volume')");
    expect(headerSource).toContain('{elapsedLabel}');
  });
});
