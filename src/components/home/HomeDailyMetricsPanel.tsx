import { ChevronDown, ChevronUp, Dumbbell, Scale, Utensils } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  LayoutAnimation,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { LiquidGlassSurface } from '@/components/ui/LiquidGlassSurface';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useDailySteps } from '@/features/health/useDailySteps';
import type { HomeSocialCopy } from '@/features/home/homeSocialCopy';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import {
  resolveLiquidGlassPalette,
  type LiquidGlassPalette,
} from '@/theme/liquidGlass';

type MacroMetric = {
  current: string;
  label: string;
  progress: number;
  target: string;
};

type HomeDailyMetricsPanelProps = {
  caloriesCurrent: string;
  caloriesProgress: number;
  caloriesTarget: string;
  copy: HomeSocialCopy;
  energyUnitLabel: string;
  macros: MacroMetric[];
  onAddFood: () => void;
  onLogWeight: () => void;
  onWorkoutPress: () => void;
  recoveryLabel: string;
  stepsValue: string;
  streakLabel: string;
  weightLabel: string;
  workoutActionLabel: string;
  workoutStatus: string;
  workoutTitle: string;
};

const clampProgress = (value: number) => Math.max(0, Math.min(1, value));

function ProgressLine({
  label,
  progress,
  styles,
  value,
}: {
  label: string;
  progress: number;
  styles: ReturnType<typeof createStyles>;
  value: string;
}) {
  const width = `${Math.round(clampProgress(progress) * 100)}%` as `${number}%`;

  return (
    <View style={styles.progressBlock}>
      <View style={styles.progressHeader}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width }]} />
      </View>
    </View>
  );
}

