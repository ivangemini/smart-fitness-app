import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type {
  PublishedKnowledgeArticle,
  PublishedKnowledgeSource,
} from '@/api/knowledge';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { Colors, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { KnowledgeMarkdown } from '@/features/knowledge/KnowledgeMarkdown';
import { getKnowledgeCopy } from '@/features/knowledge/knowledgeCopy';
import { useKnowledgeApi } from '@/features/knowledge/useKnowledgeApi';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

const readSlug = (value: string | string[] | undefined): string | null => {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (
    !candidate ||
    candidate.length > 120 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate)
  ) {
    return null;
  }
  return candidate;
};

const uniqueSources = (article: PublishedKnowledgeArticle): PublishedKnowledgeSource[] => {
  const sources = new Map<string, PublishedKnowledgeSource>();
  for (const claim of article.claims) {
    for (const source of claim.sources) sources.set(source.id, source);
  }
  return [...sources.values()];
};

export default function KnowledgeArticleScreen() {
  const params = useLocalSearchParams<{ slug?: string | string[] }>();
  const slug = readSlug(params.slug);
  const { colors } = useAppTheme();
  const { locale } = useLocalization();
  const { isAuthenticated, ready: authReady } = useAuthSession();
  const api = useKnowledgeApi();
  const insets = useSafeAreaInsets();
  const copy = getKnowledgeCopy(locale);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [article, setArticle] = useState<PublishedKnowledgeArticle | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (!authReady || !isAuthenticated || !slug) {
      setArticle(null);
      setLoadState('idle');
      return;
    }
    let cancelled = false;
    setLoadState('loading');
    void api
      .getArticle({ slug, locale })
      .then((nextArticle) => {
        if (cancelled) return;
        setArticle(nextArticle);
        setLoadState('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setArticle(null);
        setLoadState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [api, authReady, isAuthenticated, locale, reloadToken, slug]);

  const sources = useMemo(() => (article ? uniqueSources(article) : []), [article]);
  const retry = useCallback(() => setReloadToken((value) => value + 1), []);
  const publishedLabel = article
    ? new Date(article.publishedAt).toLocaleDateString(
        locale === 'ru' ? 'ru-RU' : 'en-US',
      )
    : null;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: insets.bottom + Spacing.eight,
          paddingTop: insets.top + Spacing.four,
        },
      ]}
      showsVerticalScrollIndicator={false}
      style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <LiquidGlassIconButton
            accessibilityLabel={copy.back}
            Icon={ChevronLeft}
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>{copy.libraryTitle}</Text>
        </View>

        {!authReady || !isAuthenticated ? (
          <AppCard>
            <Text style={styles.cardTitle}>{copy.signInTitle}</Text>
            <Text style={styles.secondary}>{copy.signInBody}</Text>
          </AppCard>
        ) : null}
        {authReady && isAuthenticated && !slug ? (
          <AppCard>
            <Text style={styles.cardTitle}>{copy.errorTitle}</Text>
            <Text style={styles.secondary}>{copy.articleUnavailable}</Text>
          </AppCard>
        ) : null}
        {loadState === 'loading' ? (
          <AppCard>
            <Text style={styles.secondary}>{copy.librarySubtitle}</Text>
          </AppCard>
        ) : null}
        {loadState === 'error' ? (
          <AppCard>
            <Text style={styles.cardTitle}>{copy.errorTitle}</Text>
            <Text style={styles.secondary}>{copy.articleUnavailable}</Text>
            <AppButton label={copy.retry} onPress={retry} variant="secondary" />
          </AppCard>
        ) : null}

        {loadState === 'ready' && article ? (
          <>
            <View style={styles.articleHeader}>
              <View style={styles.metaRow}>
                <Text style={styles.meta}>{copy.category(article.category)}</Text>
                <Text style={styles.meta}>{copy.format(article.format)}</Text>
              </View>
              <Text selectable style={styles.title}>
                {article.title}
              </Text>
              <Text selectable style={styles.summary}>
                {article.summary}
              </Text>
              <Text selectable style={styles.version}>
                {copy.version(article.version)} · {copy.riskTier(article.riskTier)}
              </Text>
              {publishedLabel ? (
                <Text selectable style={styles.version}>
                  {copy.published}: {publishedLabel}
                </Text>
              ) : null}
            </View>

            <AppCard>
              <KnowledgeMarkdown markdown={article.bodyMarkdown} />
            </AppCard>

            <AppCard>
              <Text style={styles.cardTitle}>{copy.evidence}</Text>
              {article.claims.map((claim) => (
                <View key={claim.id} style={styles.evidenceItem}>
                  <Text selectable style={styles.body}>
                    {claim.text}
                  </Text>
                  <Text style={styles.meta}>
                    {copy.evidenceStrength(claim.evidenceStrength)}
                  </Text>
                </View>
              ))}
            </AppCard>

            <AppCard>
              <Text style={styles.cardTitle}>{copy.sources}</Text>
              {sources.length > 0 ? (
                sources.map((source) => (
                  <View key={source.id} style={styles.sourceItem}>
                    <Text selectable style={styles.body}>
                      {source.title}
                    </Text>
                    <Text selectable style={styles.secondary}>
                      {source.publisher} · {copy.sourceType(source.sourceType)}
                    </Text>
                    {source.doi ? (
                      <Text selectable style={styles.sourceLocator}>
                        DOI: {source.doi}
                      </Text>
                    ) : null}
                    {source.url ? (
                      <Text selectable style={styles.sourceLocator}>
                        {source.url}
                      </Text>
                    ) : null}
                  </View>
                ))
              ) : (
                <Text style={styles.secondary}>{copy.noSources}</Text>
              )}
            </AppCard>

            <AppCard>
              <Text style={styles.cardTitle}>{copy.quizPreview}</Text>
              <Text style={styles.secondary}>
                {copy.quizReady(article.quizItems.length)}
              </Text>
              <Text style={styles.secondary}>{copy.quizLater}</Text>
            </AppCard>
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    articleHeader: { gap: Spacing.two },
    body: {
      color: colors.textPrimary,
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
      gap: Spacing.three,
      maxWidth: MaxContentWidth,
      width: '100%',
    },
    content: {
      alignItems: 'center',
      flexGrow: 1,
      paddingHorizontal: Spacing.three,
    },
    evidenceItem: { gap: Spacing.one },
    headerRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.three,
    },
    headerTitle: {
      color: colors.textPrimary,
      flex: 1,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
    meta: {
      color: colors.textMuted,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
    screen: { backgroundColor: colors.background, flex: 1 },
    secondary: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    sourceItem: { gap: Spacing.one },
    sourceLocator: {
      color: colors.textMuted,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    summary: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    title: {
      color: colors.textPrimary,
      fontSize: Typography.screenTitle.fontSize,
      fontWeight: Typography.screenTitle.fontWeight,
      lineHeight: Typography.screenTitle.lineHeight,
    },
    version: {
      color: colors.textMuted,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
  });
