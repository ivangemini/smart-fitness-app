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
import { getLabComparisonCopy } from '@/features/labs/labComparisonCopy';
import { useLabs } from '@/features/labs/LabsContext';
import type { LabPanelComparisonDto } from '@/features/labs/types';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

export default function LabsCompareScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    previousDocumentId?: string;
    currentDocumentId?: string;
  }>();
  const previousDocumentId =
    typeof params.previousDocumentId === 'string' ? params.previousDocumentId : '';
  const currentDocumentId =
    typeof params.currentDocumentId === 'string' ? params.currentDocumentId : '';
  const { colors } = useAppTheme();
  const { formatDate, locale, t } = useLocalization();
  const insets = useSafeAreaInsets();
  const { comparePanels } = useLabs();
  const copy = useMemo(() => getLabComparisonCopy(locale), [locale]);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [comparison, setComparison] = useState<LabPanelComparisonDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    if (!previousDocumentId || !currentDocumentId) {
      setFailed(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setFailed(false);
    try {
      setComparison(await comparePanels(previousDocumentId, currentDocumentId));
    } catch {
      setComparison(null);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [comparePanels, currentDocumentId, previousDocumentId]);

  useEffect(() => {
    void load();
  }, [load]);

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

        {loading ? (
          <AppCard style={styles.centerCard}>
            <ActivityIndicator color={colors.textPrimary} />
            <Text style={styles.body}>{copy.loading}</Text>
          </AppCard>
        ) : failed || !comparison ? (
          <AppCard>
            <Text style={styles.body}>{copy.failed}</Text>
            <AppButton label={copy.retry} onPress={() => void load()} variant="secondary" />
          </AppCard>
        ) : (
          <>
            <AppCard>
              <View style={styles.dateRow}>
                <View style={styles.dateColumn}>
                  <Text style={styles.meta}>{copy.previous}</Text>
                  <Text style={styles.dateValue}>
                    {formatDate(new Date(comparison.previousCollectedAt), {
                      dateStyle: 'medium',
                    })}
                  </Text>
                </View>
                <View style={styles.dateColumn}>
                  <Text style={styles.meta}>{copy.current}</Text>
                  <Text style={styles.dateValue}>
                    {formatDate(new Date(comparison.currentCollectedAt), {
                      dateStyle: 'medium',
                    })}
                  </Text>
                </View>
              </View>
            </AppCard>

            {comparison.items.length === 0 ? (
              <AppCard>
                <Text style={styles.body}>{copy.empty}</Text>
              </AppCard>
            ) : (
              <View style={styles.stack}>
                {comparison.items.map((item) => (
                  <AppCard key={item.markerId}>
                    <Text style={styles.cardTitle}>
                      {getBiomarkerDisplayName(item.markerId, locale)}
                    </Text>
                    <Text style={styles.state}>{copy.state[item.state]}</Text>
                    <View style={styles.valueRow}>
                      <View style={styles.valueColumn}>
                        <Text style={styles.meta}>{copy.previous}</Text>
                        <Text style={styles.value}>
                          {item.previous
                            ? `${item.previous.value} ${item.previous.unit}`
                            : copy.previousMissing}
                        </Text>
                      </View>
                      <View style={styles.valueColumn}>
                        <Text style={styles.meta}>{copy.current}</Text>
                        <Text style={styles.value}>
                          {item.current.value} {item.current.unit}
                        </Text>
                      </View>
                    </View>
                  </AppCard>
                ))}
              </View>
            )}
          </>
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
    container: { gap: Spacing.three, maxWidth: MaxContentWidth, width: '100%' },
    content: { alignItems: 'center', flexGrow: 1, paddingHorizontal: Spacing.three },
    dateColumn: { flex: 1, gap: Spacing.one, minWidth: 0 },
    dateRow: { flexDirection: 'row', gap: Spacing.three },
    dateValue: {
      color: colors.textPrimary,
      fontSize: Typography.body.fontSize,
      fontWeight: Typography.bodyEmphasized.fontWeight,
      lineHeight: Typography.body.lineHeight,
    },
    header: { alignItems: 'flex-start', flexDirection: 'row', gap: Spacing.three },
    headerCopy: { flex: 1, gap: Spacing.one, minWidth: 0 },
    meta: {
      color: colors.textMuted,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    screen: { backgroundColor: colors.background, flex: 1 },
    stack: { gap: Spacing.two },
    state: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      fontWeight: Typography.label.fontWeight,
      lineHeight: Typography.caption.lineHeight,
    },
    title: {
      color: colors.textPrimary,
      fontSize: Typography.screenTitle.fontSize,
      fontWeight: Typography.screenTitle.fontWeight,
      letterSpacing: Typography.screenTitle.letterSpacing,
      lineHeight: Typography.screenTitle.lineHeight,
    },
    value: {
      color: colors.textPrimary,
      fontSize: Typography.body.fontSize,
      fontWeight: Typography.bodyEmphasized.fontWeight,
      lineHeight: Typography.body.lineHeight,
    },
    valueColumn: { flex: 1, gap: Spacing.one, minWidth: 0 },
    valueRow: { flexDirection: 'row', gap: Spacing.three },
  });
