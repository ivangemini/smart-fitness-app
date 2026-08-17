import { StyleSheet } from 'react-native';

import { Colors, MaxContentWidth, Radii, Spacing, Typography } from '@/constants/theme';
import type { LiquidGlassPalette } from '@/theme/liquidGlass';

export const createSocialRelationshipListsStyles = (
  colors: typeof Colors.light,
  glass: LiquidGlassPalette,
) =>
  StyleSheet.create({
    actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
    avatar: { borderRadius: 26, height: 52, width: 52 },
    avatarFallback: {
      alignItems: 'center',
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderRadius: 26,
      borderWidth: StyleSheet.hairlineWidth,
      height: 52,
      justifyContent: 'center',
      width: 52,
    },
    avatarInitial: { color: colors.textPrimary, fontSize: 20, fontWeight: '800' },
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
      flexShrink: 1,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
      minWidth: 0,
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
    itemCard: { gap: Spacing.three },
    listFooter: {
      gap: Spacing.two,
      marginTop: Spacing.four,
      maxWidth: MaxContentWidth,
      width: '100%',
    },
    listHeaderWithItems: { marginBottom: Spacing.four },
    listItem: { maxWidth: MaxContentWidth, width: '100%' },
    listSeparator: { height: Spacing.four },
    profileLink: { gap: Spacing.three },
    profilePressed: { opacity: 0.72 },
    screen: { backgroundColor: colors.background, flex: 1 },
    subtitle: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    tab: {
      alignItems: 'center',
      backgroundColor: glass.controlFill,
      borderColor: glass.controlBorder,
      borderCurve: 'continuous',
      borderRadius: Radii.large,
      borderWidth: StyleSheet.hairlineWidth,
      flexGrow: 1,
      justifyContent: 'center',
      minHeight: 44,
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
    },
    tabActive: {
      backgroundColor: glass.accentFill,
      borderColor: glass.accentBorder,
    },
    tabActivePressed: {
      backgroundColor: glass.accentPressedFill,
    },
    tabLabel: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      fontWeight: '700',
    },
    tabLabelActive: { color: glass.accentText },
    tabPressed: {
      backgroundColor: glass.controlPressedFill,
    },
    tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
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
      flexShrink: 1,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      minWidth: 0,
    },
    visibility: {
      color: colors.accent,
      flexShrink: 1,
      fontSize: Typography.caption.fontSize,
      fontWeight: '800',
      letterSpacing: 0.6,
      minWidth: 0,
    },
  });

export type SocialRelationshipListsStyles = ReturnType<
  typeof createSocialRelationshipListsStyles
>;
