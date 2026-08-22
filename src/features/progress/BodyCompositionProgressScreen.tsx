import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ProgressTrendChart,
  type ProgressTrendPoint,
} from '@/components/progress/ProgressTrendChart';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Colors, MaxContentWidth, Radii, Spacing } from '@/constants/theme';
import { useProgressState } from '@/context/ProgressStateContext';
import { useAuthSession } from '@/hooks/useAuthSession';
import type { BodyMeasurementSeriesGroup } from '@/lib/progress/bodyMeasurementSeries';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { useUnitPreferences, weightFromKg } from '@/units';

import {
  buildBodyCompositionProgress,
  type BodyCompositionPeriodDays,
} from './bodyCompositionProgress';
import { getBodyCompositionProgressCopy } from './bodyCompositionProgressCopy';
import { progressPhotoRepository } from '../progressPhotos/progressPhotoRepository';
import type { ProgressPhotoRecord } from '../progressPhotos/progressPhotoStore';

const PERIOD_OPTIONS = [
  { label: '30D', value: '30' },
  { label: '90D', value: '90' },
] as const;
const PERIOD_DAYS: Record<(typeof PERIOD_OPTIONS)[number]['value'], BodyCompositionPeriodDays> = {
  '30': 30,
  '90': 90,
};
const MAX_VISIBLE_MEASUREMENT_GROUPS = 6;

