import { StyleSheet } from 'react-native';

import { Colors, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import type { LiquidGlassPalette } from '@/theme/liquidGlass';

export const createSocialPublicProfileStyles = (
  colors: typeof Colors.dark,
  glass: LiquidGlassPalette,
) =>
  StyleSheet.create({
    actionStack: { gap: Spacing.two },
    avatar: { borderRadius: 36, height: 72, width: 72 },
    avatarFallback: {
      alignItems: 'center',
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderRadius: 36,
      borderWidth: StyleSheet.hairlineWidth,
      height: 72,
      justifyContent: 'center',
      width: 72,
    },
    avatarInitial: {
      color: colors.textPrimary,
      fontSize: 28,
      fontWeight: '800',
    },
    bio: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
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
    container: { gap: Spacing.four, maxWidth: MaxContentWidth, width: '100%' },
    content: {
      alignItems: 'center',
      flexGrow: 1,
      paddingHorizontal: Spacing.four,
    },
    displayName: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
    eyebrow: {
      color: colors.accent,
      fontSize: Typography.caption.fontSize,
      fontWeight: '800',
      letterSpacing: 1.2,
    },
    headerCopy: { flex: 1, gap: Spacing.one, minWidth: 0 },
    headerRow: { alignItems: 'flex-start', flexDirection: 'row', gap: Spacing.three },
    identityCopy: { flex: 1, gap: Spacing.one, minWidth: 0 },
    identityRow: { alignItems: 'center', flexDirection: 'row', gap: Spacing.three },
    relationshipLabel: {
      color: colors.textPrimary,
      fontSize: Typography.label.fontSize,
      fontWeight: Typography.label.fontWeight,
      lineHeight: Typography.label.lineHeight,
    },
    screen: { backgroundColor: colors.background, flex: 1 },
    title: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: Typography.screenTitle.fontSize,
      fontWeight: Typography.screenTitle.fontWeight,
      letterSpacing: Typography.screenTitle.letterSpacing,
      lineHeight: Typography.screenTitle.lineHeight,
    },
    username: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    visibilityBadge: {
      color: colors.accent,
      fontSize: Typography.caption.fontSize,
      fontWeight: '800',
      letterSpacing: 0.8,
    },
  });

export type SocialPublicProfileStyles = ReturnType<
  typeof createSocialPublicProfileStyles
>;
