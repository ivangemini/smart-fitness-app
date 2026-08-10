import { StyleSheet, Text, View } from 'react-native';

import type { SyncConflictResolutionReviewItem } from '@/context/useSyncConflictResolution';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { Radii, Spacing, Typography } from '@/constants/theme';
import { useLocalization } from '@/localization';
import { getSyncConflictResolutionUiCopy } from '@/localization/syncConflictResolutionMessages';
import { useAppTheme } from '@/theme/AppThemeProvider';

import { getSyncConflictCopy, getSyncConflictEntityLabel } from './syncConflictCopy';
import {
  getSyncConflictIntentStatusMessage,
  getSyncConflictPayloadKindLabel,
  getSyncConflictSelectedChoiceLabel,
  isSyncConflictIntentSubmitting,
  shouldFinishSyncConflictIntent,
} from './syncConflictResolutionPresentation';
import type { SyncConflictReviewController } from './useSyncConflictReview';

function VersionRow({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.versionRow, { borderColor: colors.borderSubtle }]}>
      <Text style={[styles.versionLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.versionValue, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

export function SyncConflictReviewHeader({
  review,
}: {
  review: SyncConflictReviewController;
}) {
  const { colors } = useAppTheme();
  const { t } = useLocalization();
  const copy = getSyncConflictCopy(t);
  const hasFollowingSegment = review.items.length > 0 || review.otherConflictCount > 0;

  return (
    <AppCard style={hasFollowingSegment ? styles.groupHeader : undefined}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{copy.title}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {review.loadState === 'loading'
          ? copy.loading
          : review.loadState === 'error'
            ? copy.loadFailed
            : review.conflictCount === 0 && review.items.length === 0
              ? copy.healthy
              : copy.explanation}
      </Text>
    </AppCard>
  );
}

export function SyncConflictReviewRow({
  item,
  isLastItem,
  review,
}: {
  item: SyncConflictResolutionReviewItem;
  isLastItem: boolean;
  review: SyncConflictReviewController;
}) {
  const { colors } = useAppTheme();
  const { formatDate, locale, t } = useLocalization();
  const copy = getSyncConflictCopy(t);
  const resolutionCopy = getSyncConflictResolutionUiCopy(locale);
  const { candidate, conflictId, intentChoice, intentState } = item;
  const isRunning = review.runningResolution?.conflictId === conflictId;
  const hasIntent = intentChoice !== null && intentState !== null;
  const isSubmitting = isSyncConflictIntentSubmitting(intentState);
  const actionLabel = shouldFinishSyncConflictIntent(intentState)
    ? resolutionCopy.finishSynchronization
    : resolutionCopy.retrySelectedChoice;
  const closesGroup = isLastItem && review.otherConflictCount === 0;

  return (
    <AppCard style={[styles.groupRow, closesGroup && styles.groupLastRow]}>
      <View style={[styles.conflict, { borderColor: colors.borderSubtle }]}>
        <Text style={[styles.entity, { color: colors.textPrimary }]}>
          {candidate ? getSyncConflictEntityLabel(copy, candidate.entityType) : copy.unknownEntity}
        </Text>
        {candidate ? (
          <>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              {copy.detected}:{' '}
              {formatDate(candidate.detectedAt, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </Text>
            <View style={styles.versions}>
              <VersionRow
                label={resolutionCopy.thisDevice}
                value={getSyncConflictPayloadKindLabel(resolutionCopy, candidate.localKind)}
              />
              <VersionRow
                label={resolutionCopy.accountVersion}
                value={getSyncConflictPayloadKindLabel(resolutionCopy, candidate.remoteKind)}
              />
            </View>
          </>
        ) : null}

        {hasIntent ? (
          <View style={styles.intent}>
            <Text style={[styles.selected, { color: colors.textPrimary }]}>
              {getSyncConflictSelectedChoiceLabel(resolutionCopy, intentChoice)}
            </Text>
            <Text style={[styles.note, { color: colors.textSecondary }]}>
              {getSyncConflictIntentStatusMessage(resolutionCopy, intentState)}
            </Text>
            <AppButton
              disabled={review.isBusy || isSubmitting}
              label={isRunning || isSubmitting ? resolutionCopy.retrying : actionLabel}
              loading={isRunning || isSubmitting}
              onPress={() => void review.resumeResolution(item)}
              variant="secondary"
            />
          </View>
        ) : intentState !== null ? (
          <Text style={[styles.notice, { color: colors.textSecondary }]}>
            {resolutionCopy.outcomeRejected}
          </Text>
        ) : candidate ? (
          <View style={styles.choiceArea}>
            <Text style={[styles.note, { color: colors.textSecondary }]}>
              {resolutionCopy.selectionExplanation}
            </Text>
            <View style={styles.actions}>
              <AppButton
                disabled={review.isBusy}
                label={
                  isRunning && review.runningResolution?.choice === 'keep_local'
                    ? resolutionCopy.retrying
                    : resolutionCopy.useDeviceVersion
                }
                loading={isRunning && review.runningResolution?.choice === 'keep_local'}
                onPress={() => review.confirmResolution(item, 'keep_local')}
                variant="secondary"
              />
              <AppButton
                disabled={review.isBusy}
                label={
                  isRunning && review.runningResolution?.choice === 'keep_remote'
                    ? resolutionCopy.retrying
                    : resolutionCopy.useAccountVersion
                }
                loading={isRunning && review.runningResolution?.choice === 'keep_remote'}
                onPress={() => review.confirmResolution(item, 'keep_remote')}
                variant="secondary"
              />
            </View>
          </View>
        ) : (
          <Text style={[styles.notice, { color: colors.textSecondary }]}>
            {resolutionCopy.outcomeRejected}
          </Text>
        )}

        {review.notices[conflictId] ? (
          <Text style={[styles.notice, { color: colors.textSecondary }]}>
            {review.notices[conflictId]}
          </Text>
        ) : null}
      </View>
    </AppCard>
  );
}

export function SyncConflictReviewFooter({
  review,
}: {
  review: SyncConflictReviewController;
}) {
  const { colors } = useAppTheme();
  const { locale } = useLocalization();
  const resolutionCopy = getSyncConflictResolutionUiCopy(locale);

  if (review.otherConflictCount <= 0) return null;

  return (
    <AppCard style={styles.groupFooter}>
      <View style={styles.remaining}>
        <Text style={[styles.note, { color: colors.textSecondary }]}>
          {resolutionCopy.otherConflicts}
        </Text>
        <AppButton
          disabled={review.isBusy}
          label={review.isRetryingSync ? resolutionCopy.retrying : resolutionCopy.retrySync}
          loading={review.isRetryingSync}
          onPress={() => void review.retryRemainingConflicts()}
          variant="secondary"
        />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  actions: { gap: Spacing.two },
  choiceArea: { gap: Spacing.two, marginTop: Spacing.one },
  conflict: {
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: Spacing.one,
    paddingTop: Spacing.two,
  },
  description: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    marginTop: Spacing.one,
  },
  entity: {
    fontSize: Typography.bodyEmphasized.fontSize,
    fontWeight: Typography.bodyEmphasized.fontWeight,
    lineHeight: Typography.bodyEmphasized.lineHeight,
  },
  groupFooter: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  groupHeader: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  groupLastRow: {
    borderBottomLeftRadius: Radii.large,
    borderBottomRightRadius: Radii.large,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  groupRow: {
    borderBottomWidth: 0,
    borderRadius: 0,
    borderTopWidth: 0,
    elevation: 0,
    paddingBottom: Spacing.three,
    paddingTop: 0,
    shadowOpacity: 0,
  },
  intent: { gap: Spacing.two, marginTop: Spacing.one },
  meta: {
    fontSize: Typography.caption.fontSize,
    lineHeight: Typography.caption.lineHeight,
  },
  note: {
    fontSize: Typography.caption.fontSize,
    lineHeight: Typography.caption.lineHeight,
  },
  notice: {
    fontSize: Typography.caption.fontSize,
    lineHeight: Typography.caption.lineHeight,
    marginTop: Spacing.one,
  },
  remaining: { gap: Spacing.two },
  selected: {
    fontSize: Typography.label.fontSize,
    fontWeight: Typography.label.fontWeight,
    lineHeight: Typography.label.lineHeight,
  },
  title: {
    fontSize: Typography.sectionTitle.fontSize,
    fontWeight: Typography.sectionTitle.fontWeight,
    letterSpacing: Typography.sectionTitle.letterSpacing,
    lineHeight: Typography.sectionTitle.lineHeight,
    textTransform: Typography.sectionTitle.textTransform,
  },
  versionLabel: {
    flex: 1,
    fontSize: Typography.caption.fontSize,
    lineHeight: Typography.caption.lineHeight,
  },
  versionRow: {
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'space-between',
    paddingTop: Spacing.one,
  },
  versions: { gap: Spacing.one, marginTop: Spacing.one },
  versionValue: {
    fontSize: Typography.label.fontSize,
    fontWeight: Typography.label.fontWeight,
    lineHeight: Typography.label.lineHeight,
    textAlign: 'right',
  },
});
