import { StyleSheet } from 'react-native';

import { Colors, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import type { LiquidGlassPalette } from '@/theme/liquidGlass';

export const createSocialNotificationScreenStyles = (colors: typeof Colors.light, glass: LiquidGlassPalette) =>
  StyleSheet.create({
    body: { color: colors.textSecondary, fontSize: Typography.body.fontSize, lineHeight: Typography.body.lineHeight },
    cardTitle: { color: colors.textPrimary, fontSize: Typography.cardTitle.fontSize, fontWeight: Typography.cardTitle.fontWeight, lineHeight: Typography.cardTitle.lineHeight },
    container: { alignSelf: 'center', gap: Spacing.four, maxWidth: MaxContentWidth, width: '100%' },
    content: { flexGrow: 1, minWidth: 0, paddingHorizontal: Spacing.four, width: '100%' },
    eyebrow: { color: colors.accent, fontSize: Typography.caption.fontSize, fontWeight: '800', letterSpacing: 1.2 },
    headerCopy: { flex: 1, gap: Spacing.one, minWidth: 0 },
    headerRow: { alignItems: 'center', flexDirection: 'row', gap: Spacing.three },
    itemSeparator: { height: Spacing.one },
    listFooter: { alignSelf: 'center', gap: Spacing.two, marginTop: Spacing.four, maxWidth: MaxContentWidth, width: '100%' },
    listHeaderWithItems: { marginBottom: Spacing.two },
    message: { color: colors.textPrimary, flex: 1, fontSize: Typography.callout.fontSize, lineHeight: Typography.callout.lineHeight },
    notificationCard: { alignSelf: 'center', gap: Spacing.one, maxWidth: MaxContentWidth, minHeight: 68, paddingVertical: Spacing.two, width: '100%' },
    notificationHeader: { alignItems: 'center', flexDirection: 'row', gap: Spacing.two },
    notificationMeta: { alignItems: 'center', flexDirection: 'row', gap: Spacing.two },
    notificationPressed: { backgroundColor: glass.controlPressedFill, opacity: 0.78 },
    readLabel: { display: 'none' },
    screen: { backgroundColor: colors.background, flex: 1, width: '100%' },
    subtitle: { color: colors.textSecondary, flexShrink: 1, fontSize: Typography.body.fontSize, lineHeight: Typography.body.lineHeight },
    timestamp: { color: colors.textSecondary, fontSize: Typography.caption.fontSize, lineHeight: Typography.caption.lineHeight },
    title: { color: colors.textPrimary, flexShrink: 1, fontSize: Typography.screenTitle.fontSize, fontWeight: Typography.screenTitle.fontWeight, letterSpacing: Typography.screenTitle.letterSpacing, lineHeight: Typography.screenTitle.lineHeight },
    unreadDot: { backgroundColor: colors.accent, borderRadius: 5, height: 9, width: 9 },
    unreadLabel: { display: 'none' },
    username: { color: colors.textPrimary, fontWeight: '800' },
  });

export type SocialNotificationScreenStyles = ReturnType<typeof createSocialNotificationScreenStyles>;
