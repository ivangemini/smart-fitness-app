import { StyleSheet } from 'react-native';

import { Colors, MaxContentWidth, Radii, Spacing, Typography } from '@/constants/theme';
import type { LiquidGlassPalette } from '@/theme/liquidGlass';

export const createFilterChipStyles = (
  colors: typeof Colors.light,
  glass: LiquidGlassPalette,
) =>
  StyleSheet.create({
    chip: {
      alignItems: 'center',
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderRadius: Radii.pill,
      borderWidth: StyleSheet.hairlineWidth,
      justifyContent: 'center',
      minHeight: 44,
      paddingHorizontal: Spacing.three,
    },
    chipPressed: {
      backgroundColor: glass.controlPressedFill,
    },
    chipSelected: {
      backgroundColor: glass.accentSoft,
      borderColor: glass.accentBorder,
    },
    chipSelectedPressed: {
      backgroundColor: glass.controlPressedFill,
      borderColor: glass.accentBorder,
    },
    label: {
      color: colors.textSecondary,
      fontSize: Typography.label.fontSize,
      fontWeight: Typography.label.fontWeight,
      lineHeight: Typography.label.lineHeight,
    },
    labelSelected: {
      color: colors.accent,
    },
  });

export const createFilterRowStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    group: {
      gap: Spacing.one,
    },
    row: {
      gap: Spacing.one,
      paddingRight: Spacing.two,
    },
    title: {
      color: colors.textSecondary,
      fontSize: Typography.label.fontSize,
      fontWeight: Typography.label.fontWeight,
      lineHeight: Typography.label.lineHeight,
    },
  });

export const createWorkoutHistoryScreenStyles = (
  colors: typeof Colors.light,
  glass: LiquidGlassPalette,
) =>
  StyleSheet.create({
    bodyText: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    cardHeader: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
    },
    cardHeaderCopy: {
      flex: 1,
      gap: 2,
      minWidth: 0,
    },
    cardTitle: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
    chevron: {
      color: colors.textMuted,
      fontSize: 24,
      lineHeight: 24,
    },
    clearButton: {
      alignItems: 'center',
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderRadius: Radii.pill,
      borderWidth: StyleSheet.hairlineWidth,
      flexShrink: 0,
      justifyContent: 'center',
      minHeight: 44,
      paddingHorizontal: Spacing.two,
    },
    clearLabel: {
      color: colors.accent,
      fontSize: Typography.label.fontSize,
      fontWeight: '800',
      lineHeight: Typography.label.lineHeight,
    },
    container: {
      gap: Spacing.four,
      maxWidth: MaxContentWidth,
      width: '100%',
    },
    content: {
      alignItems: 'center',
      paddingHorizontal: Spacing.three,
      paddingTop: Spacing.three,
    },
    controlPressed: {
      backgroundColor: glass.controlPressedFill,
    },
    filtersCard: {
      gap: Spacing.three,
    },
    filtersHeader: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
    },
    filtersHeaderCopy: {
      flex: 1,
      gap: 2,
    },
    header: {
      alignItems: 'center',
      backgroundColor: colors.background,
      flexDirection: 'row',
      gap: Spacing.one,
      paddingBottom: Spacing.two,
      paddingHorizontal: Spacing.two,
    },
    headerCopy: {
      flex: 1,
      minWidth: 0,
    },
    helperText: {
      color: colors.textMuted,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    historyCard: {
      gap: Spacing.three,
    },
    historyCardPressed: {
      backgroundColor: glass.controlPressedFill,
    },
    list: {
      gap: Spacing.three,
    },
    metaText: {
      color: colors.textMuted,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    metricCell: {
      flexBasis: '46%',
      gap: 2,
    },
    metricLabel: {
      color: colors.textMuted,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    metricValue: {
      color: colors.textPrimary,
      fontSize: Typography.bodyStrong.fontSize,
      fontWeight: Typography.bodyStrong.fontWeight,
      lineHeight: Typography.bodyStrong.lineHeight,
    },
    metricsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.three,
    },
    openLabel: {
      color: colors.textSecondary,
      fontSize: Typography.callout.fontSize,
      fontWeight: Typography.callout.fontWeight,
      lineHeight: Typography.callout.lineHeight,
    },
    openRow: {
      alignItems: 'center',
      borderColor: colors.borderSubtle,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: Spacing.two,
    },
    resetButton: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: glass.accentSoft,
      borderColor: glass.accentBorder,
      borderRadius: Radii.medium,
      borderWidth: StyleSheet.hairlineWidth,
      justifyContent: 'center',
      minHeight: 44,
      paddingHorizontal: Spacing.three,
    },
    resetLabel: {
      color: colors.accent,
      fontSize: Typography.label.fontSize,
      fontWeight: '800',
      lineHeight: Typography.label.lineHeight,
    },
    safetyBadge: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: Radii.pill,
      flexShrink: 1,
      fontSize: Typography.caption.fontSize,
      fontWeight: '800',
      overflow: 'hidden',
      paddingHorizontal: Spacing.two,
      paddingVertical: Spacing.one,
      textAlign: 'right',
    },
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    summaryCell: {
      flex: 1,
      gap: 2,
    },
    summaryLabel: {
      color: colors.textMuted,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    summaryRow: {
      flexDirection: 'row',
      gap: Spacing.four,
    },
    summaryValue: {
      color: colors.textPrimary,
      fontSize: 28,
      fontWeight: '900',
      lineHeight: 34,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 24,
      fontWeight: '900',
      lineHeight: 30,
    },
  });
