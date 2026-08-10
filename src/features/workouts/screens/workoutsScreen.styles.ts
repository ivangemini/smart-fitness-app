import { StyleSheet } from 'react-native';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

export const createTopTabsStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    label: {
      color: colors.textMuted,
      flexShrink: 1,
      fontSize: 23,
      fontWeight: '900',
      lineHeight: 29,
    },
    labelSelected: {
      color: colors.textPrimary,
      fontSize: 28,
      lineHeight: 34,
    },
    row: {
      alignItems: 'baseline',
      flexDirection: 'row',
      flexShrink: 1,
      gap: Spacing.three,
      minWidth: 0,
    },
  });

export const createRoutineCardStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    card: {
      flex: 1,
      gap: 5,
      minWidth: 0,
    },
    cover: {
      alignItems: 'center',
      aspectRatio: 1,
      borderCurve: 'continuous',
      borderRadius: 8,
      justifyContent: 'center',
      width: '100%',
    },
    coverLabel: {
      color: '#FFFFFF',
      fontSize: 28,
      fontWeight: '500',
    },
    pressed: {
      opacity: 0.72,
    },
    subtitle: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: 16,
      lineHeight: 20,
    },
    title: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: 18,
      fontWeight: '900',
      lineHeight: 22,
    },
  });

export const createProgramRowStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    addIconBox: {
      borderRadius: 999,
    },
    copy: {
      flex: 1,
      minWidth: 0,
    },
    iconBox: {
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondary,
      borderCurve: 'continuous',
      borderRadius: 4,
      height: 58,
      justifyContent: 'center',
      width: 58,
    },
    pressed: {
      opacity: 0.72,
    },
    row: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.two,
      minHeight: 72,
    },
    subtitle: {
      color: colors.textMuted,
      flexShrink: 1,
      fontSize: 17,
      lineHeight: 21,
    },
    title: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: 19,
      fontWeight: '900',
      lineHeight: 24,
    },
  });

export const createModalStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    actions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.two,
    },
    input: {
      backgroundColor: colors.backgroundSecondary,
      borderColor: colors.borderSubtle,
      borderCurve: 'continuous',
      borderRadius: 14,
      borderWidth: StyleSheet.hairlineWidth,
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '700',
      minHeight: 52,
      paddingHorizontal: Spacing.three,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    modalAction: {
      flexBasis: 140,
      flexGrow: 1,
    },
    modalHelperText: {
      color: colors.textMuted,
      flexShrink: 1,
      fontSize: 14,
      fontWeight: '700',
      lineHeight: 19,
    },
    overlay: {
      alignItems: 'center',
      backgroundColor: colors.overlay,
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: Spacing.three,
    },
    panel: {
      gap: Spacing.three,
      maxWidth: 520,
      padding: Spacing.four,
      width: '100%',
    },
    title: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: 22,
      fontWeight: '900',
      lineHeight: 28,
    },
  });

export const createWorkoutsScreenStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      maxWidth: MaxContentWidth,
      width: '100%',
    },
    content: {
      alignItems: 'center',
      flexGrow: 1,
      paddingHorizontal: Spacing.three,
      paddingTop: Spacing.two,
    },
    emptyProgramText: {
      color: colors.textMuted,
      flexShrink: 1,
      fontSize: 15,
      fontWeight: '700',
      lineHeight: 20,
      paddingVertical: Spacing.one,
    },
    footer: {
      left: 0,
      paddingHorizontal: Spacing.three,
      position: 'absolute',
      right: 0,
    },
    footerButton: {
      alignSelf: 'flex-end',
      maxWidth: 360,
      width: '100%',
    },
    grid: {
      flexDirection: 'row',
      gap: Spacing.four,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
      marginBottom: Spacing.three,
    },
    horizontalCard: {
      width: 190,
    },
    horizontalList: {
      gap: Spacing.three,
      paddingRight: Spacing.three,
    },
    loadingLabel: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: 14,
      fontWeight: '800',
    },
    loadingState: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    programList: {
      gap: Spacing.two,
    },
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
    sectionStack: {
      gap: Spacing.four,
    },
    sectionTitle: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: 20,
      fontWeight: '900',
      lineHeight: 25,
    },
  });
