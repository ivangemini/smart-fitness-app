import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useDailyActivityFacts } from '@/features/health/useDailyActivityFacts';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { formatEnergyValue, useUnitPreferences } from '@/units';

import { getHomeHealthActivityCopy } from './homeHealthActivityCopy';

const formatDistance = (
  distanceMeters: number | null,
  formatNumber: (value: number) => string,
): string => {
  if (distanceMeters === null) return '—';
  if (distanceMeters >= 1000) {
    return `${formatNumber(Math.round(distanceMeters / 100) / 10)} km`;
  }
  return `${formatNumber(Math.round(distanceMeters))} m`;
};

export function HomeHealthActivitySection() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { energy } = useUnitPreferences();
  const { formatNumber, locale } = useLocalization();
  const copy = getHomeHealthActivityCopy(locale);
  const { availability, connect, facts, hasRead, loading, refresh } =
    useDailyActivityFacts(new Date(), { autoRead: false });

  if (availability === 'unsupported' || availability === 'unavailable') {
    return null;
  }

  const action = availability === 'permission_required' ? connect : refresh;
  const actionLabel =
    availability === 'permission_required' ? copy.connect : copy.load;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>{copy.activity}</Text>
        <Text style={styles.sourceLabel}>{copy.sourceLabel}</Text>
      </View>

      {loading ? <Text style={styles.message}>{copy.loading}</Text> : null}

      {!loading && availability === 'denied' ? (
        <Text style={styles.message}>{copy.denied}</Text>
      ) : null}

      {!loading && availability === 'available' && facts ? (
        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Text style={styles.label}>{copy.steps}</Text>
            <Text style={styles.value}>
              {facts.steps === null ? '—' : formatNumber(facts.steps)}
            </Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.label}>{copy.distance}</Text>
            <Text style={styles.value}>
              {formatDistance(facts.distanceMeters, formatNumber)}
            </Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.label}>{copy.activeEnergy}</Text>
            <Text style={styles.value}>
              {facts.activeEnergyKcal === null
                ? '—'
                : `${formatEnergyValue(facts.activeEnergyKcal, energy)} ${energy}`}
            </Text>
          </View>
        </View>
      ) : null}

      {!loading && availability === 'available' && !hasRead ? (
        <SecondaryButton label={copy.load} onPress={() => void refresh()} />
      ) : null}

      {!loading && availability === 'available' && hasRead && !facts ? (
        <>
          <Text style={styles.message}>{copy.noData}</Text>
          <SecondaryButton label={copy.load} onPress={() => void refresh()} />
        </>
      ) : null}

      {!loading && availability === 'permission_required' ? (
        <SecondaryButton label={actionLabel} onPress={() => void action()} />
      ) : null}
    </View>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
    },
    label: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      fontWeight: Typography.label.fontWeight,
    },
    message: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      lineHeight: 18,
    },
    metric: {
      borderColor: colors.border,
      borderRadius: Radii.medium,
      borderWidth: StyleSheet.hairlineWidth,
      flex: 1,
      gap: 2,
      minWidth: 92,
      padding: Spacing.three,
    },
    metrics: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.two,
    },
    section: {
      gap: Spacing.three,
    },
    sourceLabel: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
    },
    title: {
      color: colors.textPrimary,
      fontSize: Typography.label.fontSize,
      fontWeight: Typography.label.fontWeight,
    },
    value: {
      color: colors.textPrimary,
      fontSize: Typography.bodyEmphasized.fontSize,
      fontWeight: Typography.bodyEmphasized.fontWeight,
    },
  });
