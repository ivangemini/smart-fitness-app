import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ExternalLink } from 'lucide-react-native';
import { useMemo } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { PublishedKnowledgeSource } from '@/api/knowledge';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { MaxContentWidth, Radii, Spacing, Typography } from '@/constants/theme';
import { KnowledgeMarkdown } from '@/features/knowledge/KnowledgeMarkdown';
import {
  getKnowledgeCategoryLabel,
  getKnowledgeCopy,
  getKnowledgeFormatLabel,
} from '@/features/knowledge/knowledgeCopy';
import { useKnowledgeArticle } from '@/features/knowledge/useKnowledgeArticle';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

export default function KnowledgeArticleScreen() {
  const params = useLocalSearchParams<{ slug?: string | string[] }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] ?? null : params.slug ?? null;
  const { colors } = useAppTheme();
  const { locale } = useLocalization();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const copy = getKnowledgeCopy(locale);
  const { article, error, loading, reload } = useKnowledgeArticle({ slug, locale });

  const sources = useMemo(() => {
    const byId = new Map<string, PublishedKnowledgeSource>();
    for (const claim of article?.claims ?? []) {
      for (const source of claim.sources) byId.set(source.id, source);
    }
    return [...byId.values()];
  }, [article]);

  const openSource = async (source: PublishedKnowledgeSource) => {
    const target = source.url ?? (source.doi ? `https://doi.org/${source.doi}` : null);
    if (!target) return;
    await Linking.openURL(target);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.two,
          paddingBottom: insets.bottom + Spacing.six,
        },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.topRow}>
        <LiquidGlassIconButton
          accessibilityLabel={copy.backToLibrary}
          icon={<ChevronLeft color={colors.textPrimary} size={22} />}
          onPress={() => router.back()}
        />
      </View>

      {loading ? (
        <AppCard>
          <Text style={styles.cardTitle}>{copy.loading}</Text>
        </AppCard>
      ) : error || !article ? (
        <AppCard>
          <Text style={styles.cardTitle}>{copy.errorTitle}</Text>
          <Text style={styles.body}>{copy.errorBody}</Text>
          <AppButton label={copy.retry} onPress={reload} />
        </AppCard>
      ) : (
        <>
          <View style={styles.hero}>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>
                {getKnowledgeCategoryLabel(locale, article.category)}
              </Text>
              <Text style={styles.meta}>{getKnowledgeFormatLabel(locale, article.format)}</Text>
              <Text style={styles.meta}>{copy.publishedVersion(article.version)}</Text>
            </View>
            <Text selectable style={styles.title}>
              {article.title}
            </Text>
            <Text selectable style={styles.summary}>
              {article.summary}
            </Text>
          </View>

          <AppCard>
            <KnowledgeMarkdown markdown={article.bodyMarkdown} />
          </AppCard>

          <AppCard>
            <Text style={styles.cardTitle}>{copy.evidenceTitle}</Text>
            <View style={styles.stack}>
              {article.claims.map((claim) => (
                <View key={claim.id} style={styles.claimRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text selectable style={styles.body}>
                    {claim.text}
                  </Text>
                </View>
              ))}
            </View>
          </AppCard>

          <AppCard>
            <Text style={styles.cardTitle}>{copy.sourcesTitle}</Text>
            <View style={styles.stack}>
              {sources.map((source) => (
                <Pressable
                  accessibilityRole="link"
                  key={source.id}
                  onPress={() => void openSource(source)}
                  style={({ pressed }) => [styles.sourceRow, pressed && styles.pressed]}
                >
                  <View style={styles.sourceText}>
                    <Text selectable style={styles.sourceTitle}>
                      {source.title}
                    </Text>
                    <Text selectable style={styles.meta}>
                      {source.publisher}
                    </Text>
                  </View>
                  <ExternalLink color={colors.textMuted} size={18} />
                </Pressable>
              ))}
            </View>
          </AppCard>

          <AppCard>
            <Text style={styles.cardTitle}>{copy.quizTitle}</Text>
            <Text style={styles.body}>{copy.quizCount(article.quizItems.length)}</Text>
            <Text style={styles.body}>{copy.quizBody}</Text>
          </AppCard>
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
    topRow: {
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    hero: {
      gap: Spacing.three,
    },
    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.two,
    },
    meta: {
      ...Typography.caption,
      color: colors.textMuted,
    },
    title: {
      ...Typography.screenTitle,
      color: colors.textPrimary,
    },
    summary: {
      ...Typography.body,
      color: colors.textSecondary,
    },
    cardTitle: {
      ...Typography.cardTitle,
      color: colors.textPrimary,
    },
    body: {
      ...Typography.body,
      color: colors.textSecondary,
      flexShrink: 1,
    },
    stack: {
      gap: Spacing.three,
    },
    claimRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Spacing.two,
    },
    bullet: {
      ...Typography.body,
      color: colors.accent,
    },
    sourceRow: {
      minHeight: 52,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.three,
      borderRadius: Radii.medium,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderSubtle,
      backgroundColor: colors.surfaceSecondary,
      padding: Spacing.three,
    },
    sourceText: {
      flex: 1,
      gap: Spacing.one,
    },
    sourceTitle: {
      ...Typography.callout,
      color: colors.textPrimary,
    },
    pressed: {
      opacity: 0.7,
    },
  });
