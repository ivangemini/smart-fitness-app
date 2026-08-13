import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { Colors, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { getBiomarkerDisplayName } from '@/features/labs/biomarkerNames';
import { getLabsCopy } from '@/features/labs/labsCopy';
import { useLabs } from '@/features/labs/LabsContext';
import { LabTrendChart } from '@/features/labs/LabTrendChart';
import type { LabResultDto } from '@/features/labs/types';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

const HISTORY_PREVIEW_LIMIT = 30;

const formatReference = (result: LabResultDto, fallback: string): string => {
  const interval = result.referenceInterval;
  if (!interval) return fallback;
  if (interval.low !== null && interval.high !== null) {
    return `${interval.low}–${interval.high} ${interval.unit}`;
  }
  if (interval.low !== null) return `≥ ${interval.low} ${interval.unit}`;
  if (interval.high !== null) return `≤ ${interval.high} ${interval.unit}`;
  return fallback;
};

export default function LabMarkerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ markerId?: string }>();
  const markerId = typeof params.markerId === 'string' ? params.markerId : '';
  const { colors } = useAppTheme();
  const { formatDate, locale, t } = useLocalization();
  const insets = useSafeAreaInsets();
  const { getMarkerHistory } = useLabs();
  const copy = useMemo(() => getLabsCopy(locale), [locale]);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [history, setHistory] = useState<LabResultDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    if (!markerId) {
      setFailed(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setFailed(false);
    try {
      setHistory(await getMarkerHistory(markerId, 200));
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [getMarkerHistory, markerId]);

  useEffect(() => {
    void load();
  }, [load]);

  const latest = history.at(-1) ?? null;
  const historyPreview = useMemo(
    () => [...history].reverse().slice(0, HISTORY_PREVIEW_LIMIT),
    [history],
  );
  const name = getBiomarkerDisplayName(markerId, locale);

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
            <Text style={styles.title}>{name}</Text>
            {latest ? (
              <Text style={styles.body}>{copy.semanticState[latest.semanticState]}</Text>
            ) : null}
          </View>
        </View>

        {loading ? (
          <AppCard style={styles.centerCard}>
            <ActivityIndicator color={colors.textPrimary} />
            <Text style={styles.body}>{copy.loading}</Text>
          </AppCard>
        ) : failed ? (
          <AppCard>
            <Text style={styles.body}>{copy.loadFailed}</Text>
            <AppButton label={copy.retry} onPress={() => void load()} variant="secondary" />
          </AppCard>
        ) : latest ? (
          <>
            <View style={styles.metricsRow}>
              <AppCard style={styles.metricCard}>
                <Text style={styles.metricLabel}>{copy.currentTitle}</Text>
                <Text style={styles.metricValue}>
                  {latest.value} {latest.unit}
                </Text>
                <Text style={styles.meta}>
                  {formatDate(new Date(latest.collectedAt), { dateStyle: 'medium' })}
                </Text>
              </AppCard>
              <AppCard style={styles.metricCard}>
                <Text style={styles.metricLabel}>{copy.referenceTitle}</Text>
                <Text style={styles.metricValue}>{formatReference(latest, copy.noReference)}</Text>
              </AppCard>
            </View>

            <AppCard>
              <Text style={styles.cardTitle}>{copy.trendsTitle}</Text>
              <LabTrendChart results={history} />
            </AppCard>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{copy.historyTitle}</Text>
              <View style={styles.stack}>
                {historyPreview.map((result) => (
                  <AppCard key={result.id} style={styles.historyRow}>
                    <View style={styles.historyCopy}>
                      <Text style={styles.historyValue}>
                        {result.value} {result.unit}
                      </Text>
                      <Text style={styles.meta}>
                        {formatDate(new Date(result.collectedAt), { dateStyle: 'medium' })}
                      </Text>
                    </View>
                    <Text style={styles.historyState}>
                      {copy.semanticState[result.semanticState]}
                    </Text>
                  </AppCard>
                ))}
              </View>
            </View>
          </>
        ) : (
          <AppCard>
            <Text style={styles.body}>{copy.noHistory}</Text>
          </AppCard>
        )}
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
    cardTitle: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
    centerCard: { alignItems: 'center' },
    container: { gap: Spacing.four, maxWidth: MaxContentWidth, width: '100%' },
    content: { alignItems: 'center', flexGrow: 1, paddingHorizontal: Spacing.three },
    header: { alignItems: 'flex-start', flexDirection: 'row', gap: Spacing.three },
    headerCopy: { flex: 1, gap: Spacing.one, minWidth: 0 },
    historyCopy: { flex: 1, gap: Spacing.one, minWidth: 0 },
    historyRow: { alignItems: 'center', flexDirection: 'row', gap: Spacing.three },
    historyState: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
      maxWidth: '48%',
      textAlign: 'right',
    },
    historyValue: {
      color: colors.textPrimary,
      fontSize: Typography.body.fontSize,
      fontWeight: '600',
      lineHeight: Typography.body.lineHeight,
    },
    meta: {
      color: colors.textMuted,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    metricCard: { flexBasis: 220, flexGrow: 1, minWidth: 0 },
    metricLabel: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    metricValue: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
    metricsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
    screen: { backgroundColor: colors.background, flex: 1 },
    section: { gap: Spacing.two },
    sectionTitle: {
      color: colors.textSecondary,
      fontSize: Typography.sectionTitle.fontSize,
      fontWeight: Typography.sectionTitle.fontWeight,
      letterSpacing: Typography.sectionTitle.letterSpacing,
      textTransform: Typography.sectionTitle.textTransform,
    },
    stack: { gap: Spacing.two },
    title: {
      color: colors.textPrimary,
      fontSize: Typography.screenTitle.fontSize,
      fontWeight: Typography.screenTitle.fontWeight,
      letterSpacing: Typography.screenTitle.letterSpacing,
      lineHeight: Typography.screenTitle.lineHeight,
    },
  });
