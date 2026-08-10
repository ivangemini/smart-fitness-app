import { Text, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { useLocalization } from '@/localization';
import { getUserLimitationsCopy } from '@/localization/userLimitationsCopy';
import { getWorkoutHistoryCopy } from '@/localization/workoutHistoryCopy';
import type { AppThemeContextValue } from '@/theme/AppThemeProvider';
import type {
  WorkoutSafetyIssue,
  WorkoutSafetyMetadata,
  WorkoutSafetyRestriction,
} from '@/types';

import type { WorkoutHistoryDetailStyles } from './workoutHistoryDetailScreen.styles';

type AppThemeColors = AppThemeContextValue['colors'];

const safetyColor = (metadata: WorkoutSafetyMetadata, colors: AppThemeColors): string => {
  if (metadata.reviewStatus === 'ready') return colors.success;
  if (metadata.reviewStatus === 'blocked') return colors.error;
  return colors.warning;
};

export function WorkoutHistorySafetySummaryCard({
  colors,
  metadata,
  styles,
}: {
  colors: AppThemeColors;
  metadata?: WorkoutSafetyMetadata;
  styles: WorkoutHistoryDetailStyles;
}) {
  const { formatDate, formatNumber, locale } = useLocalization();
  const copy = getWorkoutHistoryCopy(locale);
  const formatTimestamp = (value: string | null | undefined): string => {
    if (!value || !Number.isFinite(Date.parse(value))) return copy.unknownDate;
    return formatDate(value, { dateStyle: 'medium', timeStyle: 'short' });
  };

  if (!metadata) {
    return (
      <AppCard>
        <Text style={styles.cardTitle}>{copy.safetyContext}</Text>
        <Text style={styles.bodyText}>{copy.noSafetyContext}</Text>
        <Text style={styles.disclaimer}>{copy.currentReadinessDisclaimer}</Text>
      </AppCard>
    );
  }

  const accentColor = safetyColor(metadata, colors);
  const status = copy.safetyLabel(metadata.reviewStatus);
  const loadCeiling =
    metadata.recommendedLoadMultiplier === null
      ? copy.notRecorded
      : `${formatNumber(Math.round(metadata.recommendedLoadMultiplier * 100), {
          maximumFractionDigits: 0,
        })}%`;
  const gateLabel =
    metadata.gateKind === 'review_missing'
      ? copy.reviewMissing
      : metadata.gateKind === 'review_stale'
        ? copy.reviewStale
        : metadata.gateKind === 'confirmation_required'
          ? copy.confirmationRequired
          : copy.readyWithoutConfirmation;

  return (
    <AppCard style={metadata.reviewStatus === 'blocked' ? styles.blockedCard : undefined}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerCopy}>
          <Text style={styles.cardTitle}>{copy.safetyContext}</Text>
          <Text style={styles.bodyText}>{copy.immutableContext}</Text>
        </View>
        <Text style={[styles.statusBadge, { color: accentColor }]}>{status}</Text>
      </View>

      <View style={styles.metricGrid}>
        <Metric label={copy.reviewedLoadCeiling} value={loadCeiling} styles={styles} />
        <Metric
          label={copy.restrictionsShown}
          value={formatNumber(metadata.restrictions.length, { maximumFractionDigits: 0 })}
          styles={styles}
        />
      </View>

      <View style={styles.infoStack}>
        <InfoRow label={copy.gateState} value={gateLabel} styles={styles} />
        <InfoRow
          label={copy.acknowledgement}
          value={
            metadata.acknowledgementRequired
              ? metadata.explicitlyAcknowledged
                ? copy.explicitlyConfirmed
                : copy.notConfirmed
              : copy.notRequired
          }
          styles={styles}
        />
        <InfoRow
          label={copy.capturedAt}
          value={formatTimestamp(metadata.acknowledgedAt)}
          styles={styles}
        />
        <InfoRow
          label={copy.reviewRun}
          value={metadata.reviewRunId ? copy.yes : copy.noReviewRun}
          styles={styles}
        />
      </View>
    </AppCard>
  );
}

