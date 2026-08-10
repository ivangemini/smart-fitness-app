import { StyleSheet } from 'react-native';

import {
  Colors,
  MaxContentWidth,
  Radii,
  Spacing,
  Typography,
} from '@/constants/theme';
import type { LiquidGlassPalette } from '@/theme/liquidGlass';

export const createSocialNotificationScreenStyles = (
  colors: typeof Colors.light,
  glass: LiquidGlassPalette,
) =>
  StyleSheet.create({
    body: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    cardTitle: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
    container: {
      gap: Spacing.four,
      maxWidth: MaxContentWidth,
      width: '100%',
    },
    content: {
      alignItems: 'center',
      flexGrow: 1,
      paddingHorizontal: Spacing.four,
    },
    eyebrow: {
      color: colors.accent,
      fontSize: Typography.caption.fontSize,
      fontWeight: '800',
      letterSpacing: 1.2,
    },
    headerCopy: {
      flex: 1,
      gap: Spacing.one,
      minWidth: 0,
    },
    headerRow: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: Spacing.three,
    },
    itemSeparator: {
      height: Spacing.four,
    },
    listFooter: {
      gap: Spacing.two,
      marginTop: Spacing.four,
      maxWidth: MaxContentWidth,
      width: '100%',
    },
    listHeaderWithItems: {
      marginBottom: Spacing.four,
    },
    message: {
      color: colors.textPrimary,
      flex: 1,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    notificationCard: {
      backgroundColor: glass.cardFill,
      borderColor: glass.cardBorder,
      borderCurve: 'continuous',
      borderRadius: Radii.large,
      borderWidth: StyleSheet.hairlineWidth,
      gap: Spacing.three,
      maxWidth: MaxContentWidth,
      padding: Spacing.four,
      width: '100%',
    },
    notificationHeader: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: Spacing.three,
    },
    notificationMeta: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.two,
      justifyContent: 'space-between',
    },
    notificationPressed: {
      backgroundColor: glass.controlPressedFill,
    },
    readLabel: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      fontWeight: '700',
      lineHeight: Typography.caption.lineHeight,
    },
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
    subtitle: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    timestamp: {
      color: colors.textSecondary,
      flex: 1,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    title: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: Typography.screenTitle.fontSize,
      fontWeight: Typography.screenTitle.fontWeight,
      letterSpacing: Typography.screenTitle.letterSpacing,
      lineHeight: Typography.screenTitle.lineHeight,
    },
    unreadDot: {
      backgroundColor: colors.accent,
      borderRadius: 5,
      height: 10,
      marginTop: 6,
      width: 10,
    },
    unreadLabel: {
      color: colors.accent,
      fontSize: Typography.caption.fontSize,
      fontWeight: '800',
      lineHeight: Typography.caption.lineHeight,
    },
    username: {
      color: colors.accent,
      fontWeight: '800',
    },
  });

export type SocialNotificationScreenStyles = ReturnType<
  typeof createSocialNotificationScreenStyles
>;
