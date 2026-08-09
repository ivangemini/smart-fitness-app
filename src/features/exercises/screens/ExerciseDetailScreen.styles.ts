import { StyleSheet } from 'react-native';

import { Colors, MaxContentWidth, Radii, Spacing, Typography } from '@/constants/theme';

export const createExerciseDetailStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    actionButton: { flex: 1 },
    actionRow: { flexDirection: 'row', gap: Spacing.three },
    attribution: {
      color: colors.textSecondary,
      fontSize: 11,
      fontWeight: '700',
      lineHeight: 16,
      textAlign: 'center',
    },
    bodyText: {
      color: colors.textPrimary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    cardTitle: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
      marginBottom: Spacing.two,
    },
    centeredState: {
      flex: 1,
      gap: Spacing.four,
      justifyContent: 'center',
      paddingHorizontal: Spacing.four,
    },
    container: {
      alignSelf: 'center',
      gap: Spacing.four,
      maxWidth: MaxContentWidth,
      width: '100%',
    },
    content: { paddingHorizontal: Spacing.four },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.three,
    },
    headerSide: {
      flexShrink: 0,
      width: 44,
    },
    list: { gap: Spacing.two, marginBottom: Spacing.three },
    media: {
      aspectRatio: 1.35,
      backgroundColor: colors.surfaceSecondary,
      borderRadius: Radii.medium,
      width: '100%',
    },
    mediaCard: { padding: Spacing.two },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.three,
    },
    muscleMaps: { flexDirection: 'row', gap: Spacing.three },
    playButton: { alignSelf: 'center' },
    screen: { flex: 1 },
    secondaryText: {
      color: colors.textSecondary,
      fontSize: Typography.callout.fontSize,
      lineHeight: Typography.callout.lineHeight,
    },
    setRow: {
      alignItems: 'center',
      borderTopColor: colors.divider,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: Spacing.two,
    },
    stack: { gap: Spacing.four },
    title: {
      color: colors.textPrimary,
      flex: 1,
      fontSize: Typography.screenTitle.fontSize,
      fontWeight: Typography.screenTitle.fontWeight,
      lineHeight: Typography.screenTitle.lineHeight,
      textAlign: 'center',
    },
  });

export type ExerciseDetailStyles = ReturnType<typeof createExerciseDetailStyles>;
