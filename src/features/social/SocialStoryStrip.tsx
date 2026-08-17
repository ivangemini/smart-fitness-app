import { Plus } from 'lucide-react-native';
import { useMemo } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { SocialStoryDto } from '@/api/social';
import { Radii, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { resolveLiquidGlassPalette } from '@/theme/liquidGlass';

import type { SocialStoryCopy } from './socialStoryCopy';

type SocialStoryStripProps = {
  copy: SocialStoryCopy;
  loadingMore: boolean;
  onAdd(): void;
  onLoadMore(): void;
  onOpen(storyId: string): void;
  stories: SocialStoryDto[];
};

const AVATAR_SIZE = 58;
const STORY_ITEM_WIDTH = 72;

export function SocialStoryStrip({
  copy,
  loadingMore,
  onAdd,
  onLoadMore,
  onOpen,
  stories,
}: SocialStoryStripProps) {
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(
    () =>
      StyleSheet.create({
        addRing: {
          alignItems: 'center',
          backgroundColor: glass.controlFill,
          borderColor: glass.controlBorder,
          borderRadius: Radii.pill,
          borderWidth: StyleSheet.hairlineWidth,
          height: AVATAR_SIZE + 6,
          justifyContent: 'center',
          width: AVATAR_SIZE + 6,
        },
        addRingPressed: {
          backgroundColor: glass.controlPressedFill,
        },
        avatar: {
          borderRadius: Radii.pill,
          height: AVATAR_SIZE,
          width: AVATAR_SIZE,
        },
        avatarFallback: {
          alignItems: 'center',
          backgroundColor: glass.controlFill,
          borderRadius: Radii.pill,
          height: AVATAR_SIZE,
          justifyContent: 'center',
          width: AVATAR_SIZE,
        },
        avatarFallbackText: {
          color: colors.textPrimary,
          fontSize: Typography.cardTitle.fontSize,
          fontWeight: Typography.cardTitle.fontWeight,
        },
        item: {
          alignItems: 'center',
          gap: Spacing.one,
          paddingVertical: Spacing.one,
          width: STORY_ITEM_WIDTH,
        },
        listContent: { gap: Spacing.two, paddingRight: Spacing.two },
        ring: {
          alignItems: 'center',
          borderRadius: Radii.pill,
          borderWidth: 2,
          justifyContent: 'center',
          padding: 2,
        },
        ringPressed: {
          backgroundColor: glass.controlPressedFill,
        },
        title: {
          color: colors.textPrimary,
          fontSize: Typography.cardTitle.fontSize,
          fontWeight: Typography.cardTitle.fontWeight,
          lineHeight: Typography.cardTitle.lineHeight,
        },
        username: {
          color: colors.textSecondary,
          fontSize: Typography.caption.fontSize,
          fontWeight: Typography.caption.fontWeight,
          lineHeight: Typography.caption.lineHeight,
          maxWidth: STORY_ITEM_WIDTH,
        },
        wrapper: { gap: Spacing.two },
      }),
    [
      colors,
      glass.controlBorder,
      glass.controlFill,
      glass.controlPressedFill,
    ],
  );

  const addStory = (
    <Pressable
      accessibilityLabel={copy.addStory}
      accessibilityRole="button"
      onPress={onAdd}
      style={styles.item}
      testID="home-story-add"
    >
      {({ pressed }) => (
        <>
          <View style={[styles.addRing, pressed ? styles.addRingPressed : null]}>
            <Plus color={colors.accent} size={24} strokeWidth={2.2} />
          </View>
          <Text numberOfLines={1} style={styles.username}>
            {copy.yourStory}
          </Text>
        </>
      )}
    </Pressable>
  );

  return (
    <View style={styles.wrapper} testID="home-story-strip">
      <Text style={styles.title}>{copy.stories}</Text>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={stories}
        horizontal
        keyExtractor={(story) => story.id}
        ListHeaderComponent={addStory}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => {
          const imageUrl =
            item.author.avatarUrl ??
            item.image.variants.post_320?.url ??
            item.image.variants.post_640?.url ??
            null;
          const fallback = item.author.displayName.trim().charAt(0).toUpperCase();
          return (
            <Pressable
              accessibilityLabel={`${copy.openStory}: ${item.author.displayName}`}
              accessibilityRole="button"
              onPress={() => onOpen(item.id)}
              style={styles.item}
            >
              {({ pressed }) => (
                <>
                  <View
                    style={[
                      styles.ring,
                      {
                        borderColor: item.viewed
                          ? glass.controlBorder
                          : colors.accent,
                      },
                      pressed ? styles.ringPressed : null,
                    ]}
                  >
                    {imageUrl ? (
                      <Image
                        resizeMode="cover"
                        source={{ uri: imageUrl }}
                        style={styles.avatar}
                      />
                    ) : (
                      <View style={styles.avatarFallback}>
                        <Text style={styles.avatarFallbackText}>{fallback}</Text>
                      </View>
                    )}
                  </View>
                  <Text numberOfLines={1} style={styles.username}>
                    @{item.author.username}
                  </Text>
                </>
              )}
            </Pressable>
          );
        }}
        scrollEnabled={stories.length > 0}
        showsHorizontalScrollIndicator={false}
        testID={loadingMore ? 'home-story-strip-loading-more' : undefined}
      />
    </View>
  );
}
