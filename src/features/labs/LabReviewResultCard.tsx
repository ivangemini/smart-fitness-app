import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { LiquidGlassSurface } from '@/components/ui/LiquidGlassSurface';
import { Colors, Spacing, Typography } from '@/constants/theme';
import type { LabResultDraftDto } from '@/features/labs/types';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { resolveLiquidGlassPalette } from '@/theme/liquidGlass';

export type LabCorrectionInput = {
  sourceLabel: string;
  sourceValue: number;
  sourceUnit: string;
  sourceReferenceText?: string;
  referenceInterval?: {
    low?: number;
    high?: number;
    unit: string;
  };
};

type LabReviewResultCardProps = {
  result: LabResultDraftDto;
  copy: {
    accept: string;
    accepted: string;
    cancel: string;
    confidence: string;
    corrected: string;
    edit: string;
    exclude: string;
    excluded: string;
    marker: string;
    needsReview: string;
    referenceHigh: string;
    referenceLow: string;
    referenceUnit: string;
    saveCorrection: string;
    unit: string;
    unresolved: string;
    value: string;
  };
  busy: boolean;
  onAccept(): Promise<void>;
  onCorrect(input: LabCorrectionInput): Promise<void>;
  onExclude(): Promise<void>;
};

const optionalNumber = (value: string): number | undefined => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : undefined;
};

export function LabReviewResultCard({
  busy,
  copy,
  onAccept,
  onCorrect,
  onExclude,
  result,
}: LabReviewResultCardProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(result.sourceLabel);
  const [value, setValue] = useState(String(result.sourceValue));
  const [unit, setUnit] = useState(result.sourceUnit);
  const [referenceLow, setReferenceLow] = useState(
    result.referenceInterval?.low === null || result.referenceInterval?.low === undefined
      ? ''
      : String(result.referenceInterval.low),
  );
  const [referenceHigh, setReferenceHigh] = useState(
    result.referenceInterval?.high === null || result.referenceInterval?.high === undefined
      ? ''
      : String(result.referenceInterval.high),
  );
  const [referenceUnit, setReferenceUnit] = useState(result.referenceInterval?.unit ?? unit);

  const confidence = Math.round(
    Math.min(result.confidence.marker, result.confidence.value, result.confidence.unit) * 100,
  );
  const reviewLabel =
    result.reviewState === 'accepted'
      ? copy.accepted
      : result.reviewState === 'corrected'
        ? copy.corrected
        : result.reviewState === 'excluded'
          ? copy.excluded
          : copy.needsReview;

  const handleSaveCorrection = async () => {
    const parsedValue = optionalNumber(value);
    if (parsedValue === undefined || !label.trim() || !unit.trim()) return;
    const low = optionalNumber(referenceLow);
    const high = optionalNumber(referenceHigh);
    const hasReference = low !== undefined || high !== undefined;
    if (hasReference && !referenceUnit.trim()) return;

    await onCorrect({
      sourceLabel: label.trim(),
      sourceValue: parsedValue,
      sourceUnit: unit.trim(),
      ...(result.sourceReferenceText
        ? { sourceReferenceText: result.sourceReferenceText }
        : {}),
      ...(hasReference
        ? {
            referenceInterval: {
              ...(low === undefined ? {} : { low }),
              ...(high === undefined ? {} : { high }),
              unit: referenceUnit.trim(),
            },
          }
        : {}),
    });
    setEditing(false);
  };

  return (
    <LiquidGlassSurface style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{result.sourceLabel}</Text>
          <Text style={styles.valueText}>
            {result.sourceValue} {result.sourceUnit}
          </Text>
        </View>
        <Text style={styles.reviewState}>{reviewLabel}</Text>
      </View>

      <Text style={styles.meta}>{`${copy.confidence}: ${confidence}%`}</Text>
      {result.normalized ? (
        <Text style={styles.meta}>
          {result.normalized.markerId} · {result.normalized.value} {result.normalized.unit}
        </Text>
      ) : (
        <Text style={styles.warning}>{copy.unresolved}</Text>
      )}

      {editing ? (
        <View style={styles.form}>
          <LabeledInput disabled={busy} label={copy.marker} onChangeText={setLabel} value={label} />
          <View style={styles.inlineFields}>
            <LabeledInput
              disabled={busy}
              keyboardType="decimal-pad"
              label={copy.value}
              onChangeText={setValue}
              value={value}
            />
            <LabeledInput disabled={busy} label={copy.unit} onChangeText={setUnit} value={unit} />
          </View>
          <View style={styles.inlineFields}>
            <LabeledInput
              disabled={busy}
              keyboardType="decimal-pad"
              label={copy.referenceLow}
              onChangeText={setReferenceLow}
              value={referenceLow}
            />
            <LabeledInput
              disabled={busy}
              keyboardType="decimal-pad"
              label={copy.referenceHigh}
              onChangeText={setReferenceHigh}
              value={referenceHigh}
            />
          </View>
          <LabeledInput
            disabled={busy}
            label={copy.referenceUnit}
            onChangeText={setReferenceUnit}
            value={referenceUnit}
          />
          <View style={styles.actions}>
            <AppButton
              disabled={busy}
              label={copy.cancel}
              onPress={() => setEditing(false)}
              variant="secondary"
            />
            <AppButton
              disabled={busy}
              label={copy.saveCorrection}
              onPress={() => void handleSaveCorrection()}
            />
          </View>
        </View>
      ) : result.reviewState === 'unreviewed' ? (
        <View style={styles.actions}>
          <AppButton
            disabled={busy || !result.normalized}
            label={copy.accept}
            onPress={() => void onAccept()}
            variant="secondary"
          />
          <AppButton
            disabled={busy}
            label={copy.edit}
            onPress={() => setEditing(true)}
            variant="secondary"
          />
          <AppButton
            disabled={busy}
            label={copy.exclude}
            onPress={() => void onExclude()}
            variant="secondary"
          />
        </View>
      ) : null}
    </LiquidGlassSurface>
  );
}

