import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const weightEntryRoute = 'src/app/weight-entry.tsx';
const formFieldPath = 'src/components/ui/FormField.tsx';

describe('Weight Entry shared form contract', () => {
  it('delegates the live weight input to FormField instead of a local input recipe', () => {
    const source = readSource(weightEntryRoute);

    expect(source).toContain("import { FormField } from '@/components/ui/FormField'");
    expect(source).toContain('<FormField');
    expect(source).toContain('errorMessage={error || null}');
    expect(source).toContain('keyboardType="decimal-pad"');
    expect(source).toContain('label={copy.weightLabel(weightUnit)}');
    expect(source).toContain('value={weight}');
    expect(source).not.toContain('<TextInput');
    expect(source).not.toContain('backgroundColor: colors.surfacePrimary');
  });

  it('inherits a programmatic accessibility label and shared focus/error states', () => {
    const source = readSource(formFieldPath);

    expect(source).toContain('accessibilityLabel={inputProps.accessibilityLabel ?? label}');
    expect(source).toContain('focused && styles.inputFocused');
    expect(source).toContain('errorMessage && styles.inputError');
    expect(source).toContain('<InlineError message={errorMessage} />');
  });

  it('preserves weight parsing, persistence, keyboard reachability and navigation', () => {
    const source = readSource(weightEntryRoute);

    expect(source).toContain('parseDisplayNumber(weight)');
    expect(source).toContain('displayWeightInputToKg(weight, weightUnit)');
    expect(source).toContain('addWeightEntry({');
    expect(source).toContain('automaticallyAdjustKeyboardInsets');
    expect(source).toContain('keyboardShouldPersistTaps="handled"');
    expect(source).toContain('<AppButton label={copy.save} onPress={saveWeight} />');
    expect(source).toContain('router.back()');
  });
});
