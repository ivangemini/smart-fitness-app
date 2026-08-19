import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useMemo } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { KnowledgeCategory } from '@/api/knowledge';
import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { MaxContentWidth, Radii, Spacing, Typography } from '@/constants/theme';
import { KnowledgeArticleCard } from '@/features/knowledge/KnowledgeArticleCard';
import {
  getKnowledgeCategoryLabel,
  getKnowledgeCopy,
} from '@/features/knowledge/knowledgeCopy';
import { useKnowledgeLibrary } from '@/features/knowledge/useKnowledgeLibrary';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

const CATEGORIES: KnowledgeCategory[] = [
  'training',
  'nutrition',
  'physiology',
  'recovery',
  'body_composition',
  'labs',
];

export default function KnowledgeLibraryScreen() {
  const { colors } = useAppTheme();
  const { locale } = useLocalization();
  const safeAreaInsets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const copy = getKnowledgeCopy(locale);
  const library = useKnowledgeLibrary(locale);

  const header = (
    <View style={styles.headerContent}>
      <View style={styles.topRow}>
        <LiquidGlassIconButton
          accessibilityLabel={copy.backToLibrary}
          icon={<ChevronLeft color={colors.textPrimary} size={22} />}
          onPress={() => router.back()}
        />
      </View>
      <View style={styles.headingBlock}>
        <Text style={styles.screenTitle}>{copy.libraryTitle}</Text>
        <Text style={styles.subtitle}>{copy.librarySubtitle}</Text>
      </View>
      <TextInput
        accessibilityLabel={copy.searchPlaceholder}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={library.setQuery}
        placeholder={copy.searchPlaceholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        style={styles.searchInput}
        value={library.query}
      />
      <ScrollView
        contentContainerStyle={styles.chipRow}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <FilterChip
          label={copy.allCategories}
          onPress={() => library.setCategory(null)}
          selected={library.category === null}
          styles={styles}
        />
        {CATEGORIES.map((category) => (
          <FilterChip
            key={category}
            label={getKnowledgeCategoryLabel(locale, category)}
            onPress={() => library.setCategory(category)}
            selected={library.category === category}
            styles={styles}
          />
        ))}
      </ScrollView>
      {library.conceptIds.length > 0 ? (
        <View style={styles.conceptSection}>
          <Text style={styles.sectionLabel}>{copy.conceptsTitle}</Text>
          <ScrollView
            contentContainerStyle={styles.chipRow}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {library.conceptId ? (
              <FilterChip
                label={copy.clearConcept}
                onPress={() => library.setConceptId(null)}
                selected={false}
                styles={styles}
              />
            ) : null}
            {library.conceptIds.map((conceptId) => (
              <FilterChip
                key={conceptId}
                label={conceptId.replaceAll('_', ' ')}
                onPress={() => library.setConceptId(conceptId)}
                selected={library.conceptId === conceptId}
                styles={styles}
              />
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );

  return (
    <FlatList
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: safeAreaInsets.top + Spacing.two,
          paddingBottom: safeAreaInsets.bottom + Spacing.six,
        },
      ]}
      data={library.articles}
      keyboardShouldPersistTaps="handled"
      keyExtractor={(article) => article.articleVersionId}
      ListEmptyComponent={
        library.loading ? (
          <AppCard>
            <Text style={styles.emptyTitle}>{copy.loading}</Text>
          </AppCard>
        ) : library.error ? (
          <AppCard>
            <Text style={styles.emptyTitle}>{copy.errorTitle}</Text>
            <Text style={styles.emptyBody}>{copy.errorBody}</Text>
            <AppButton label={copy.retry} onPress={library.reload} />
          </AppCard>
        ) : (
          <AppCard>
            <Text style={styles.emptyTitle}>{copy.emptyTitle}</Text>
            <Text style={styles.emptyBody}>{copy.emptyBody}</Text>
          </AppCard>
        )
      }
      ListHeaderComponent={header}
      refreshControl={
        <RefreshControl
          onRefresh={library.reload}
          refreshing={library.loading && library.articles.length > 0}
          tintColor={colors.textSecondary}
        />
      }
      renderItem={({ item }) => (
        <KnowledgeArticleCard
          article={item}
          locale={locale}
          onOpen={() =>
            router.push({
              pathname: '/knowledge/[slug]',
              params: { slug: item.slug },
            })
          }
          onSelectConcept={library.setConceptId}
        />
      )}
    />
  );
}

function FilterChip({
  label,
  onPress,
  selected,
  styles,
}: {
  label: string;
  onPress(): void;
  selected: boolean;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.filterChip,
        selected && styles.filterChipSelected,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.filterText, selected && styles.filterTextSelected]}>
        {label}
      </Text>
    </Pressable>
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
    headerContent: {
      gap: Spacing.four,
    },
    topRow: {
      minHeight: 44,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    headingBlock: {
      gap: Spacing.two,
    },
    screenTitle: {
      ...Typography.screenTitle,
      color: colors.textPrimary,
    },
    subtitle: {
      ...Typography.body,
      color: colors.textSecondary,
    },
    searchInput: {
      minHeight: 48,
      borderRadius: Radii.medium,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderSubtle,
      backgroundColor: colors.surfacePrimary,
      color: colors.textPrimary,
      paddingHorizontal: Spacing.four,
      ...Typography.body,
    },
    chipRow: {
      gap: Spacing.two,
      paddingRight: Spacing.four,
    },
    filterChip: {
      minHeight: 40,
      justifyContent: 'center',
      borderRadius: Radii.pill,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderSubtle,
      backgroundColor: colors.surfaceSecondary,
      paddingHorizontal: Spacing.four,
    },
    filterChipSelected: {
      backgroundColor: colors.accentSoft,
      borderColor: colors.accent,
    },
    filterText: {
      ...Typography.callout,
      color: colors.textSecondary,
      textTransform: 'capitalize',
    },
    filterTextSelected: {
      color: colors.textPrimary,
    },
    conceptSection: {
      gap: Spacing.two,
    },
    sectionLabel: {
      ...Typography.sectionTitle,
      color: colors.textMuted,
    },
    emptyTitle: {
      ...Typography.cardTitle,
      color: colors.textPrimary,
    },
    emptyBody: {
      ...Typography.body,
      color: colors.textSecondary,
    },
    pressed: {
      opacity: 0.7,
    },
  });