type LabeledInputProps = {
  disabled?: boolean;
  label: string;
  value: string;
  onChangeText(value: string): void;
  keyboardType?: 'default' | 'decimal-pad';
};

function LabeledInput({
  disabled = false,
  keyboardType = 'default',
  label,
  onChangeText,
  value,
}: LabeledInputProps) {
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  return (
    <View style={stylesStatic.field}>
      <Text style={[stylesStatic.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        editable={!disabled}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        style={[
          stylesStatic.input,
          {
            backgroundColor: disabled ? glass.disabledFill : glass.controlFill,
            borderColor: disabled ? glass.disabledBorder : glass.controlBorder,
            color: disabled ? colors.textMuted : colors.textPrimary,
          },
        ]}
        value={value}
      />
    </View>
  );
}

const stylesStatic = StyleSheet.create({
  field: { flexBasis: 140, flexGrow: 1, gap: Spacing.one, minWidth: 0 },
  fieldLabel: {
    fontSize: Typography.caption.fontSize,
    lineHeight: Typography.caption.lineHeight,
  },
  input: {
    borderCurve: 'continuous',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: Typography.body.fontSize,
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
});

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    actions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
    card: { gap: Spacing.two },
    form: { gap: Spacing.two },
    header: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
    headerCopy: { flexBasis: 180, flexGrow: 1, gap: Spacing.one, minWidth: 0 },
    inlineFields: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
    meta: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    reviewState: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: Typography.caption.fontSize,
      fontWeight: '600',
      lineHeight: Typography.caption.lineHeight,
    },
    title: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
    valueText: {
      color: colors.textPrimary,
      fontSize: Typography.body.fontSize,
      fontWeight: '600',
      lineHeight: Typography.body.lineHeight,
    },
    warning: {
      color: colors.warning,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
  });