export default function BodyCompositionProgressScreen() {
  const { colors } = useAppTheme();
  const { user } = useAuthSession();
  const { bodyMeasurements, weightHistory } = useProgressState();
  const { formatDate, formatNumber, locale } = useLocalization();
  const {
    formatLengthValue,
    formatWeightValue,
    length: lengthUnit,
    weight: weightUnit,
  } = useUnitPreferences();
  const insets = useSafeAreaInsets();
  const copy = useMemo(() => getBodyCompositionProgressCopy(locale), [locale]);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [anchorAt] = useState(() => new Date().toISOString());
  const [periodKey, setPeriodKey] = useState<(typeof PERIOD_OPTIONS)[number]['value']>('90');
  const [photos, setPhotos] = useState<ProgressPhotoRecord[]>([]);
  const [photoLoadState, setPhotoLoadState] = useState<'loading' | 'ready' | 'error'>('loading');

  const loadPhotos = useCallback(async () => {
    if (!user?.id) {
      setPhotos([]);
      setPhotoLoadState('ready');
      return;
    }
    try {
      setPhotos(await progressPhotoRepository.list(user.id));
      setPhotoLoadState('ready');
    } catch {
      setPhotoLoadState('error');
    }
  }, [user?.id]);

  useEffect(() => {
    void loadPhotos();
  }, [loadPhotos]);

  const analytics = useMemo(
    () =>
      buildBodyCompositionProgress({
        bodyMeasurements,
        endAt: anchorAt,
        periodDays: PERIOD_DAYS[periodKey],
        progressPhotos: photos,
        weightHistory,
      }),
    [anchorAt, bodyMeasurements, periodKey, photos, weightHistory],
  );

  const visibleMeasurementGroups = analytics.measurements.groups.slice(
    0,
    MAX_VISIBLE_MEASUREMENT_GROUPS,
  );
  const weightTrendPoints = useMemo<ProgressTrendPoint[]>(
    () =>
      analytics.weightTrend.map((entry) => ({
        key: entry.id,
        label: formatDate(entry.createdAt, { day: 'numeric', month: 'short' }),
        value: weightFromKg(entry.weight, weightUnit),
        displayValue: `${formatWeightValue(entry.weight)} ${weightUnit}`,
      })),
    [analytics.weightTrend, formatDate, formatWeightValue, weightUnit],
  );
  const weightTrendValues = weightTrendPoints.map((point) => point.value);

  const formatSignedWeight = (value: number | null) =>
    value === null
      ? copy.unavailable
      : `${value > 0 ? '+' : ''}${formatWeightValue(value)} ${weightUnit}`;

  const formatSignedLength = (value: number | null) =>
    value === null
      ? copy.unavailable
      : `${value > 0 ? '+' : ''}${formatLengthValue(value)} ${lengthUnit}`;

  const formatMeasurementValue = (group: BodyMeasurementSeriesGroup) =>
    group.canonicalUnit === 'percent'
      ? `${formatNumber(group.currentCanonicalValue, { maximumFractionDigits: 1 })} %`
      : `${formatLengthValue(group.currentCanonicalValue)} ${lengthUnit}`;

  const formatMeasurementDelta = (group: BodyMeasurementSeriesGroup) => {
    if (group.periodDeltaCanonical === null) return copy.unavailable;
    if (group.canonicalUnit === 'percent') {
      return `${group.periodDeltaCanonical > 0 ? '+' : ''}${formatNumber(
        group.periodDeltaCanonical,
        { maximumFractionDigits: 1 },
      )} ${copy.percentPointsUnit}`;
    }
    return formatSignedLength(group.periodDeltaCanonical);
  };

  const formatPhotoDate = (value: string | null) =>
    value
      ? formatDate(value, { day: 'numeric', month: 'short', year: 'numeric' })
      : copy.unavailable;

  const weightRows = [
    {
      label: copy.currentWeight,
      value:
        analytics.weight.currentWeight === null
          ? copy.unavailable
          : `${formatWeightValue(analytics.weight.currentWeight)} ${weightUnit}`,
    },
    { label: copy.change7d, value: formatSignedWeight(analytics.weight.delta7Days) },
    { label: copy.change30d, value: formatSignedWeight(analytics.weight.delta30Days) },
  ];

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + Spacing.eight, paddingTop: insets.top + Spacing.three },
      ]}
      showsVerticalScrollIndicator={false}
      style={styles.screen}>
      <SectionHeader title={copy.title} subtitle={copy.subtitle} />

      <AppCard>
        <Text style={styles.cardTitle}>{copy.period}</Text>
        <SegmentedControl
          accessibilityLabel={copy.period}
          onChange={setPeriodKey}
          options={PERIOD_OPTIONS}
          value={periodKey}
        />
      </AppCard>

      <AppCard>
        <Text style={styles.cardTitle}>{copy.weightTrend}</Text>
        {analytics.evidence.hasWeight ? (
          <>
            <View style={styles.rows}>
              {weightRows.map((row) => (
                <View key={row.label} style={styles.row}>
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  <Text style={styles.rowValue}>{row.value}</Text>
                </View>
              ))}
            </View>
            <View style={styles.chartArea}>
              {weightTrendPoints.length > 1 ? (
                <ProgressTrendChart
                  emptyLabel={copy.weightTrendNeedsData}
                  maxLabel={`${formatNumber(Math.max(...weightTrendValues), {
                    maximumFractionDigits: 1,
                  })} ${weightUnit}`}
                  minLabel={`${formatNumber(Math.min(...weightTrendValues), {
                    maximumFractionDigits: 1,
                  })} ${weightUnit}`}
                  points={weightTrendPoints}
                />
              ) : (
                <Text style={styles.detail}>{copy.weightTrendNeedsData}</Text>
              )}
            </View>
          </>
        ) : (
          <Text style={styles.detail}>{copy.noWeight}</Text>
        )}
      </AppCard>

      <AppCard>
        <Text style={styles.cardTitle}>{copy.waist}</Text>
        {analytics.waist ? (
          <View style={styles.rows}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{copy.waist}</Text>
              <Text style={styles.rowValue}>
                {formatLengthValue(analytics.waist.currentCm)} {lengthUnit}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{copy.periodChange}</Text>
              <Text style={styles.rowValue}>{formatSignedLength(analytics.waist.deltaCm)}</Text>
            </View>
            <Text style={styles.detail}>
              {formatNumber(analytics.waist.entries)} {copy.entries}
            </Text>
          </View>
        ) : (
          <Text style={styles.detail}>{copy.noWaist}</Text>
        )}
      </AppCard>

      <AppCard>
        <Text style={styles.cardTitle}>{copy.measurements}</Text>
        <Text style={styles.detail}>{copy.measurementNotice}</Text>
        {visibleMeasurementGroups.length > 0 ? (
          <View style={styles.measurementList}>
            {visibleMeasurementGroups.map((group) => (
              <View key={group.key} style={styles.measurementRow}>
                <View style={styles.measurementLabelWrap}>
                  <Text style={styles.rowLabel}>{group.label}</Text>
                  <Text style={styles.microcopy}>{copy.storedMeasurement}</Text>
                </View>
                <View style={styles.measurementValueWrap}>
                  <Text style={styles.rowValue}>{formatMeasurementValue(group)}</Text>
                  <Text style={styles.microcopy}>{formatMeasurementDelta(group)}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.detail}>{copy.noMeasurements}</Text>
        )}
        <AppButton
          label={copy.measurementDetails}
          onPress={() => router.push('/measurement-progress')}
          variant="secondary"
        />
      </AppCard>

      <AppCard>
        <Text style={styles.cardTitle}>{copy.photos}</Text>
        <Text style={styles.detail}>{copy.photosNotice}</Text>
        {!user?.id ? <Text style={styles.message}>{copy.signedOut}</Text> : null}
        {photoLoadState === 'loading' ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.detail}>{copy.loading}</Text>
          </View>
        ) : null}
        {photoLoadState === 'error' ? <Text style={styles.error}>{copy.loadError}</Text> : null}
        {photoLoadState === 'ready' && user?.id && analytics.evidence.hasPhotos ? (
          <>
            <View style={styles.rows}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{copy.photoCount}</Text>
                <Text style={styles.rowValue}>{formatNumber(analytics.photos.total)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{copy.firstPhoto}</Text>
                <Text style={styles.rowValue}>{formatPhotoDate(analytics.photos.firstAt)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{copy.latestPhoto}</Text>
                <Text style={styles.rowValue}>{formatPhotoDate(analytics.photos.latestAt)}</Text>
              </View>
            </View>
            <FlatList
              data={analytics.photos.timeline}
              horizontal
              initialNumToRender={6}
              keyExtractor={(photo) => photo.id}
              maxToRenderPerBatch={6}
              renderItem={({ item }) => (
                <View style={styles.photoTile}>
                  <View style={styles.photoFrame}>
                    <Image contentFit="contain" source={{ uri: item.localUri }} style={styles.photoImage} />
                  </View>
                  <Text numberOfLines={1} style={styles.photoTitle}>
                    {copy.poseLabel(item.pose)}
                  </Text>
                  <Text numberOfLines={1} style={styles.microcopy}>
                    {formatPhotoDate(item.capturedAt)}
                  </Text>
                  <Text numberOfLines={1} style={styles.microcopy}>
                    {item.source === 'camera' ? copy.sourceCamera : copy.sourceLibrary}
                  </Text>
                </View>
              )}
              showsHorizontalScrollIndicator={false}
              style={styles.timeline}
            />
            {analytics.photos.timelineTruncated ? (
              <Text style={styles.detail}>{copy.timelineTruncated}</Text>
            ) : null}
          </>
        ) : null}
        {photoLoadState === 'ready' && user?.id && !analytics.evidence.hasPhotos ? (
          <Text style={styles.detail}>{copy.noPhotos}</Text>
        ) : null}
        <View style={styles.actions}>
          <AppButton
            label={copy.openPhotos}
            onPress={() => router.push('/progress-photos')}
            variant="secondary"
          />
          <AppButton
            disabled={analytics.photos.comparablePoses.length === 0}
            label={copy.comparePhotos}
            onPress={() => router.push('/progress-photo-compare')}
            variant="secondary"
          />
        </View>
        {user?.id && analytics.photos.comparablePoses.length === 0 ? (
          <Text style={styles.detail}>{copy.compareUnavailable}</Text>
        ) : null}
      </AppCard>

      <AppButton label={copy.back} onPress={() => router.back()} variant="secondary" />
    </ScrollView>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    actions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
    cardTitle: { color: colors.textPrimary, fontSize: 17, fontWeight: '800', marginBottom: Spacing.two },
    chartArea: { marginTop: Spacing.three },
    content: {
      alignSelf: 'center',
      gap: Spacing.three,
      maxWidth: MaxContentWidth,
      paddingHorizontal: Spacing.three,
      width: '100%',
    },
    detail: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
    error: { color: colors.error, fontSize: 13, lineHeight: 19 },
    loadingRow: { alignItems: 'center', flexDirection: 'row', gap: Spacing.two },
    measurementLabelWrap: { flex: 1, gap: 2 },
    measurementList: { gap: Spacing.two, marginTop: Spacing.two },
    measurementRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
    },
    measurementValueWrap: { alignItems: 'flex-end', gap: 2 },
    message: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginTop: Spacing.two },
    microcopy: { color: colors.textSecondary, fontSize: 11, lineHeight: 15 },
    photoFrame: {
      aspectRatio: 3 / 4,
      backgroundColor: colors.surfaceSecondary,
      borderRadius: Radii.medium,
      overflow: 'hidden',
      width: '100%',
    },
    photoImage: { height: '100%', width: '100%' },
    photoTile: { gap: 2, marginRight: Spacing.two, width: 96 },
    photoTitle: { color: colors.textPrimary, fontSize: 12, fontWeight: '700' },
    row: { alignItems: 'center', flexDirection: 'row', gap: Spacing.two, justifyContent: 'space-between' },
    rowLabel: { color: colors.textSecondary, flex: 1, fontSize: 13 },
    rows: { gap: Spacing.two },
    rowValue: { color: colors.textPrimary, fontSize: 14, fontWeight: '800', textAlign: 'right' },
    screen: { backgroundColor: colors.background, flex: 1 },
    timeline: { flexGrow: 0, marginTop: Spacing.two },
  });
