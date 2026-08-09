import { StyleSheet } from 'react-native';

import { Colors, Radii, Spacing } from '@/constants/theme';
import type { LiquidGlassPalette } from '@/theme/liquidGlass';

export const createSafetyRecoveryWeeklyTrendStyles = (
  colors: typeof Colors.light,
  glass: LiquidGlassPalette,
) =>
  StyleSheet.create({
    chartContent: {
      alignItems: 'flex-end',
      gap: Spacing.two,
      paddingRight: Spacing.one,
    },
    chartHelp: {
      color: colors.textMuted,
      fontSize: 12,
      lineHeight: 18,
    },
    chartPair: {
      alignItems: 'flex-end',
      flexDirection: 'row',
      gap: 4,
      height: 100,
    },
    chartViewport: {
      marginHorizontal: -Spacing.one,
      paddingHorizontal: Spacing.one,
    },
    detailActions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.one,
    },
    detailCard: {
      borderRadius: Radii.medium,
      gap: Spacing.two,
      padding: Spacing.three,
    },
    detailHeader: {
      gap: 2,
    },
    detailLabel: {
      color: colors.textMuted,
      fontSize: 12,
      lineHeight: 18,
    },
    detailTitle: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '800',
      lineHeight: 20,
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 19,
    },
    emptyTrackContent: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    emptyTrackLabel: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: '800',
    },
    header: {
      gap: 2,
    },
    historyButton: {
      alignItems: 'center',
      backgroundColor: glass.semanticAccentFill,
      borderColor: glass.accentBorder,
      borderRadius: Radii.pill,
      borderWidth: StyleSheet.hairlineWidth,
      justifyContent: 'center',
      minHeight: 44,
      paddingHorizontal: Spacing.three,
    },
    historyButtonLabel: {
      color: colors.accent,
      fontSize: 12,
      fontWeight: '800',
      lineHeight: 17,
    },
    legend: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.two,
    },
    legendDot: {
      borderRadius: 999,
      height: 8,
      width: 8,
    },
    legendItem: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 5,
    },
    legendLabel: {
      color: colors.textSecondary,
      fontSize: 11,
      lineHeight: 16,
    },
    loadBar: {
      backgroundColor: colors.chartPrimary,
      borderRadius: Radii.small,
      width: '100%',
    },
    loadLabel: {
      color: colors.textSecondary,
      fontSize: 10,
      fontWeight: '800',
      lineHeight: 14,
      textAlign: 'center',
    },
    loadLegendBar: {
      backgroundColor: colors.chartPrimary,
      borderRadius: 999,
      height: 9,
      width: 4,
    },
    loadTrack: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: Radii.small,
      height: 96,
      justifyContent: 'flex-end',
      overflow: 'hidden',
      width: 8,
    },
    periodChip: {
      alignItems: 'center',
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderRadius: Radii.pill,
      borderWidth: StyleSheet.hairlineWidth,
      justifyContent: 'center',
      minHeight: 44,
      paddingHorizontal: Spacing.three,
    },
    periodChipLabel: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '800',
      lineHeight: 18,
    },
    periodChipLabelSelected: {
      color: colors.accent,
    },
    periodChipSelected: {
      backgroundColor: glass.semanticAccentFill,
      borderColor: glass.accentBorder,
    },
    periodHelp: {
      color: colors.textMuted,
      fontSize: 12,
      lineHeight: 18,
    },
    periodLabel: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '800',
      lineHeight: 18,
    },
    periodRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.one,
    },
    periodSection: {
      gap: Spacing.one,
    },
    pressed: {
      backgroundColor: glass.controlPressedFill,
    },
    statusSegment: {
      minHeight: 2,
      width: '100%',
    },
    statusTrack: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: Radii.small,
      height: 96,
      overflow: 'hidden',
      width: 24,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 19,
    },
    summaryItem: {
      flex: 1,
      gap: 2,
    },
    summaryLabel: {
      color: colors.textMuted,
      fontSize: 12,
      lineHeight: 18,
    },
    summaryRow: {
      flexDirection: 'row',
      gap: Spacing.three,
    },
    summaryValue: {
      color: colors.textPrimary,
      fontSize: 22,
      fontWeight: '900',
      lineHeight: 28,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '800',
      lineHeight: 24,
    },
    weekColumn: {
      alignItems: 'center',
      borderColor: 'transparent',
      borderRadius: Radii.small,
      borderWidth: StyleSheet.hairlineWidth,
      gap: 3,
      paddingVertical: 3,
      width: 44,
    },
    weekColumnSelected: {
      backgroundColor: glass.semanticAccentFill,
      borderColor: glass.accentBorder,
    },
    weekCount: {
      color: colors.textPrimary,
      fontSize: 10,
      fontVariant: ['tabular-nums'],
      fontWeight: '800',
      lineHeight: 14,
      textAlign: 'center',
    },
    weekLabel: {
      color: colors.textMuted,
      fontSize: 10,
      lineHeight: 14,
      textAlign: 'center',
      width: '100%',
    },
  });
