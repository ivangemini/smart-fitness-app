import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { Colors, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { getBiomarkerDisplayName } from '@/features/labs/biomarkerNames';
import { useLabs } from '@/features/labs/LabsContext';
import { LabMultiTrendChart, type LabMultiTrendSeries } from '@/features/labs/LabMultiTrendChart';
import {
  buildLabTrendPoints,
  isMarkerCompatibleWithSelection,
  type LabMultiTrendMode,
} from '@/features/labs/labMultiTrend';
import { getLabMultiTrendCopy } from '@/features/labs/labMultiTrendCopy';
import type { LabResultDto } from '@/features/labs/types';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

const MAX_SELECTED = 3;

export default function LabsTrendsScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { locale, t } = useLocalization();
  const insets = useSafeAreaInsets();
  const { getMarkerHistory, markers } = useLabs();
  const copy = useMemo(() => getLabMultiTrendCopy(locale), [locale]);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [mode, setMode] = useState<LabMultiTrendMode>('absolute');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [series, setSeries] = useState<LabMultiTrendSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const selectedMarkers = useMemo(
    () => selectedIds.flatMap((id) => markers.find((marker) => marker.markerId === id) ?? []),
    [markers, selectedIds],
  );

  const setTrendMode = (nextMode: LabMultiTrendMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setSelectedIds([]);
    setSeries([]);
    setFailed(false);
  };

  const toggleMarker = (marker: LabResultDto) => {
    setSeries([]);
    setFailed(false);
    setSelectedIds((current) => {
      if (current.includes(marker.markerId)) {
        return current.filter((id) => id !== marker.markerId);
      }
      if (current.length >= MAX_SELECTED) return current;
      const currentMarkers = current.flatMap(
        (id) => markers.find((entry) => entry.markerId === id) ?? [],
      );
      if (
        !isMarkerCompatibleWithSelection({
          candidate: marker,
          selected: currentMarkers,
          mode,
        })
      ) {
        return current;
      }
      return [...current, marker.markerId];
    });
  };

  const buildChart = async () => {
    if (selectedMarkers.length < 2 || loading) return;
    setLoading(true);
    setFailed(false);
    try {
      const histories = await Promise.all(
        selectedMarkers.map(async (marker) => ({
          marker,
          history: await getMarkerHistory(marker.markerId, 200),
        })),
      );
      setSeries(
        histories.map(({ marker, history }) => ({
          markerId: marker.markerId,
          label: getBiomarkerDisplayName(marker.markerId, locale),
          points: buildLabTrendPoints(history, mode),
        })),
      );
    } catch {
      setSeries([]);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const absoluteUnit = mode === 'absolute' ? selectedMarkers[0]?.unit : undefined;
  const hasRenderablePoints = series.filter((entry) => entry.points.length > 0).length >= 2;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + Spacing.eight, paddingTop: insets.top + Spacing.four },
      ]}
      showsVerticalScrollIndicator={false}
      style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <LiquidGlassIconButton
            accessibilityLabel={t('common.back')}
            Icon={ChevronLeft}
            onPress={() => router.back()}
          />
          <View style={styles.headerCopy}>
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.body}>{copy.subtitle}</Text>
          </View>
        </View>

        <AppCard>
          <View accessibilityRole="radiogroup" style={styles.modeRow}>
            <AppButton
              label={copy.absolute}
              onPress={() => setTrendMode('absolute')}
              selected={mode === 'absolute'}
              variant={mode === 'absolute' ? 'primary' : 'secondary'}
            />
            <AppButton
              label={copy.relative}
              onPress={() => setTrendMode('relative_reference')}
              selected={mode === 'relative_reference'}
              variant={mode === 'relative_reference' ? 'primary' : 'secondary'}
            />
          </View>
          <Text style={styles.body}>{copy.selectionHint}</Text>
        </AppCard>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{copy.choose}</Text>
          <View style={styles.stack}>
            {markers.map((marker) => {
              const selected = selectedIds.includes(marker.markerId);
              const compatible =
                selected ||
                isMarkerCompatibleWithSelection({
                  candidate: marker,
                  selected: selectedMarkers,
                  mode,
                });
              return (
                <AppButton
                  disabled={!selected && (!compatible || selectedIds.length >= MAX_SELECTED)}
                  key={marker.markerId}
                  label={`${getBiomarkerDisplayName(marker.markerId, locale)} · ${
                    selected ? copy.selected : compatible ? marker.unit : copy.incompatible
                  }`}
                  onPress={() => toggleMarker(marker)}
                  selected={selected}
                  variant="secondary"
                />
              );
            })}
          </View>
        </View>

        <AppButton
          disabled={selectedIds.length < 2 || loading}
          label={copy.show}
          loading={loading}
          onPress={() => void buildChart()}
        />

        {loading ? (
          <AppCard style={styles.centerCard}>
            <ActivityIndicator color={colors.textPrimary} />
            <Text style={styles.body}>{copy.loading}</Text>
          </AppCard>
        ) : failed ? (
          <AppCard>
            <Text accessibilityRole="alert" style={styles.body}>
              {copy.failed}
            </Text>
          </AppCard>
        ) : series.length > 0 ? (
          <AppCard>
            {hasRenderablePoints ? (
              <LabMultiTrendChart
                absoluteUnit={absoluteUnit}
                mode={mode}
                series={series}
              />
            ) : (
              <Text style={styles.body}>{copy.noPoints}</Text>
            )}
            {mode === 'relative_reference' ? (
              <Text style={styles.meta}>{copy.relativeAxis}</Text>
            ) : null}
          </AppCard>
        ) : null}
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    body: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    centerCard: { alignItems: 'center' },
    container: { gap: Spacing.three, maxWidth: MaxContentWidth, width: '100%' },
    content: { alignItems: 'center', flexGrow: 1, paddingHorizontal: Spacing.three },
    header: { alignItems: 'flex-start', flexDirection: 'row', gap: Spacing.three },
    headerCopy: { flex: 1, gap: Spacing.one, minWidth: 0 },
    meta: {
      color: colors.textMuted,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    modeRow: { gap: Spacing.one },
    screen: { backgroundColor: colors.background, flex: 1 },
    section: { gap: Spacing.two },
    sectionTitle: {
      color: colors.textSecondary,
      fontSize: Typography.sectionTitle.fontSize,
      fontWeight: Typography.sectionTitle.fontWeight,
      letterSpacing: Typography.sectionTitle.letterSpacing,
      textTransform: Typography.sectionTitle.textTransform,
    },
    stack: { gap: Spacing.one },
    title: {
      color: colors.textPrimary,
      fontSize: Typography.screenTitle.fontSize,
      fontWeight: Typography.screenTitle.fontWeight,
      letterSpacing: Typography.screenTitle.letterSpacing,
      lineHeight: Typography.screenTitle.lineHeight,
    },
  });
