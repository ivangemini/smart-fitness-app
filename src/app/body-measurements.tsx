import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddBodyMeasurementCard } from '@/components/progress/AddBodyMeasurementCard';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAppActions } from '@/context/AppContext';
import { useProgressState } from '@/context/ProgressStateContext';
import {
  buildBodyMeasurement,
  createBodyMeasurementDraft,
  getDefaultBodyMeasurementUnit,
  resolveBodyMeasurementStructuredValue,
} from '@/features/progress/bodyMeasurementModel';
import {
  getBodyMeasurementDisplayLabel,
  getBodyMeasurementError,
} from '@/features/progress/progressLocalization';
import { createUuid } from '@/lib/ids';
import { getProgressOverviewCopy } from '@/localization/progressOverviewCopy';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import type {
  BodyMeasurement,
  BodyMeasurementMetric,
  BodyMeasurementUnit,
} from '@/types';
import { useUnitPreferences } from '@/units';

const MAX_MEASUREMENT_HISTORY = 50;

export default function BodyMeasurementsScreen() {
  const { colors } = useAppTheme();
  const { addBodyMeasurement } = useAppActions();
  const { bodyMeasurements } = useProgressState();
  const { formatDate, formatNumber, locale, t } = useLocalization();
  const { formatLengthValue, length: lengthUnit } = useUnitPreferences();
  const copy = getProgressOverviewCopy(locale);
  const safeAreaInsets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [draft, setDraft] = useState(() => createBodyMeasurementDraft(lengthUnit));
  const [error, setError] = useState<string | null>(null);
  const measurements = useMemo(
    () =>
      [...bodyMeasurements]
        .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
        .slice(0, MAX_MEASUREMENT_HISTORY),
    [bodyMeasurements],
  );

  const isDisabled =
    draft.value.trim().length === 0 ||
    (draft.metric === 'custom' && draft.customLabel.trim().length === 0);

  const formatValue = (measurement: BodyMeasurement) => {
    const resolved = resolveBodyMeasurementStructuredValue(measurement);
    if (resolved?.canonicalUnit === 'cm' && resolved.canonicalNumericValue !== null) {
      return `${formatLengthValue(resolved.canonicalNumericValue)} ${lengthUnit}`;
    }
    if (resolved?.unit === 'percent') {
      return `${formatNumber(resolved.numericValue, { maximumFractionDigits: 1 })}%`;
    }
    return measurement.value;
  };

  const changeMetric = (metric: BodyMeasurementMetric) => {
    setDraft((current) => ({
      ...current,
      metric,
      unit: getDefaultBodyMeasurementUnit(metric, lengthUnit),
    }));
    setError(null);
  };

  const saveMeasurement = () => {
    const result = buildBodyMeasurement({
      draft,
      id: createUuid(),
      now: new Date().toISOString(),
    });
    if (!result.ok) {
      setError(getBodyMeasurementError(t, result.message));
      return;
    }

    addBodyMeasurement(result.measurement);
    setDraft(createBodyMeasurementDraft(lengthUnit));
    setError(null);
  };

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[
        styles.content,
        { paddingBottom: safeAreaInsets.bottom + Spacing.eight },
      ]}
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={styles.screen}>
      <View style={styles.container}>
        <SectionHeader title={copy.bodyMeasurementsTitle} subtitle={copy.bodyMeasurementsSubtitle} />

        <AppCard>
          <Text selectable style={styles.sectionTitle}>{copy.recentMeasurements}</Text>
          {measurements.length > 0 ? (
            <View style={styles.rows}>
              {measurements.map((measurement) => (
                <View key={measurement.id} style={styles.row}>
                  <View style={styles.rowCopy}>
                    <Text selectable style={styles.rowLabel}>
                      {getBodyMeasurementDisplayLabel(t, measurement.metric, measurement.label)}
                    </Text>
                    <Text selectable style={styles.rowDate}>
                      {formatDate(measurement.createdAt, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                  <Text selectable style={styles.rowValue}>{formatValue(measurement)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <EmptyState
              compact
              description={t('progress.measurementsEmptyDescription')}
              message={t('progress.measurementsEmptyMessage')}
              title={t('progress.measurementsEmptyTitle')}
            />
          )}
        </AppCard>

        <AppCard>
          <AddBodyMeasurementCard
            draft={draft}
            error={error}
            isDisabled={isDisabled}
            onChangeCustomLabel={(customLabel) =>
              setDraft((current) => ({ ...current, customLabel }))
            }
            onChangeMetric={changeMetric}
            onChangeUnit={(unit: BodyMeasurementUnit) => {
              setDraft((current) => ({ ...current, unit }));
              setError(null);
            }}
            onChangeValue={(value) => setDraft((current) => ({ ...current, value }))}
            onSave={saveMeasurement}
          />
        </AppCard>

        <AppButton label={copy.back} onPress={() => router.back()} variant="secondary" />
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    container: { gap: Spacing.three, maxWidth: MaxContentWidth, width: '100%' },
    content: { alignItems: 'center', flexGrow: 1, padding: Spacing.three },
    row: {
      alignItems: 'center',
      borderTopColor: colors.divider,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
      minHeight: 52,
      minWidth: 0,
      paddingVertical: Spacing.one,
    },
    rowCopy: { flex: 1, minWidth: 0 },
    rowDate: { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
    rowLabel: { color: colors.textPrimary, fontSize: 14, fontWeight: '700' },
    rowValue: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: 15,
      fontVariant: ['tabular-nums'],
      fontWeight: '800',
      maxWidth: '45%',
      textAlign: 'right',
    },
    rows: { marginTop: Spacing.one },
    screen: { backgroundColor: colors.background, flex: 1 },
    sectionTitle: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '800',
      marginBottom: Spacing.two,
    },
  });
