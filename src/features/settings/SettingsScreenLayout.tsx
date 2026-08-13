import type { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { Colors, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

type SettingsScreenLayoutProps = {
  children: ReactNode;
  subtitle?: string;
  title: string;
};

export function SettingsScreenLayout({ children, subtitle, title }: SettingsScreenLayoutProps) {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: insets.bottom + Spacing.eight,
          paddingTop: insets.top + Spacing.four,
        },
      ]}
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <LiquidGlassIconButton
            accessibilityLabel={t('common.back')}
            Icon={ChevronLeft}
            onPress={() => router.back()}
          />
          <View style={styles.headerCopy}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
        </View>
        {children}
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    container: { gap: Spacing.four, maxWidth: MaxContentWidth, width: '100%' },
    content: { alignItems: 'center', paddingHorizontal: Spacing.four },
    headerCopy: { flex: 1, gap: Spacing.one, minWidth: 0 },
    headerRow: { alignItems: 'flex-start', flexDirection: 'row', gap: Spacing.three },
    screen: { backgroundColor: colors.background, flex: 1 },
    subtitle: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    title: {
      color: colors.textPrimary,
      fontSize: Typography.screenTitle.fontSize,
      fontWeight: Typography.screenTitle.fontWeight,
      letterSpacing: Typography.screenTitle.letterSpacing,
      lineHeight: Typography.screenTitle.lineHeight,
    },
  });