export function HomeDailyMetricsPanel({
  caloriesCurrent,
  caloriesProgress,
  caloriesTarget,
  copy,
  energyUnitLabel,
  macros,
  onAddFood,
  onLogWeight,
  onWorkoutPress,
  recoveryLabel,
  stepsValue,
  streakLabel,
  weightLabel,
  workoutActionLabel,
  workoutStatus,
  workoutTitle,
}: HomeDailyMetricsPanelProps) {
  const { colors, resolvedAppearance } = useAppTheme();
  const { formatNumber } = useLocalization();
  const dailySteps = useDailySteps();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(() => createStyles(colors, glass), [colors, glass]);
  const [expanded, setExpanded] = useState(false);
  const displayedStepsValue =
    dailySteps.availability === 'available' && dailySteps.aggregate
      ? formatNumber(dailySteps.aggregate.steps)
      : stepsValue;

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((current) => !current);
  };

  const Chevron = expanded ? ChevronUp : ChevronDown;

  return (
    <LiquidGlassSurface blur radius={28} style={styles.surface} variant="elevated">
      <Pressable
        accessibilityLabel={expanded ? copy.collapseMetrics : copy.expandMetrics}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={toggleExpanded}
        style={({ pressed }) => [styles.toggle, pressed && styles.pressed]}>
        <View style={styles.toggleHeader}>
          <Text style={styles.todayLabel}>{copy.today}</Text>
          <Chevron color={colors.textSecondary} size={20} strokeWidth={2} />
        </View>

        <View style={styles.compactMetrics}>
          <View style={styles.calorieMetric}>
            <Text style={styles.heroValue}>{caloriesCurrent}</Text>
            <Text style={styles.heroLabel}>
              {energyUnitLabel} · {caloriesTarget}
            </Text>
          </View>
          <View style={styles.macroStrip}>
            {macros.map((macro) => (
              <View key={macro.label} style={styles.compactMetric}>
                <Text style={styles.compactValue}>{macro.current}</Text>
                <Text style={styles.compactLabel}>{macro.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>{copy.steps}</Text>
            <Text style={styles.statusValue}>{displayedStepsValue}</Text>
          </View>
          <View style={styles.statusDivider} />
          <View style={styles.workoutCopy}>
            <Text style={styles.statusLabel}>{workoutStatus}</Text>
            <Text numberOfLines={1} style={styles.workoutTitle}>
              {workoutTitle}
            </Text>
          </View>
        </View>
      </Pressable>

      {expanded ? (
        <View style={styles.expandedContent}>
          <View style={styles.separator} />

          <ProgressLine
            label={copy.calories}
            progress={caloriesProgress}
            styles={styles}
            value={`${caloriesCurrent} / ${caloriesTarget} ${energyUnitLabel}`}
          />

          <Text style={styles.sectionLabel}>{copy.macros}</Text>
          <View style={styles.macroDetails}>
            {macros.map((macro) => (
              <ProgressLine
                key={macro.label}
                label={macro.label}
                progress={macro.progress}
                styles={styles}
                value={`${macro.current} / ${macro.target} g`}
              />
            ))}
          </View>

          <View style={styles.contextGrid}>
            <View style={styles.contextMetric}>
              <Text style={styles.detailLabel}>{copy.currentWeight}</Text>
              <Text style={styles.contextValue}>{weightLabel}</Text>
            </View>
            <View style={styles.contextMetric}>
              <Text style={styles.detailLabel}>{copy.recovery}</Text>
              <Text style={styles.contextValue}>{recoveryLabel}</Text>
            </View>
            <View style={styles.contextMetric}>
              <Text style={styles.detailLabel}>{copy.streak}</Text>
              <Text style={styles.contextValue}>{streakLabel}</Text>
            </View>
          </View>

          <PrimaryButton
            icon={Dumbbell}
            label={workoutActionLabel}
            onPress={onWorkoutPress}
          />
          <View style={styles.secondaryActions}>
            <SecondaryButton
              icon={Utensils}
              label={copy.addFood}
              onPress={onAddFood}
              style={styles.secondaryButton}
            />
            <SecondaryButton
              icon={Scale}
              label={copy.logWeight}
              onPress={onLogWeight}
              style={styles.secondaryButton}
            />
          </View>
        </View>
      ) : null}
    </LiquidGlassSurface>
  );
}

const createStyles = (colors: typeof Colors.light, glass: LiquidGlassPalette) =>
  StyleSheet.create({
    calorieMetric: { flexGrow: 1, minWidth: 92 },
    compactLabel: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      fontWeight: Typography.label.fontWeight,
      textAlign: 'center',
    },
    compactMetric: { alignItems: 'center', minWidth: 42 },
    compactMetrics: {
      alignItems: 'flex-end',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.three,
      justifyContent: 'space-between',
    },
    compactValue: {
      color: colors.textPrimary,
      fontSize: Typography.bodyEmphasized.fontSize,
      fontWeight: Typography.bodyEmphasized.fontWeight,
    },
    contextGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
    contextMetric: {
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderCurve: 'continuous',
      borderRadius: Radii.medium,
      borderWidth: StyleSheet.hairlineWidth,
      flex: 1,
      gap: 2,
      minWidth: 92,
      padding: Spacing.three,
    },
    contextValue: {
      color: colors.textPrimary,
      fontSize: Typography.bodyEmphasized.fontSize,
      fontWeight: Typography.bodyEmphasized.fontWeight,
    },
    detailLabel: { color: colors.textSecondary, fontSize: Typography.caption.fontSize },
    detailValue: {
      color: colors.textPrimary,
      fontSize: Typography.caption.fontSize,
      fontWeight: Typography.label.fontWeight,
    },
    expandedContent: { gap: Spacing.three, padding: Spacing.four, paddingTop: 0 },
    heroLabel: { color: colors.textSecondary, fontSize: Typography.caption.fontSize },
    heroValue: {
      color: colors.textPrimary,
      fontSize: 24,
      fontWeight: '800',
      lineHeight: 28,
    },
    macroDetails: { gap: Spacing.two },
    macroStrip: { flexDirection: 'row', gap: Spacing.three },
    pressed: { opacity: 0.78 },
    progressBlock: { gap: Spacing.one },
    progressFill: {
      backgroundColor: colors.accent,
      borderRadius: 999,
      height: '100%',
    },
    progressHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
    },
    progressTrack: {
      backgroundColor: glass.controlFill,
      borderRadius: 999,
      height: 5,
      overflow: 'hidden',
    },
    secondaryActions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
    secondaryButton: { flexGrow: 1, minWidth: 132 },
    sectionLabel: {
      color: colors.textSecondary,
      fontSize: Typography.label.fontSize,
      fontWeight: Typography.label.fontWeight,
    },
    separator: { backgroundColor: glass.controlBorder, height: StyleSheet.hairlineWidth },
    statusDivider: {
      alignSelf: 'stretch',
      backgroundColor: glass.controlBorder,
      width: StyleSheet.hairlineWidth,
    },
    statusItem: { gap: 2, minWidth: 64 },
    statusLabel: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      fontWeight: Typography.label.fontWeight,
    },
    statusRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.three,
      minHeight: 44,
    },
    statusValue: {
      color: colors.textPrimary,
      fontSize: Typography.callout.fontSize,
      fontWeight: Typography.bodyEmphasized.fontWeight,
    },
    surface: { overflow: 'hidden' },
    todayLabel: {
      color: colors.textSecondary,
      fontSize: Typography.label.fontSize,
      fontWeight: Typography.label.fontWeight,
      textTransform: 'uppercase',
    },
    toggle: { gap: Spacing.three, minHeight: 44, padding: Spacing.four },
    toggleHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    workoutCopy: { flex: 1, gap: 2, minWidth: 0 },
    workoutTitle: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: Typography.callout.fontSize,
      fontWeight: Typography.bodyEmphasized.fontWeight,
    },
  });