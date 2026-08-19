import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type {
  KnowledgeCategory,
  PublishedKnowledgeArticleSummary,
} from '@/api/knowledge';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { FormField } from '@/components/ui/FormField';
import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Colors, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { KnowledgeArticleCard } from '@/features/knowledge/KnowledgeArticleCard';
import { getKnowledgeCopy } from '@/features/knowledge/knowledgeCopy';
import {
  filterKnowledgeArticles,
  KNOWLEDGE_LIBRARY_SEARCH_MAX_LENGTH,
  type KnowledgeLibraryCategoryFilter,
} from '@/features/knowledge/knowledgeLibrary';
import { useKnowledgeApi } from '@/features/knowledge/useKnowledgeApi';

const CATEGORIES: readonly KnowledgeCategory[] = [
  'training',
  'nutrition',
  'physiology',
  'recovery',
  'body_composition',
  'labs',
];

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

export default function KnowledgeLibraryScreen() {
  const { colors } = useAppTheme();
  const { locale } = useLocalization();
  const { isAuthenticated, ready: authReady } = useAuthSession();
  const api = useKnowledgeApi();
  const insets = useSafeAreaInsets();
  const copy = getKnowledgeCopy(locale);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [articles, setArticles] = useState<PublishedKnowledgeArticleSummary[]>([]);
  const [category, setCategory] =
    useState<KnowledgeLibraryCategoryFilter>('all');
  const [query, setQuery] = useState('');
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (!authReady || !isAuthenticated) {
      setArticles([]);
      setLoadState('idle');
      return;
    }
    let cancelled = false;
    setLoadState('loading');
    void api
      .listArticles({ locale, limit: 200 })
      .then((response) => {
        if (cancelled) return;
        setArticles(response.articles);
        setLoadState('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setArticles([]);
        setLoadState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [api, authReady, isAuthenticated, locale, reloadToken]);

  const visibleArticles = useMemo(
    () => filterKnowledgeArticles({ articles, category, query }),
    [articles, category, query],
  );
  const retry = useCallback(() => setReloadToken((value) => value + 1), []);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: insets.bottom + Spacing.eight,
          paddingTop: insets.top + Spacing.four,
        },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <LiquidGlassIconButton
            accessibilityLabel={copy.back}
            Icon={ChevronLeft}
            onPress={() => router.back()}
          />
          <View style={styles.headerCopy}>
            <SectionHeader
              title={copy.libraryTitle}
              subtitle={copy.librarySubtitle}
            />
          </View>
        </View>

        {!authReady || !isAuthenticated ? (
          <AppCard>
            <Text style={styles.cardTitle}>{copy.signInTitle}</Text>
            <Text style={styles.body}>{copy.signInBody}</Text>
          </AppCard>
        ) : (
          <>
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              label={copy.searchLabel}
              maxLength={KNOWLEDGE_LIBRARY_SEARCH_MAX_LENGTH}
              onChangeText={setQuery}
              placeholder={copy.searchPlaceholder}
              returnKeyType="search"
              value={query}
            />

            <ScrollView
              contentContainerStyle={styles.categoryContent}
              horizontal
              showsHorizontalScrollIndicator={false}>
              <AppButton
                label={copy.all}
                onPress={() => setCategory('all')}
                selected={category === 'all'}
                style={styles.categoryButton}
                variant="secondary"
              />
              {CATEGORIES.map((item) => (
                <AppButton
                  key={item}
                  label={copy.category(item)}
                  onPress={() => setCategory(item)}
                  selected={category === item}
                  style={styles.categoryButton}
                  variant="secondary"
                />
              ))}
            </ScrollView>

            {loadState === 'loading' ? (
              <AppCard>
                <Text style={styles.body}>{copy.librarySubtitle}</Text>
              </AppCard>
            ) : null}
            {loadState === 'error' ? (
              <AppCard>
                <Text style={styles.cardTitle}>{copy.errorTitle}</Text>
                <Text style={styles.body}>{copy.errorBody}</Text>
                <AppButton label={copy.retry} onPress={retry} variant="secondary" />
              </AppCard>
            ) : null}
            {loadState === 'ready' && visibleArticles.length === 0 ? (
              <AppCard>
                <Text style={styles.body}>{copy.empty}</Text>
              </AppCard>
            ) : null}
            {loadState === 'ready'
              ? visibleArticles.map((article) => (
                  <KnowledgeArticleCard article={article} key={article.articleVersionId} />
                ))
              : null}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: typeof Colors.light) =>
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
    categoryButton: { alignSelf: 'flex-start' },
    categoryContent: { gap: Spacing.two, paddingRight: Spacing.three },
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
    headerCopy: { flex: 1, minWidth: 0 },
    headerRow: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: Spacing.three,
    },
    screen: { backgroundColor: colors.background, flex: 1 },
  });
