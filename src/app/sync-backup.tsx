import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Colors, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { useWeightSync } from '@/context/SyncContext';
import { DataRecoveryCard } from '@/features/settings/DataRecoveryCard';
import { SupportDiagnosticsCard } from '@/features/settings/SupportDiagnosticsCard';
import {
  SyncConflictReviewFooter,
  SyncConflictReviewHeader,
  SyncConflictReviewRow,
} from '@/features/settings/SyncConflictReviewCard';
import { getSyncStatusCopy, getSyncStatusExplanation } from '@/features/settings/syncStatusCopy';
import { useSyncConflictReview } from '@/features/settings/useSyncConflictReview';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

type SyncBackupStyles = ReturnType<typeof createStyles>;

function DetailRow({
  label,
  styles,
  value,
}: {
  label: string;
  styles: SyncBackupStyles;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function SyncBackupScreen() {
  const { colors } = useAppTheme();
  const { conflictCount, lastSyncAt, pendingOperations, status, syncNow } = useWeightSync();
  const { formatDate, t } = useLocalization();
  const safeAreaInsets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const copy = getSyncStatusCopy(t);
  const review = useSyncConflictReview();
  const isBusy = status === 'syncing';
  const actionLabel = isBusy
    ? copy.syncing
    : status === 'error' || status === 'offline'
      ? copy.retry
      : copy.syncNow;

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[
        styles.content,
        { paddingBottom: safeAreaInsets.bottom + Spacing.eight },
      ]}
      data={review.items}
      keyExtractor={(item) => item.conflictId}
      ListFooterComponent={
        <View
          style={[
            styles.container,
            review.otherConflictCount === 0 && styles.footerWithoutConflictSegment,
          ]}>
          <SyncConflictReviewFooter review={review} />
          <View style={styles.afterConflictGroup}>
            <SupportDiagnosticsCard
              conflictCount={conflictCount}
              pendingOperations={pendingOperations}
              syncStatus={status}
            />
          </View>
        </View>
      }
      ListHeaderComponent={
        <View style={styles.container}>
          <SectionHeader title={copy.section} subtitle={copy.description} />

          <AppCard>
            <Text style={styles.title}>{copy.currentStatus}</Text>
            <Text style={styles.value}>{copy.statusLabels[status]}</Text>
            <Text style={styles.detail}>{getSyncStatusExplanation(copy, status)}</Text>
            <Text style={styles.detail}>
              {copy.lastSync}:{' '}
              {lastSyncAt
                ? formatDate(lastSyncAt, { dateStyle: 'medium', timeStyle: 'short' })
                : copy.never}
            </Text>
          </AppCard>

          <AppCard>
            <Text style={styles.title}>{copy.queue}</Text>
            <DetailRow
              label={copy.pendingOperations}
              styles={styles}
              value={`${pendingOperations}`}
            />
            <DetailRow label={copy.conflicts} styles={styles} value={`${conflictCount}`} />
            <AppButton
              disabled={isBusy}
              label={actionLabel}
              loading={isBusy}
              onPress={() => void syncNow()}
            />
          </AppCard>

          <DataRecoveryCard />
          <SyncConflictReviewHeader review={review} />
        </View>
      }
      renderItem={({ item, index }) => (
        <View style={styles.container}>
          <SyncConflictReviewRow
            isLastItem={index === review.items.length - 1}
            item={item}
            review={review}
          />
        </View>
      )}
      showsVerticalScrollIndicator={false}
      style={styles.screen}
    />
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    afterConflictGroup: {
      marginTop: Spacing.three,
    },
    container: {
      gap: Spacing.three,
      maxWidth: MaxContentWidth,
      width: '100%',
    },
    content: {
      alignItems: 'center',
      flexGrow: 1,
      padding: Spacing.three,
    },
    detail: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
      marginTop: Spacing.one,
    },
    footerWithoutConflictSegment: {
      marginTop: Spacing.three,
    },
    row: {
      borderColor: colors.borderSubtle,
      borderTopWidth: StyleSheet.hairlineWidth,
      paddingTop: Spacing.two,
    },
    rowLabel: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      fontWeight: Typography.label.fontWeight,
      lineHeight: Typography.caption.lineHeight,
    },
    rowValue: {
      color: colors.textPrimary,
      fontSize: Typography.bodyEmphasized.fontSize,
      fontWeight: Typography.bodyEmphasized.fontWeight,
      lineHeight: Typography.bodyEmphasized.lineHeight,
      marginBottom: Spacing.two,
      marginTop: 2,
    },
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
    title: {
      color: colors.textPrimary,
      fontSize: Typography.sectionTitle.fontSize,
      fontWeight: Typography.sectionTitle.fontWeight,
      letterSpacing: Typography.sectionTitle.letterSpacing,
      lineHeight: Typography.sectionTitle.lineHeight,
      textTransform: Typography.sectionTitle.textTransform,
    },
    value: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.heroMetric.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
      marginTop: Spacing.one,
    },
  });
