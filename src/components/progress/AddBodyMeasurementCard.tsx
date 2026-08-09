import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Colors, Radii, Spacing } from '@/constants/theme';
import {
  BODY_MEASUREMENT_METRICS,
  getBodyMeasurementUnits,
  type BodyMeasurementDraft,
} from '@/features/progress/bodyMeasurementModel';
import { getBodyMeasurementMetricLabel } from '@/features/progress/progressLocalization';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import type { BodyMeasurementMetric, BodyMeasurementUnit } from '@/types';

type Props = {
  draft: BodyMeasurementDraft;
  error: string | null;
  isDisabled: boolean;
  onChangeMetric(value: BodyMeasurementMetric): void;
  onChangeCustomLabel(value: string): void;
  onChangeUnit(value: BodyMeasurementUnit): void;
  onChangeValue(value: string): void;
  onSave(): void;
};

export function AddBodyMeasurementCard({
  draft,
  error,
  isDisabled,
  onChangeCustomLabel,
  onChangeMetric,
  onChangeUnit,
  onChangeValue,
  onSave,
}: Props) {
  const { colors } = useAppTheme();
  const { t } = useLocalization();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const availableUnits = getBodyMeasurementUnits(draft.metric);

  return (
    <View style={styles.editor}>
      <Text style={styles.sectionTitle}>{t('measurement.add')}</Text>
      <Text style={styles.inputLabel}>{t('measurement.metric')}</Text>
      <View style={styles.choiceGrid}>
        {BODY_MEASUREMENT_METRICS.map((option) => {
          const selected = option.metric === draft.metric;
          return (
            <Pressable
              key={option.metric}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => onChangeMetric(option.metric)}
              style={[styles.choice, selected && styles.choiceSelected]}>
              <Text style={[styles.choiceLabel, selected && styles.choiceLabelSelected]}>
                {getBodyMeasurementMetricLabel(t, option.metric)}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {draft.metric === 'custom' ? (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t('measurement.customLabel')}</Text>
          <TextInput
            accessibilityLabel={t('measurement.customLabel')}
            onChangeText={onChangeCustomLabel}
            placeholder={t('measurement.customPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            value={draft.customLabel}
          />
        </View>
      ) : null}
      <View style={styles.inputGrid}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t('measurement.value')}</Text>
          <TextInput
            accessibilityLabel={t('measurement.value')}
            keyboardType="decimal-pad"
            onChangeText={onChangeValue}
            placeholder={draft.unit === 'in' ? '33.1' : draft.unit === 'percent' ? '15' : '84'}
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            value={draft.value}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t('measurement.unit')}</Text>
          <View style={styles.unitRow}>
            {availableUnits.map((unit) => {
              const selected = draft.unit === unit;
              return (
                <Pressable
                  key={unit}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  onPress={() => onChangeUnit(unit)}
                  style={[styles.unitChoice, selected && styles.choiceSelected]}>
                  <Text style={[styles.choiceLabel, selected && styles.choiceLabelSelected]}>
                    {unit === 'percent' ? '%' : unit}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AppButton disabled={isDisabled} label={t('measurement.save')} onPress={onSave} />
    </View>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    choice: {
      alignItems: 'center',
      borderColor: colors.border,
      borderRadius: Radii.pill,
      borderWidth: 1,
      justifyContent: 'center',
      minHeight: 44,
      paddingHorizontal: Spacing.two,
      paddingVertical: Spacing.one,
    },
    choiceGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.one,
      marginBottom: Spacing.two,
    },
    choiceLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: '700' },
    choiceLabelSelected: { color: colors.accent },
    choiceSelected: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
    editor: {
      borderTopColor: colors.divider,
      borderTopWidth: StyleSheet.hairlineWidth,
      paddingTop: Spacing.three,
    },
    error: { color: colors.error, fontSize: 13, marginBottom: Spacing.two },
    input: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderRadius: 8,
      borderWidth: 1,
      color: colors.text,
      fontSize: 16,
      minHeight: 48,
      paddingHorizontal: Spacing.two,
    },
    inputGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.two,
      marginBottom: Spacing.two,
    },
    inputGroup: { flex: 1, gap: Spacing.one, minWidth: 130, marginBottom: Spacing.two },
    inputLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: '700' },
    sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: Spacing.two },
    unitChoice: {
      alignItems: 'center',
      borderColor: colors.border,
      borderRadius: Radii.medium,
      borderWidth: 1,
      flex: 1,
      justifyContent: 'center',
      minHeight: 48,
    },
    unitRow: { flexDirection: 'row', gap: Spacing.one },
  });
