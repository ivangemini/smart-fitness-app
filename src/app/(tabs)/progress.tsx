import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getFloatingTabBarBottomClearance } from '@/components/navigation/floatingTabBarLayout';
import { AddBodyMeasurementCard } from '@/components/progress/AddBodyMeasurementCard';
import { ProgressOverviewCard } from '@/components/progress/ProgressOverviewCard';
import { AppButton } from '@/components/ui/AppButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAppActions, useWorkoutState } from '@/context/AppContext';
import { useProgressState } from '@/context/ProgressStateContext';
import {
  buildBodyMeasurement,
  createBodyMeasurementDraft,
  getDefaultBodyMeasurementUnit,
} from '@/features/progress/bodyMeasurementModel';
import { getProgressOverviewCopy } from '@/features/progress/progressOverviewCopy';
import { buildProgressOverview } from '@/features/progress/progressOverviewModel';
import { getBodyMeasurementError } from '@/features/progress/progressLocalization';
import { createUuid } from '@/lib/ids';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import type { BodyMeasurementMetric, BodyMeasurementUnit } from '@/types';
import { weightFromKg, useUnitPreferences } from '@/units';

const formatSigned = (value: number, formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string) =>
  `${value > 0 ? '+' : ''}${formatNumber(value, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })}`;

