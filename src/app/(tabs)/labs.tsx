import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getFloatingTabBarBottomClearance } from '@/components/navigation/floatingTabBarLayout';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Colors, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { getLabsCopy } from '@/features/labs/labsCopy';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

export default function LabsScreen() {
  const { colors } = useAppTheme();
  const { locale } = useLocalization();
  const insets = useSafeAreaInsets();
  const copy = useMemo(() => getLabsCopy(locale), [locale]);
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingBottom: getFloatingTabBarBottomClearance(insets.bottom) },
      ]}
      showsVerticalScrollIndicator={false}
      style={styles.screen}>
      <View style={styles.container}>
        <SectionHeader title={copy.tabTitle} subtitle={copy.subtitle} />

        <AppCard>
          <Text style={styles.cardTitle}>{copy.emptyTitle}</Text>
          <Text style={styles.body}>{copy.emptyBody}</Text>
          <AppButton disabled label={copy.addResults} />
          <Text style={styles.note}>{copy.processingBody}</Text>
        </AppCard>

        <View style={styles.grid}>
          <AppCard style={styles.gridCard}>
            <Text style={styles.cardTitle}>{copy.biomarkersTitle}</Text>
            <Text style={styles.body}>{copy.biomarkersBody}</Text>
          </AppCard>
          <AppCard style={styles.gridCard}>
            <Text style={styles.cardTitle}>{copy.trendsTitle}</Text>
            <Text style={styles.body}>{copy.trendsBody}</Text>
          </AppCard>
        </View>
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
    container: { gap: Spacing.three, maxWidth: MaxContentWidth, width: '100%' },
    content: { alignItems: 'center', flexGrow: 1, padding: Spacing.three },
    grid: { gap: Spacing.three },
    gridCard: { flex: 1 },
    note: {
      color: colors.textMuted,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    screen: { backgroundColor: colors.background, flex: 1 },
  });
