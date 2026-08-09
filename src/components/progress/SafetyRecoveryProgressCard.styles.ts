import { StyleSheet } from 'react-native';

import { Colors, Radii, Spacing } from '@/constants/theme';
import type { LiquidGlassPalette } from '@/theme/liquidGlass';

export const createSafetyRecoveryProgressCardStyles = (
  colors: typeof Colors.light,
  glass: LiquidGlassPalette,
) =>
  StyleSheet.create({
    comparisonCell: {
      flexBasis: '46%',
      gap: 2,
    },
    comparisonDetail: {
      color: colors.textMuted,
      fontSize: 11,
      lineHeight: 16,
    },
    comparisonGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.three,
      marginTop: Spacing.one,
    },
    comparisonLabel: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '700',
      lineHeight: 18,
    },
    comparisonValue: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '900',
      lineHeight: 24,
    },
    contextNote: {
      color: colors.textMuted,
      fontSize: 12,
      lineHeight: 18,
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 19,
    },
    header: {
      gap: 2,
    },
    loadTrendValue: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '800',
      lineHeight: 22,
    },
    movementCopy: {
      flex: 1,
      gap: 2,
      minWidth: 0,
    },
    movementLabel: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '800',
      lineHeight: 20,
    },
    movementList: {
      gap: Spacing.two,
    },
    movementRow: {
      alignItems: 'center',
      borderColor: colors.divider,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
      paddingTop: Spacing.two,
    },
    movementShare: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '800',
      lineHeight: 19,
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
    periodChipSelectedPressed: {
      backgroundColor: glass.accentPressedFill,
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
    section: {
      gap: Spacing.one,
    },
    sectionHelp: {
      color: colors.textMuted,
      fontSize: 12,
      lineHeight: 18,
    },
    sectionTitle: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '800',
      lineHeight: 21,
    },
    statusCopy: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.two,
    },
    statusDelta: {
      color: colors.textMuted,
      fontSize: 11,
      lineHeight: 16,
      textAlign: 'right',
    },
    statusDot: {
      borderRadius: 999,
      height: 8,
      width: 8,
    },
    statusLabel: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '700',
      lineHeight: 20,
    },
    statusList: {
      gap: Spacing.two,
      marginTop: Spacing.one,
    },
    statusRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
    },
    statusValue: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '800',
      lineHeight: 19,
      textAlign: 'right',
    },
    statusValueCopy: {
      alignItems: 'flex-end',
      flexShrink: 1,
      gap: 1,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 19,
    },
    summaryCell: {
      flexBasis: '46%',
      gap: 2,
    },
    summaryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.three,
    },
    summaryLabel: {
      color: colors.textMuted,
      fontSize: 12,
      lineHeight: 18,
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
  });