export function WorkoutHistorySafetyRestrictionRow({
  colors,
  index,
  restriction,
  styles,
}: {
  colors: AppThemeColors;
  index: number;
  restriction: WorkoutSafetyRestriction;
  styles: WorkoutHistoryDetailStyles;
}) {
  const { formatNumber, locale } = useLocalization();
  const copy = getWorkoutHistoryCopy(locale);
  const limitationCopy = getUserLimitationsCopy(locale);
  const limitationLabel = (labels: Record<string, string>, value: string) =>
    labels[value] ?? copy.unknownValue;

  return (
    <AppCard>
      {index === 0 ? <Text style={styles.sectionTitle}>{copy.restrictionsBefore}</Text> : null}
      <View style={styles.listRow}>
        <View style={styles.listCopy}>
          <Text style={styles.listTitle}>
            {limitationLabel(
              limitationCopy.bodyRegionLabels as Record<string, string>,
              restriction.bodyRegion,
            )}{' '}
            ·{' '}
            {limitationLabel(
              limitationCopy.sideLabels as Record<string, string>,
              restriction.side,
            )}
          </Text>
          <Text style={styles.bodyText}>
            {copy.actionLabel(restriction.action)} ·{' '}
            {copy.affectedLoad(
              formatNumber(Math.round(restriction.maximumLoadMultiplier * 100), {
                maximumFractionDigits: 0,
              }),
            )}
          </Text>
          {restriction.movementPatterns.length > 0 ? (
            <Text style={styles.metaText}>
              {copy.movements}:{' '}
              {restriction.movementPatterns
                .map((value) =>
                  limitationLabel(
                    limitationCopy.movementLabels as Record<string, string>,
                    value,
                  ),
                )
                .join(', ')}
            </Text>
          ) : null}
        </View>
        <Text style={[styles.rowBadge, { color: colors.warning }]}>
          {copy.severityLabel(restriction.severity)}
        </Text>
      </View>
    </AppCard>
  );
}

export function WorkoutHistorySafetyIssueRow({
  colors,
  index,
  issue,
  styles,
}: {
  colors: AppThemeColors;
  index: number;
  issue: WorkoutSafetyIssue;
  styles: WorkoutHistoryDetailStyles;
}) {
  const { locale } = useLocalization();
  const copy = getWorkoutHistoryCopy(locale);

  return (
    <AppCard>
      {index === 0 ? <Text style={styles.sectionTitle}>{copy.findingsBefore}</Text> : null}
      <View style={styles.listRow}>
        <View style={styles.listCopy}>
          <Text style={styles.listTitle}>{copy.findingTitle}</Text>
          <Text style={styles.bodyText}>{copy.findingFallback}</Text>
        </View>
        <Text
          style={[
            styles.rowBadge,
            { color: issue.severity === 'hard_block' ? colors.error : colors.warning },
          ]}>
          {copy.severityLabel(issue.severity)}
        </Text>
      </View>
    </AppCard>
  );
}

export function WorkoutHistorySafetyDisclaimer({
  styles,
}: {
  styles: WorkoutHistoryDetailStyles;
}) {
  const { locale } = useLocalization();
  const copy = getWorkoutHistoryCopy(locale);

  return (
    <AppCard>
      <Text style={styles.disclaimer}>{copy.historicalDisclaimer}</Text>
    </AppCard>
  );
}

function Metric({
  label,
  styles,
  value,
}: {
  label: string;
  styles: WorkoutHistoryDetailStyles;
  value: string;
}) {
  return (
    <View style={styles.metricCell}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function InfoRow({
  label,
  styles,
  value,
}: {
  label: string;
  styles: WorkoutHistoryDetailStyles;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.metaText}>{label}</Text>
      <Text selectable style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}
