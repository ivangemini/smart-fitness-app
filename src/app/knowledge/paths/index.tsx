import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { getKnowledgePathCopy } from '@/features/knowledge/knowledgePathCopy';
import { useKnowledgePaths } from '@/features/knowledge/useKnowledgePaths';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

export default function KnowledgePathsScreen() {
  const { colors } = useAppTheme();
  const { locale } = useLocalization();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const copy = getKnowledgePathCopy(locale);
  const paths = useKnowledgePaths(locale);

  return (
    <FlatList
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.two,
          paddingBottom: insets.bottom + Spacing.six,
        },
      ]}
      data={paths.paths}
      keyExtractor={(item) => item.pathVersionId}
      ListHeaderComponent={
        <View style={styles.header}>
          <LiquidGlassIconButton
            accessibilityLabel={copy.back}
            Icon={ChevronLeft}
            onPress={() => router.back()}
          />
          <Text style={styles.title}>{copy.pathsTitle}</Text>
          <Text style={styles.body}>{copy.pathsSubtitle}</Text>
        </View>
      }
      ListEmptyComponent={
        <AppCard>
          <Text style={styles.cardTitle}>
            {paths.loading
              ? copy.loading
              : paths.error
                ? copy.errorTitle
                : copy.emptyTitle}
          </Text>
          {!paths.loading ? (
            <Text style={styles.body}>
              {paths.error ? copy.errorBody : copy.emptyBody}
            </Text>
          ) : null}
          {paths.error ? (
            <AppButton label={copy.retry} onPress={paths.reload} />
          ) : null}
        </AppCard>
      }
      renderItem={({ item }) => (
        <AppCard>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.body}>{item.summary}</Text>
          <Text style={styles.meta}>{copy.steps(item.stepCount)}</Text>
          <AppButton
            label={copy.openPath}
            onPress={() =>
              router.push({
                pathname: '/knowledge/paths/[slug]',
                params: { slug: item.slug },
              })
            }
          />
        </AppCard>
      )}
    />
  );
}

const createStyles = (colors: Record<string, string>) =>
  StyleSheet.create({
    content: {
      flexGrow: 1,
      width: '100%',
      maxWidth: MaxContentWidth,
      alignSelf: 'center',
      paddingHorizontal: Spacing.four,
      gap: Spacing.four,
      backgroundColor: colors.background,
    },
    header: { gap: Spacing.three, alignItems: 'flex-start' },
    title: { ...Typography.screenTitle, color: colors.textPrimary },
    cardTitle: { ...Typography.cardTitle, color: colors.textPrimary },
    body: { ...Typography.body, color: colors.textSecondary },
    meta: { ...Typography.caption, color: colors.textMuted },
  });
