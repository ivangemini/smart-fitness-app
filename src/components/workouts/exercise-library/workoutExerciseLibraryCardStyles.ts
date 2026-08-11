import { StyleSheet } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';
import type { LiquidGlassPalette } from '@/theme/liquidGlass';

export const createWorkoutExerciseLibraryCardStyles = (
  colors: typeof Colors.light,
  glass: LiquidGlassPalette,
) =>
  StyleSheet.create({
    collapsibleHeader: {
      borderCurve: 'continuous',
      borderRadius: 14,
      paddingBottom: Spacing.two,
    },
    collapsibleHeaderPressed: {
      backgroundColor: glass.controlPressedFill,
    },
    clearFiltersButton: {
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderCurve: 'continuous',
      borderRadius: 999,
      borderWidth: StyleSheet.hairlineWidth,
      minHeight: 44,
      justifyContent: 'center',
      paddingHorizontal: Spacing.two,
      paddingVertical: 8,
    },
    clearFiltersButtonPressed: {
      backgroundColor: glass.controlPressedFill,
    },
    clearFiltersText: {
      color: colors.textPrimary,
      fontSize: 12,
      fontWeight: '800',
    },
    customActions: {
      alignItems: 'flex-start',
    },
    customForm: {
      gap: Spacing.two,
    },
    detailBulletDot: {
      color: colors.accent,
      fontSize: 15,
      fontWeight: '900',
      lineHeight: 22,
      width: 16,
    },
    detailBulletList: {
      gap: Spacing.one,
    },
    detailBulletRow: {
      flexDirection: 'row',
      gap: Spacing.one,
    },
    detailBulletText: {
      color: colors.textSecondary,
      flex: 1,
      fontSize: 13,
      lineHeight: 20,
    },
    detailEmpty: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 19,
    },
    exerciseActions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.one,
      justifyContent: 'flex-end',
    },
    exerciseMain: {
      borderCurve: 'continuous',
      borderRadius: 12,
      flex: 1,
      gap: 4,
      minWidth: 0,
    },
    exerciseMainPressed: {
      backgroundColor: glass.controlPressedFill,
    },
    exerciseMeta: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 18,
    },
    exerciseMetaSecondary: {
      color: colors.accent,
      fontSize: 12,
      fontWeight: '700',
      lineHeight: 17,
    },
    exerciseName: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: 16,
      fontWeight: '800',
    },
    exerciseRow: {
      backgroundColor: glass.cardFill,
      borderColor: glass.cardBorder,
      borderCurve: 'continuous',
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      gap: Spacing.two,
      padding: Spacing.three,
    },
    exerciseSectionLabel: {
      color: colors.textSecondary,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    exerciseTitleRow: {
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.one,
    },
    favoriteBadge: {
      color: colors.warning,
      fontSize: 14,
      fontWeight: '900',
    },
    favoriteToggle: {
      alignItems: 'center',
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderCurve: 'continuous',
      borderRadius: 14,
      borderWidth: StyleSheet.hairlineWidth,
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    favoriteToggleActive: {
      backgroundColor: glass.semanticWarningFill,
      borderColor: glass.semanticWarningBorder,
    },
    favoriteToggleLabel: {
      color: colors.textSecondary,
      fontSize: 18,
      fontWeight: '900',
    },
    favoriteToggleLabelActive: {
      color: colors.warning,
    },
    favoriteTogglePressed: {
      backgroundColor: glass.controlPressedFill,
    },
    filterChip: {
      alignItems: 'center',
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderCurve: 'continuous',
      borderRadius: 999,
      borderWidth: StyleSheet.hairlineWidth,
      justifyContent: 'center',
      minHeight: 44,
      paddingHorizontal: Spacing.two,
      paddingVertical: 8,
    },
    filterChipLabel: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '800',
    },
    filterChipLabelSelected: {
      color: glass.accentText,
    },
    filterChipPressed: {
      backgroundColor: glass.controlPressedFill,
    },
    filterChipSelected: {
      backgroundColor: glass.accentFill,
      borderColor: glass.accentBorder,
    },
    filterChipSelectedPressed: {
      backgroundColor: glass.accentPressedFill,
    },
    filterChips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.one,
    },
    filterGroup: {
      gap: Spacing.one,
    },
    filterGroupTitle: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    filterHeaderRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    filterSection: {
      gap: Spacing.two,
    },
    headerContent: {
      flex: 1,
      gap: Spacing.one,
    },
    headerRow: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
    },
    highlight: {
      color: colors.accent,
      fontWeight: '900',
    },
    input: {
      backgroundColor: colors.surfacePrimary,
      borderColor: colors.borderSubtle,
      borderCurve: 'continuous',
      borderRadius: 10,
      borderWidth: StyleSheet.hairlineWidth,
      color: colors.textPrimary,
      fontSize: 16,
      minHeight: 48,
      paddingHorizontal: Spacing.two,
    },
    inputGroup: {
      gap: Spacing.one,
    },
    inputLabel: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '700',
    },
    modalBackdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: colors.overlay,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    pill: {
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderCurve: 'continuous',
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      gap: 2,
      minWidth: 145,
      paddingHorizontal: Spacing.two,
      paddingVertical: Spacing.two,
    },
    pillGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.one,
    },
    pillLabel: {
      color: colors.textSecondary,
      fontSize: 11,
      fontWeight: '800',
      textTransform: 'uppercase',
    },
    pillValue: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '800',
      lineHeight: 20,
    },
    searchHint: {
      color: colors.textSecondary,
      fontSize: 12,
      lineHeight: 18,
    },
    searchSection: {
      gap: Spacing.one,
    },
    sectionBlock: {
      gap: Spacing.two,
    },
    sectionCount: {
      color: colors.accent,
      fontSize: 12,
      fontWeight: '900',
    },
    sectionHeaderRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    sectionHeading: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '800',
    },
    sectionHint: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 19,
    },
    sectionList: {
      gap: Spacing.two,
    },
    sectionTitle: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '800',
    },
    sheet: {
      backgroundColor: glass.elevatedFill,
      borderColor: glass.cardBorder,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderWidth: StyleSheet.hairlineWidth,
      maxHeight: '92%',
      paddingHorizontal: Spacing.three,
      paddingTop: Spacing.two,
    },
    sheetContent: {
      gap: Spacing.two,
      paddingBottom: Spacing.four,
    },
    sheetFavorite: {
      alignItems: 'center',
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderCurve: 'continuous',
      borderRadius: 14,
      borderWidth: StyleSheet.hairlineWidth,
      height: 46,
      justifyContent: 'center',
      width: 46,
    },
    sheetFavoriteActive: {
      backgroundColor: glass.semanticWarningFill,
      borderColor: glass.semanticWarningBorder,
    },
    sheetFavoriteLabel: {
      color: colors.textSecondary,
      fontSize: 18,
      fontWeight: '900',
    },
    sheetFavoriteLabelActive: {
      color: colors.warning,
    },
    sheetFavoritePressed: {
      backgroundColor: glass.controlPressedFill,
    },
    sheetFooter: {
      gap: Spacing.two,
      paddingTop: Spacing.one,
    },
    sheetHandle: {
      alignSelf: 'center',
      backgroundColor: colors.borderSubtle,
      borderRadius: 999,
      height: 4,
      marginBottom: Spacing.two,
      width: 72,
    },
    sheetHeader: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
      marginBottom: Spacing.two,
    },
    sheetHeaderContent: {
      flex: 1,
      gap: 2,
    },
    sheetSubtitle: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 18,
    },
    sheetTitle: {
      color: colors.textPrimary,
      fontSize: 22,
      fontWeight: '900',
      lineHeight: 28,
    },
    similarActions: {
      flexDirection: 'row',
      gap: Spacing.one,
    },
    similarList: {
      gap: Spacing.two,
    },
    similarMain: {
      borderCurve: 'continuous',
      borderRadius: 10,
      flex: 1,
      gap: 2,
    },
    similarMainPressed: {
      backgroundColor: glass.controlPressedFill,
    },
    similarMeta: {
      color: colors.textSecondary,
      fontSize: 12,
      lineHeight: 17,
    },
    similarName: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '800',
    },
    similarRow: {
      alignItems: 'center',
      backgroundColor: glass.cardFill,
      borderColor: glass.cardBorder,
      borderCurve: 'continuous',
      borderRadius: 14,
      borderWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: Spacing.two,
      padding: Spacing.two,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 18,
    },
    toggle: {
      color: colors.accent,
      fontSize: 24,
      fontWeight: '700',
    },
  });
