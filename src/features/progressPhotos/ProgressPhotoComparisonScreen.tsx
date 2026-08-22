import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Colors, MaxContentWidth, Radii, Spacing } from '@/constants/theme';
import { useProgressState } from '@/context/ProgressStateContext';
import { resolveBodyMeasurementStructuredValue } from '@/features/progress/bodyMeasurementModel';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import type { BodyMeasurement, WeightEntry } from '@/types';
import { useUnitPreferences } from '@/units';

import {
  buildProgressPhotoComparison,
  getDefaultProgressPhotoComparisonSelection,
  getFirstComparableProgressPhotoPose,
  getProgressPhotoComparisonCandidates,
} from './progressPhotoComparison';
import { getProgressPhotoComparisonCopy } from './progressPhotoComparisonCopy';
import { progressPhotoRepository } from './progressPhotoRepository';
import type { ProgressPhotoPose, ProgressPhotoRecord } from './progressPhotoStore';

const POSES: ProgressPhotoPose[] = ['front', 'side', 'back'];
type SelectionTarget = 'before' | 'after';
type ComparisonMode = 'side_by_side' | 'overlay';

export default function ProgressPhotoComparisonScreen() {
  const { colors } = useAppTheme();
  const { user } = useAuthSession();
  const { bodyMeasurements, weightHistory } = useProgressState();
  const { formatDate, locale } = useLocalization();
  const { formatLengthValue, formatWeightValue, length, weight } = useUnitPreferences();
  const insets = useSafeAreaInsets();
  const copy = useMemo(() => getProgressPhotoComparisonCopy(locale), [locale]);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const poseOptions = useMemo(
    () => POSES.map((pose) => ({ label: copy.poseLabel(pose), value: pose })),
    [copy],
  );
  const targetOptions = useMemo(
    () => [
      { label: copy.before, value: 'before' as const },
      { label: copy.after, value: 'after' as const },
    ],
    [copy],
  );
  const [photos, setPhotos] = useState<ProgressPhotoRecord[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [selectedPose, setSelectedPose] = useState<ProgressPhotoPose>('front');
  const [selectionTarget, setSelectionTarget] = useState<SelectionTarget>('before');
  const [beforeId, setBeforeId] = useState<string | null>(null);
  const [afterId, setAfterId] = useState<string | null>(null);
  const [mode, setMode] = useState<ComparisonMode>('side_by_side');

  const load = useCallback(async () => {
    if (!user?.id) {
      setPhotos([]);
      setLoadState('ready');
      return;
    }
    try {
      setPhotos(await progressPhotoRepository.list(user.id));
      setLoadState('ready');
    } catch {
      setLoadState('error');
    }
  }, [user?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (photos.length === 0) return;
    const firstPose = getFirstComparableProgressPhotoPose(photos);
    if (!firstPose) {
      setBeforeId(null);
      setAfterId(null);
      return;
    }
    const currentCandidates = getProgressPhotoComparisonCandidates(photos, selectedPose);
    const pose = currentCandidates.length >= 2 ? selectedPose : firstPose;
    const defaults = getDefaultProgressPhotoComparisonSelection(photos, pose);
    setSelectedPose(pose);
    setBeforeId(defaults?.beforeId ?? null);
    setAfterId(defaults?.afterId ?? null);
    setMode('side_by_side');
  }, [photos]);

  const candidates = useMemo(
    () => getProgressPhotoComparisonCandidates(photos, selectedPose),
    [photos, selectedPose],
  );
  const comparison = useMemo(
    () =>
      buildProgressPhotoComparison({
        photos,
        beforeId,
        afterId,
        weightHistory,
        bodyMeasurements,
      }),
    [afterId, beforeId, bodyMeasurements, photos, weightHistory],
  );

  useEffect(() => {
    if (mode === 'overlay' && (!comparison.ok || !comparison.overlayEligible)) {
      setMode('side_by_side');
    }
  }, [comparison, mode]);

  const changePose = (pose: ProgressPhotoPose) => {
    setSelectedPose(pose);
    const defaults = getDefaultProgressPhotoComparisonSelection(photos, pose);
    setBeforeId(defaults?.beforeId ?? null);
    setAfterId(defaults?.afterId ?? null);
    setMode('side_by_side');
  };

  const selectCandidate = (photo: ProgressPhotoRecord) => {
    if (selectionTarget === 'before') {
      if (photo.id === afterId) return;
      setBeforeId(photo.id);
    } else {
      if (photo.id === beforeId) return;
      setAfterId(photo.id);
    }
    setMode('side_by_side');
  };

  const formatPhotoDate = (value: string) =>
    formatDate(value, { day: 'numeric', month: 'short', year: 'numeric' });

  const formatWaist = (measurement: BodyMeasurement | null) => {
    if (!measurement) return copy.noNearbyWaist;
    const resolved = resolveBodyMeasurementStructuredValue(measurement);
    if (!resolved) return copy.noNearbyWaist;
    if (resolved.canonicalUnit === 'cm' && resolved.canonicalNumericValue !== null) {
      return `${formatLengthValue(resolved.canonicalNumericValue)} ${length}`;
    }
    return copy.noNearbyWaist;
  };

  const renderEndpointEvidence = (
    label: string,
    evidence: { weight: WeightEntry | null; waist: BodyMeasurement | null },
  ) => (
    <AppCard style={styles.evidenceCard}>
      <Text style={styles.endpointTitle}>{label}</Text>
      <Text style={styles.detail}>
        {copy.weight}:{' '}
        {evidence.weight
          ? `${formatWeightValue(evidence.weight.weight)} ${weight}`
          : copy.noNearbyWeight}
      </Text>
      <Text style={styles.detail}>
        {copy.waist}: {formatWaist(evidence.waist)}
      </Text>
    </AppCard>
  );

  const renderComparison = () => {
    if (!comparison.ok) {
      return <Text style={styles.message}>{copy.invalidReason(comparison.reason)}</Text>;
    }
    if (mode === 'overlay') {
      return (
        <View style={styles.comparisonStack}>
          <View style={styles.overlayFrame}>
            <Image
              accessibilityLabel={`${copy.before}: ${copy.poseLabel(comparison.pose)}`}
              contentFit="contain"
              source={{ uri: comparison.before.localUri }}
              style={[styles.overlayImage, styles.overlayBefore]}
            />
            <Image
              accessibilityLabel={`${copy.after}: ${copy.poseLabel(comparison.pose)}`}
              contentFit="contain"
              source={{ uri: comparison.after.localUri }}
              style={[styles.overlayImage, styles.overlayAfter]}
            />
          </View>
          <Text style={styles.detail}>{copy.overlayNotice}</Text>
        </View>
      );
    }
    return (
      <View style={styles.comparisonRow}>
        {([
          [copy.before, comparison.before],
          [copy.after, comparison.after],
        ] as const).map(([label, photo]) => (
          <View key={photo.id} style={styles.comparisonColumn}>
            <Text style={styles.endpointTitle}>{label}</Text>
            <View style={styles.imageFrame}>
              <Image
                accessibilityLabel={`${label}: ${copy.poseLabel(photo.pose)}`}
                contentFit="contain"
                source={{ uri: photo.localUri }}
                style={styles.comparisonImage}
              />
            </View>
            <Text style={styles.dateText}>{formatPhotoDate(photo.capturedAt)}</Text>
            <Text style={styles.dateText}>
              {photo.source === 'camera' ? copy.sourceCamera : copy.sourceLibrary}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const comparablePose = getFirstComparableProgressPhotoPose(photos);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + Spacing.eight, paddingTop: insets.top + Spacing.three },
      ]}
      showsVerticalScrollIndicator={false}
      style={styles.screen}>
      <SectionHeader title={copy.title} subtitle={copy.subtitle} />
      <AppButton label={copy.back} onPress={() => router.back()} variant="secondary" />

      {loadState === 'loading' ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.accent} />
          <Text style={styles.detail}>{copy.loading}</Text>
        </View>
      ) : null}
      {loadState === 'error' ? <Text style={styles.error}>{copy.loadError}</Text> : null}
      {!user?.id ? <Text style={styles.error}>{copy.signedOut}</Text> : null}
      {loadState === 'ready' && user?.id && !comparablePose ? (
        <AppCard>
          <Text style={styles.detail}>{copy.noComparablePose}</Text>
        </AppCard>
      ) : null}

      {loadState === 'ready' && comparablePose ? (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{copy.pose}</Text>
            <SegmentedControl
              accessibilityLabel={copy.pose}
              onChange={changePose}
              options={poseOptions}
              value={selectedPose}
            />
            {candidates.length < 2 ? (
              <Text style={styles.message}>{copy.noTwoForPose}</Text>
            ) : null}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{copy.selecting}</Text>
            <SegmentedControl
              accessibilityLabel={copy.selecting}
              onChange={setSelectionTarget}
              options={targetOptions}
              value={selectionTarget}
            />
            <Text style={styles.detail}>{copy.timelineHint}</Text>
            <FlatList
              data={candidates}
              horizontal
              initialNumToRender={6}
              keyExtractor={(photo) => photo.id}
              maxToRenderPerBatch={6}
              renderItem={({ item }) => {
                const selected = item.id === beforeId || item.id === afterId;
                const disabled =
                  (selectionTarget === 'before' && item.id === afterId) ||
                  (selectionTarget === 'after' && item.id === beforeId);
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ disabled, selected }}
                    disabled={disabled}
                    onPress={() => selectCandidate(item)}
                    style={[
                      styles.candidate,
                      selected && styles.candidateSelected,
                      disabled && styles.candidateDisabled,
                    ]}>
                    <Image
                      contentFit="cover"
                      source={{ uri: item.localUri }}
                      style={styles.candidateImage}
                    />
                    <Text numberOfLines={1} style={styles.candidateDate}>
                      {formatPhotoDate(item.capturedAt)}
                    </Text>
                    {item.id === beforeId ? <Text style={styles.badge}>{copy.before}</Text> : null}
                    {item.id === afterId ? <Text style={styles.badge}>{copy.after}</Text> : null}
                  </Pressable>
                );
              }}
              showsHorizontalScrollIndicator={false}
              style={styles.timeline}
            />
          </View>

          <View style={styles.modeRow}>
            <AppButton
              label={copy.sideBySide}
              onPress={() => setMode('side_by_side')}
              selected={mode === 'side_by_side'}
              variant="secondary"
            />
            <AppButton
              disabled={!comparison.ok || !comparison.overlayEligible}
              label={copy.overlay}
              onPress={() => setMode('overlay')}
              selected={mode === 'overlay'}
              variant="secondary"
            />
          </View>
          {comparison.ok && !comparison.overlayEligible ? (
            <Text style={styles.message}>{copy.overlayUnavailable}</Text>
          ) : null}

          {renderComparison()}

          {comparison.ok ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{copy.evidenceTitle}</Text>
              <Text style={styles.detail}>{copy.evidenceNotice}</Text>
              <View style={styles.evidenceRow}>
                {renderEndpointEvidence(copy.before, comparison.evidence.before)}
                {renderEndpointEvidence(copy.after, comparison.evidence.after)}
              </View>
            </View>
          ) : null}
        </>
      ) : null}
    </ScrollView>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    badge: { color: colors.accent, fontSize: 11, fontWeight: '800' },
    candidate: {
      borderColor: colors.borderSubtle,
      borderRadius: Radii.medium,
      borderWidth: StyleSheet.hairlineWidth,
      gap: Spacing.one,
      marginRight: Spacing.two,
      padding: Spacing.one,
      width: 92,
    },
    candidateDate: { color: colors.textSecondary, fontSize: 11 },
    candidateDisabled: { opacity: 0.45 },
    candidateImage: { aspectRatio: 3 / 4, borderRadius: Radii.small, width: '100%' },
    candidateSelected: { borderColor: colors.accent, borderWidth: 2 },
    comparisonColumn: { flex: 1, gap: Spacing.one, minWidth: 0 },
    comparisonImage: { height: '100%', width: '100%' },
    comparisonRow: { flexDirection: 'row', gap: Spacing.two },
    comparisonStack: { gap: Spacing.two },
    content: {
      alignSelf: 'center',
      gap: Spacing.three,
      maxWidth: MaxContentWidth,
      paddingHorizontal: Spacing.three,
      width: '100%',
    },
    dateText: { color: colors.textSecondary, fontSize: 12, textAlign: 'center' },
    detail: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
    endpointTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '800' },
    error: { color: colors.error, fontSize: 13, lineHeight: 19 },
    evidenceCard: { flex: 1, gap: Spacing.one, minWidth: 0 },
    evidenceRow: { flexDirection: 'row', gap: Spacing.two },
    imageFrame: {
      aspectRatio: 3 / 4,
      backgroundColor: colors.surfaceSecondary,
      borderRadius: Radii.large,
      overflow: 'hidden',
      width: '100%',
    },
    loadingRow: { alignItems: 'center', flexDirection: 'row', gap: Spacing.two },
    message: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
    modeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
    overlayAfter: { opacity: 0.5 },
    overlayBefore: { opacity: 0.5 },
    overlayFrame: {
      aspectRatio: 3 / 4,
      backgroundColor: colors.surfaceSecondary,
      borderRadius: Radii.large,
      overflow: 'hidden',
      position: 'relative',
      width: '100%',
    },
    overlayImage: StyleSheet.absoluteFillObject,
    screen: { backgroundColor: colors.background, flex: 1 },
    section: { gap: Spacing.two },
    sectionTitle: { color: colors.textPrimary, fontSize: 17, fontWeight: '800' },
    timeline: { flexGrow: 0 },
  });
