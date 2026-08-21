import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { getKnowledgePathCopy } from '@/features/knowledge/knowledgePathCopy';
import { resolveKnowledgePathStepLearningView } from '@/features/knowledge/knowledgePathLearningPolicy';
import { useKnowledgePath } from '@/features/knowledge/useKnowledgePath';
import { useKnowledgePathLearningStates } from '@/features/knowledge/useKnowledgePathLearningStates';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

export default function KnowledgePathDetailScreen() {
  const params = useLocalSearchParams<{ slug?: string | string[] }>();
  const slug = Array.isArray(params.slug)
    ? (params.slug[0] ?? null)
    : (params.slug ?? null);
  const { colors } = useAppTheme();
  const { locale } = useLocalization();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const copy = getKnowledgePathCopy(locale);
  const result = useKnowledgePath({ slug, locale });
  const versionIds = useMemo(
    () => result.path?.steps.map((step) => step.article.articleVersionId) ?? [],
    [result.path],
  );
  const learning = useKnowledgePathLearningStates(versionIds);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.two,
          paddingBottom: insets.bottom + Spacing.six,
        },
      ]}
    >
      <LiquidGlassIconButton
        accessibilityLabel={copy.back}
        Icon={ChevronLeft}
        onPress={() => router.back()}
      />
      {result.loading ? (
        <AppCard>
          <Text style={styles.cardTitle}>{copy.loading}</Text>
        </AppCard>
      ) : result.error || !result.path ? (
        <AppCard>
          <Text style={styles.cardTitle}>{copy.errorTitle}</Text>
          <Text style={styles.body}>{copy.errorBody}</Text>
          <AppButton label={copy.retry} onPress={result.reload} />
        </AppCard>
      ) : (
        <>
          <View style={styles.hero}>
            <Text style={styles.title}>{result.path.title}</Text>
            <Text style={styles.body}>{result.path.summary}</Text>
            <Text style={styles.meta}>{copy.steps(result.path.stepCount)}</Text>
          </View>
          {result.path.steps.map((step) => {
            const state = learning.statesByVersionId.get(
              step.article.articleVersionId,
            );
            const learningView = resolveKnowledgePathStepLearningView({
              available: learning.available,
              loading: learning.loading,
              state: state?.state ?? null,
            });
            return (
              <AppCard key={step.article.articleVersionId}>
                <Text style={styles.stepNumber}>{step.position}</Text>
                <Text style={styles.cardTitle}>{step.article.title}</Text>
                <Text style={styles.body}>{step.article.summary}</Text>
                <Text style={styles.meta}>{copy.stateLabel(learningView)}</Text>
                <AppButton
                  label={copy.openLesson}
                  onPress={() =>
                    router.push({
                      pathname: '/knowledge/[slug]',
                      params: {
                        slug: step.article.slug,
                        expectedArticleVersionId:
                          step.article.articleVersionId,
                      },
                    })
                  }
                />
              </AppCard>
            );
          })}
        </>
      )}
    </ScrollView>
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
    hero: { gap: Spacing.three },
    title: { ...Typography.screenTitle, color: colors.textPrimary },
    cardTitle: { ...Typography.cardTitle, color: colors.textPrimary },
    body: { ...Typography.body, color: colors.textSecondary },
    meta: { ...Typography.caption, color: colors.textMuted },
    stepNumber: { ...Typography.caption, color: colors.accent },
  });