export default function ProgressScreen() {
  const { colors } = useAppTheme();
  const { addBodyMeasurement } = useAppActions();
  const { bodyMeasurements, weightHistory } = useProgressState();
  const { workoutSessions } = useWorkoutState();
  const { formatDate, formatNumber, locale, t } = useLocalization();
  const {
    formatWeightValue,
    length: lengthUnit,
    weight: weightUnit,
  } = useUnitPreferences();
  const safeAreaInsets = useSafeAreaInsets();
  const copy = getProgressOverviewCopy(locale);
  const [measurementDraft, setMeasurementDraft] = useState(() =>
    createBodyMeasurementDraft(lengthUnit),
  );
  const [measurementError, setMeasurementError] = useState<string | null>(null);
  const [measurementEditorOpen, setMeasurementEditorOpen] = useState(false);

  useEffect(() => {
    setMeasurementDraft((current) => {
      if (current.value.trim().length > 0 || current.unit === 'percent') return current;
      return { ...current, unit: lengthUnit };
    });
  }, [lengthUnit]);

  const overview = useMemo(
    () =>
      buildProgressOverview({
        bodyMeasurements,
        endAt: new Date().toISOString(),
        weightHistory,
        workoutSessions,
      }),
    [bodyMeasurements, weightHistory, workoutSessions],
  );

  const isMeasurementDisabled =
    measurementDraft.value.trim().length === 0 ||
    (measurementDraft.metric === 'custom' && measurementDraft.customLabel.trim().length === 0);

  const changeMeasurementMetric = (metric: BodyMeasurementMetric) => {
    setMeasurementDraft((current) => ({
      ...current,
      metric,
      unit: getDefaultBodyMeasurementUnit(metric, lengthUnit),
    }));
    setMeasurementError(null);
  };

  const changeMeasurementUnit = (unit: BodyMeasurementUnit) => {
    setMeasurementDraft((current) => ({ ...current, unit }));
    setMeasurementError(null);
  };

  const saveMeasurement = () => {
    const result = buildBodyMeasurement({
      draft: measurementDraft,
      id: createUuid(),
      now: new Date().toISOString(),
    });
    if (!result.ok) {
      setMeasurementError(getBodyMeasurementError(t, result.message));
      return;
    }
    addBodyMeasurement(result.measurement);
    setMeasurementDraft(createBodyMeasurementDraft(lengthUnit));
    setMeasurementError(null);
    setMeasurementEditorOpen(false);
  };

  const formatDateLabel = (value: string | null) =>
    value ? formatDate(value, { day: 'numeric', month: 'short' }) : copy.notAvailable;
  const formatTrend = (trend: typeof overview.strengthTraining.volumeTrend) => {
    switch (trend) {
      case 'up': return copy.up;
      case 'down': return copy.down;
      case 'stable': return copy.stable;
      default: return copy.insufficientData;
    }
  };

  const bodyHasData = overview.body.currentWeight !== null || overview.body.measurementCount > 0;
  const bodyRows = bodyHasData
    ? [
        {
          label: copy.currentWeight,
          value: overview.body.currentWeight === null
            ? copy.notAvailable
            : `${formatWeightValue(overview.body.currentWeight)} ${weightUnit}`,
        },
        {
          label: copy.sevenDayChange,
          value: overview.body.weightDelta7Days === null
            ? copy.notAvailable
            : `${formatSigned(weightFromKg(overview.body.weightDelta7Days, weightUnit), formatNumber)} ${weightUnit}`,
        },
        { label: copy.measurements, value: formatNumber(overview.body.measurementCount) },
        { label: copy.latestMeasurement, value: formatDateLabel(overview.body.latestMeasurementAt) },
      ]
    : [];

  const trainingHasData = overview.strengthTraining.sessionCount > 0;
  const trainingRows = trainingHasData
    ? [
        { label: copy.sessions28d, value: formatNumber(overview.strengthTraining.sessionCount) },
        {
          label: copy.workoutsPerWeek,
          value: formatNumber(overview.strengthTraining.workoutsPerWeek, { maximumFractionDigits: 1 }),
        },
        { label: copy.volumeTrend, value: formatTrend(overview.strengthTraining.volumeTrend) },
        ...(overview.strengthTraining.topExercise
          ? [{
              label: copy.topExercise,
              value: overview.strengthTraining.topExercise.exerciseName,
              detail: overview.strengthTraining.topExercise.periodBestEstimated1Rm === null
                ? formatTrend(overview.strengthTraining.topExercise.estimated1RmTrend)
                : `${formatWeightValue(overview.strengthTraining.topExercise.periodBestEstimated1Rm)} ${weightUnit} e1RM · ${formatTrend(overview.strengthTraining.topExercise.estimated1RmTrend)}`,
            }]
          : []),
      ]
    : [];

  const activityRows = overview.activity.latestWorkoutAt
    ? [
        { label: copy.activeDays28d, value: formatNumber(overview.activity.activeDayCount) },
        { label: copy.sessions7d, value: formatNumber(overview.activity.sessionsLast7Days) },
        { label: copy.latestWorkout, value: formatDateLabel(overview.activity.latestWorkoutAt) },
      ]
    : [];

  const highlightRows = overview.highlights.hasTrainingEvidence
    ? [
        { label: copy.recentRecords, value: formatNumber(overview.highlights.recentEstimated1RmRecordCount) },
        { label: copy.improvingExercises, value: formatNumber(overview.highlights.improvingExerciseCount) },
        { label: copy.decliningExercises, value: formatNumber(overview.highlights.decliningExerciseCount) },
      ]
    : [];

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[
        styles.content,
        { paddingBottom: getFloatingTabBarBottomClearance(safeAreaInsets.bottom) },
      ]}
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <SectionHeader title={t('tabs.progress')} subtitle={t('progress.subtitle')} />

        <ProgressOverviewCard
          actions={<AppButton label={t('progress.weightDetails')} onPress={() => router.push('/weight-details')} variant="secondary" />}
          emptyMessage={copy.noBodyData}
          rows={bodyRows}
          title={copy.body}
        />

        <View style={styles.inlineActions}>
          <AppButton label={t('progress.addWeight')} onPress={() => router.push('/weight-entry')} />
          <AppButton
            label={measurementEditorOpen ? copy.hideMeasurementEditor : copy.addMeasurement}
            onPress={() => setMeasurementEditorOpen((current) => !current)}
            variant="secondary"
          />
        </View>

        {measurementEditorOpen ? (
          <AddBodyMeasurementCard
            draft={measurementDraft}
            error={measurementError}
            isDisabled={isMeasurementDisabled}
            onChangeCustomLabel={(customLabel) => setMeasurementDraft((current) => ({ ...current, customLabel }))}
            onChangeMetric={changeMeasurementMetric}
            onChangeUnit={changeMeasurementUnit}
            onChangeValue={(value) => setMeasurementDraft((current) => ({ ...current, value }))}
            onSave={saveMeasurement}
          />
        ) : null}

        <ProgressOverviewCard
          actions={<AppButton label={copy.strengthTraining} onPress={() => router.push('/training-progress')} variant="secondary" />}
          emptyMessage={copy.noTrainingData}
          rows={trainingRows}
          subtitle={t('progress.trainingSubtitle')}
          title={copy.strengthTraining}
        />

        <ProgressOverviewCard emptyMessage={copy.noActivityData} rows={activityRows} title={copy.activity} />
        <ProgressOverviewCard emptyMessage={copy.noTrainingEvidence} rows={highlightRows} title={copy.highlights} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.three, maxWidth: MaxContentWidth, width: '100%' },
  content: { alignItems: 'center', flexGrow: 1, padding: Spacing.three },
  inlineActions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  screen: { flex: 1 },
});
