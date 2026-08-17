import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { Colors, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { getLabComparisonCopy } from '@/features/labs/labComparisonCopy';
import { useLabs } from '@/features/labs/LabsContext';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

export default function LabsCompareSelectScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { formatDate, locale, t } = useLocalization();
  const insets = useSafeAreaInsets();
  const { documents } = useLabs();
  const copy = useMemo(() => getLabComparisonCopy(locale), [locale]);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const panels = useMemo(
    () =>
      documents
        .filter(
          (document) =>
            document.status === 'confirmed' &&
            document.collectedAt !== null &&
            !Number.isNaN(new Date(document.collectedAt).getTime()),
        )
        .sort(
          (left, right) =>
            new Date(right.collectedAt!).getTime() - new Date(left.collectedAt!).getTime(),
        ),
    [documents],
  );
  const [previousId, setPreviousId] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const previous = panels.find((panel) => panel.id === previousId) ?? null;
  const current = panels.find((panel) => panel.id === currentId) ?? null;
  const canCompare =
    previous !== null &&
    current !== null &&
    previous.id !== current.id &&
    new Date(previous.collectedAt!).getTime() < new Date(current.collectedAt!).getTime();

  const listHeader = (
    <View style={styles.container}>
      <View style={styles.header}>
        <LiquidGlassIconButton
          accessibilityLabel={t('common.back')}
          Icon={ChevronLeft}
          onPress={() => router.back()}
        />
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{copy.selectTitle}</Text>
          <Text style={styles.body}>{copy.selectSubtitle}</Text>
        </View>
      </View>
    </View>
  );

  const listFooter = (
    <View style={[styles.container, styles.footer]}>
      <AppCard>
        {!canCompare ? <Text style={styles.body}>{copy.invalidSelection}</Text> : null}
        <AppButton
          disabled={!canCompare}
          label={copy.compareSelected}
          onPress={() => {
            if (!previous || !current || !canCompare) return;
            router.push({
              pathname: '/labs-compare',
              params: {
                previousDocumentId: previous.id,
                currentDocumentId: current.id,
              },
            });
          }}
        />
      </AppCard>
    </View>
  );

  return (
    <FlatList
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + Spacing.eight, paddingTop: insets.top + Spacing.four },
      ]}
      data={panels}
      ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      keyExtractor={(panel) => panel.id}
      ListFooterComponent={listFooter}
      ListHeaderComponent={listHeader}
      renderItem={({ item: panel }) => {
        const isPrevious = panel.id === previousId;
        const isCurrent = panel.id === currentId;
        const panelDate = formatDate(new Date(panel.collectedAt!), { dateStyle: 'medium' });
        return (
          <View style={styles.listItem}>
            <AppCard>
              <Text style={styles.cardTitle}>{panel.fileName}</Text>
              <Text style={styles.meta}>{panelDate}</Text>
              <View style={styles.actions}>
                <AppButton
                  accessibilityLabel={`${copy.selectPrevious}: ${panel.fileName}, ${panelDate}`}
                  disabled={isCurrent}
                  label={isPrevious ? copy.selectedPrevious : copy.selectPrevious}
                  onPress={() => setPreviousId(isPrevious ? null : panel.id)}
                  selected={isPrevious}
                  variant="secondary"
                />
                <AppButton
                  accessibilityLabel={`${copy.selectCurrent}: ${panel.fileName}, ${panelDate}`}
                  disabled={isPrevious}
                  label={isCurrent ? copy.selectedCurrent : copy.selectCurrent}
                  onPress={() => setCurrentId(isCurrent ? null : panel.id)}
                  selected={isCurrent}
                  variant="secondary"
                />
              </View>
            </AppCard>
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
      style={styles.screen}
    />
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    actions: { gap: Spacing.one },
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
    container: { gap: Spacing.three, maxWidth: MaxContentWidth, width: '100%' },
    content: { alignItems: 'center', flexGrow: 1, paddingHorizontal: Spacing.three },
    footer: { marginTop: Spacing.three },
    header: { alignItems: 'flex-start', flexDirection: 'row', gap: Spacing.three },
    headerCopy: { flex: 1, gap: Spacing.one, minWidth: 0 },
    itemSeparator: { height: Spacing.two },
    listItem: { maxWidth: MaxContentWidth, width: '100%' },
    meta: {
      color: colors.textMuted,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    screen: { backgroundColor: colors.background, flex: 1 },
    title: {
      color: colors.textPrimary,
      fontSize: Typography.screenTitle.fontSize,
      fontWeight: Typography.screenTitle.fontWeight,
      letterSpacing: Typography.screenTitle.letterSpacing,
      lineHeight: Typography.screenTitle.lineHeight,
    },
  });
