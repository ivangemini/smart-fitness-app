import { StyleSheet } from 'react-native';

import { Colors, MaxContentWidth, Radii, Spacing, Typography } from '@/constants/theme';

export const createSocialRelationshipListsStyles = (colors: typeof Colors.dark) =>
  StyleSheet.create({
    actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
    avatar: { borderRadius: 26, height: 52, width: 52 },
    avatarFallback: {
      alignItems: 'center',
      backgroundColor: colors.backgroundSelected,
      borderColor: colors.borderSubtle,
      borderRadius: 26,
      borderWidth: StyleSheet.hairlineWidth,
      height: 52,
      justifyContent: 'center',
      width: 52,
    },
    avatarInitial: { color: colors.textPrimary, fontSize: 20, fontWeight: '800' },
    backButton: {
      alignItems: 'center',
      borderColor: colors.borderSubtle,
      borderRadius: Radii.large,
      borderWidth: StyleSheet.hairlineWidth,
      flexShrink: 0,
      height: 44,
      justifyContent: 'center',
      width: 44,
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
    identityCopy: { flex: 1, gap: Spacing.one },
    identityRow: { alignItems: 'center', flexDirection: 'row', gap: Spacing.three },
    itemCard: { gap: Spacing.three },
    pressed: { opacity: 0.72 },
    profileLink: { gap: Spacing.three },
    screen: { backgroundColor: colors.background, flex: 1 },
    subtitle: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    tab: {
      alignItems: 'center',
      borderColor: colors.borderSubtle,
      borderRadius: Radii.large,
      borderWidth: StyleSheet.hairlineWidth,
      flexGrow: 1,
      justifyContent: 'center',
      minHeight: 44,
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
    },
    tabActive: { backgroundColor: colors.backgroundSelected, borderColor: colors.accent },
    tabLabel: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      fontWeight: '700',
    },
    tabLabelActive: { color: colors.textPrimary },
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
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    visibility: {
      color: colors.accent,
      fontSize: Typography.caption.fontSize,
      fontWeight: '800',
      letterSpacing: 0.6,
    },
  });

export type SocialRelationshipListsStyles = ReturnType<
  typeof createSocialRelationshipListsStyles
>;
