import { StyleSheet } from 'react-native';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { resolveLiquidGlassPalette } from '@/theme/liquidGlass';

export const createStyles = (colors: typeof Colors.light) => {
  const glass = resolveLiquidGlassPalette(colors === Colors.dark ? 'dark' : 'light');

  return StyleSheet.create({
    addExercisesButton: {
      alignItems: 'center',
      backgroundColor: glass.accentFill,
      borderColor: glass.accentBorder,
      borderCurve: 'continuous',
      borderRadius: 999,
      borderWidth: StyleSheet.hairlineWidth,
      minHeight: 58,
      justifyContent: 'center',
      marginTop: Spacing.two,
      paddingHorizontal: Spacing.three,
    },
    addExercisesButtonPressed: {
      backgroundColor: glass.accentPressedFill,
    },
    addExercisesLabel: {
      color: glass.accentText,
      fontSize: 16,
      fontWeight: '700',
    },
    container: {
      maxWidth: MaxContentWidth,
      width: '100%',
    },
    content: {
      alignItems: 'center',
      paddingHorizontal: Spacing.four,
      paddingTop: 0,
    },
    emptyState: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '700',
    },
    emptyTitle: {
      color: colors.textPrimary,
      fontSize: 20,
      fontWeight: '900',
    },
    emptyWorkoutCard: {
      backgroundColor: colors.surfacePrimary,
      borderColor: colors.borderSubtle,
      borderCurve: 'continuous',
      borderRadius: 24,
      borderWidth: StyleSheet.hairlineWidth,
      gap: 6,
      marginBottom: 8,
      padding: 12,
    },
    emptyWorkoutSubtitle: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 19,
    },
    emptyWorkoutTitle: {
      color: colors.textPrimary,
      fontSize: 22,
      fontWeight: '900',
    },
    loadingLabel: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '700',
    },
    loadingState: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      gap: Spacing.two,
      padding: Spacing.three,
    },
    overflowAction: {
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderCurve: 'continuous',
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      minHeight: 48,
      justifyContent: 'center',
      paddingHorizontal: Spacing.three,
    },
    overflowActionLabel: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '800',
    },
    overflowActionPressed: {
      backgroundColor: glass.controlPressedFill,
    },
    overflowActions: {
      gap: Spacing.one,
    },
    overflowBackdrop: {
      backgroundColor: colors.overlay,
      flex: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: Spacing.three,
      paddingTop: 8,
    },
    overflowCancel: {
      alignItems: 'center',
      borderCurve: 'continuous',
      borderRadius: 16,
      minHeight: 48,
      justifyContent: 'center',
      marginTop: Spacing.one,
    },
    overflowCancelLabel: {
      color: colors.textSecondary,
      fontSize: 15,
      fontWeight: '800',
    },
    overflowCancelPressed: {
      backgroundColor: glass.controlPressedFill,
    },
    overflowDangerAction: {
      backgroundColor: glass.controlFill,
      borderColor: colors.error,
      borderWidth: StyleSheet.hairlineWidth,
    },
    overflowDangerActionPressed: {
      backgroundColor: colors.errorSoft,
    },
    overflowDangerLabel: {
      color: colors.error,
    },
    overflowMessage: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '700',
      lineHeight: 18,
      marginBottom: Spacing.one,
    },
    overflowSheet: {
      gap: 8,
      padding: 12,
    },
    overflowSheetHitArea: {
      borderCurve: 'continuous',
      borderRadius: 24,
    },
    overflowTitle: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '900',
    },
    replacementBackdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
    },
    replacementCopy: {
      flex: 1,
      minWidth: 0,
    },
    replacementHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.two,
      paddingBottom: Spacing.three,
    },
    replacementIcon: {
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondary,
      borderCurve: 'continuous',
      borderRadius: 12,
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    replacementIconLabel: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '900',
    },
    replacementList: {
      flexShrink: 1,
    },
    replacementListContent: {
      paddingBottom: Spacing.two,
    },
    replacementRow: {
      alignItems: 'center',
      borderCurve: 'continuous',
      borderRadius: 16,
      flexDirection: 'row',
      gap: Spacing.three,
      minHeight: 64,
    },
    replacementRowMeta: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '700',
      marginTop: 3,
    },
    replacementRowPressed: {
      backgroundColor: glass.controlPressedFill,
    },
    replacementRowTitle: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '900',
    },
    replacementSheet: {
      maxHeight: '78%',
      overflow: 'hidden',
      paddingHorizontal: Spacing.three,
      paddingTop: Spacing.three,
      width: '100%',
    },
    replacementTitle: {
      color: colors.textPrimary,
      flex: 1,
      fontSize: 22,
      fontWeight: '900',
      minWidth: 0,
    },
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    sessionFooterActions: {
      gap: Spacing.two,
      paddingVertical: Spacing.six,
      width: '100%',
    },
    testGifButton: {
      alignItems: 'center',
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderCurve: 'continuous',
      borderRadius: 999,
      borderWidth: StyleSheet.hairlineWidth,
      justifyContent: 'center',
      minHeight: 44,
      paddingHorizontal: Spacing.three,
    },
    testGifButtonPressed: {
      backgroundColor: glass.controlPressedFill,
    },
    testGifLabel: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '800',
    },
    workoutSheetRow: {
      alignItems: 'center',
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderCurve: 'continuous',
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      gap: Spacing.two,
      minHeight: 58,
      paddingHorizontal: Spacing.three,
    },
    workoutSheetRowAccessory: {
      alignItems: 'center',
      flexShrink: 0,
      justifyContent: 'center',
    },
    workoutSheetRowDestructive: {
      backgroundColor: glass.controlFill,
      borderColor: colors.error,
      borderWidth: StyleSheet.hairlineWidth,
    },
    workoutSheetRowDestructivePressed: {
      backgroundColor: colors.errorSoft,
    },
    workoutSheetRowLabel: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '800',
      lineHeight: 20,
    },
    workoutSheetRowLabelContainer: {
      flex: 1,
      minWidth: 0,
    },
    workoutSheetRowLabelDestructive: {
      color: colors.error,
    },
    workoutSheetRowPressed: {
      backgroundColor: glass.controlPressedFill,
    },
  });
};
