import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  SOCIAL_STORY_REACTION_TYPES,
  type SocialApi,
  type SocialStoryReactionType,
} from '@/api/social';
import { InlineError } from '@/components/ui/InlineError';
import { Spacing, Typography } from '@/constants/theme';
import type { SupportedLocale } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { resolveLiquidGlassPalette } from '@/theme/liquidGlass';

import { getSocialStoryReactionCopy } from './socialStoryReactionCopy';
import {
  loadSocialStoryReactionSurface,
  type SocialStoryReactionSurface,
  type SocialStoryReactionSurfaceMode,
} from './storyReactionSurfaceModel';

const EMOJI: Record<SocialStoryReactionType, string> = {
  love: '❤️',
  fire: '🔥',
  strong: '💪',
  clap: '👏',
};

type Props = {
  api: SocialApi;
  locale: SupportedLocale;
  mode: SocialStoryReactionSurfaceMode;
  storyId: string;
};

export function SocialStoryReactionSurface({ api, locale, mode, storyId }: Props) {
  const copy = getSocialStoryReactionCopy(locale);
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(
    () =>
      StyleSheet.create({
        choice: {
          alignItems: 'center',
          backgroundColor: glass.controlFill,
          borderColor: glass.controlBorder,
          borderRadius: 999,
          borderWidth: StyleSheet.hairlineWidth,
          flexDirection: 'row',
          gap: Spacing.one,
          justifyContent: 'center',
          minHeight: 44,
          minWidth: 52,
          paddingHorizontal: Spacing.two,
        },
        choiceDisabled: { opacity: 0.5 },
        choicePressed: { transform: [{ scale: 0.96 }] },
        choiceSelected: {
          borderColor: colors.textPrimary,
          borderWidth: 2,
        },
        count: {
          color: colors.textPrimary,
          fontSize: Typography.callout.fontSize,
          fontWeight: Typography.callout.fontWeight,
          lineHeight: Typography.callout.lineHeight,
        },
        emoji: { fontSize: 22, lineHeight: 28 },
        row: {
          alignItems: 'center',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: Spacing.two,
        },
        selectedMark: {
          color: colors.textPrimary,
          fontSize: Typography.caption.fontSize,
          fontWeight: '700',
        },
        total: {
          color: colors.textSecondary,
          fontSize: Typography.callout.fontSize,
          fontWeight: Typography.callout.fontWeight,
          lineHeight: Typography.callout.lineHeight,
        },
        wrapper: { gap: Spacing.two },
      }),
    [colors, glass],
  );
  const [surface, setSurface] = useState<SocialStoryReactionSurface | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const next = await loadSocialStoryReactionSurface(mode, storyId, api);
      const responseStoryId =
        next.mode === 'owner_summary' ? next.summary.storyId : next.state.storyId;
      if (responseStoryId !== storyId) {
        throw new Error('Story Reaction response target mismatch');
      }
      setSurface(next);
    } catch {
      setSurface(null);
      setErrorMessage(copy.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [api, copy.loadFailed, mode, storyId]);

  useEffect(() => {
    void load();
  }, [load]);

  const viewerState = surface?.mode === 'viewer_state' ? surface.state : null;
  const ownerSummary = surface?.mode === 'owner_summary' ? surface.summary : null;

  const updateReaction = useCallback(
    async (reaction: SocialStoryReactionType) => {
      if (mode !== 'viewer_state' || !viewerState || updating) return;
      setUpdating(true);
      setErrorMessage(null);
      try {
        const nextState =
          viewerState.reaction === reaction
            ? await api.clearStoryReaction(storyId)
            : await api.setStoryReaction(storyId, reaction);
        if (nextState.storyId !== storyId) {
          throw new Error('Story Reaction mutation target mismatch');
        }
        setSurface({ mode: 'viewer_state', state: nextState });
      } catch {
        setErrorMessage(copy.updateFailed);
      } finally {
        setUpdating(false);
      }
    },
    [api, copy.updateFailed, mode, storyId, updating, viewerState],
  );

  return (
    <View style={styles.wrapper} testID="story-reaction-surface">
      {mode === 'viewer_state' ? (
        <View
          accessibilityLabel={copy.chooseReaction}
          accessibilityRole="toolbar"
          style={styles.row}
        >
          {SOCIAL_STORY_REACTION_TYPES.map((reaction) => {
            const selected = viewerState?.reaction === reaction;
            const disabled = loading || updating || !viewerState;
            const label = copy[reaction];
            return (
              <Pressable
                accessibilityLabel={selected ? `${label}. ${copy.clearReaction}` : label}
                accessibilityRole="button"
                accessibilityState={{
                  busy: updating,
                  disabled,
                  selected,
                }}
                disabled={disabled}
                key={reaction}
                onPress={() => void updateReaction(reaction)}
                style={({ pressed }) => [
                  styles.choice,
                  selected ? styles.choiceSelected : null,
                  disabled ? styles.choiceDisabled : null,
                  pressed ? styles.choicePressed : null,
                ]}
                testID={`story-reaction-${reaction}`}
              >
                <Text style={styles.emoji}>{EMOJI[reaction]}</Text>
                {selected ? <Text style={styles.selectedMark}>✓</Text> : null}
              </Pressable>
            );
          })}
        </View>
      ) : ownerSummary ? (
        <View style={styles.wrapper} testID="story-reaction-summary">
          <View style={styles.row}>
            {SOCIAL_STORY_REACTION_TYPES.map((reaction) => (
              <View
                accessibilityLabel={`${copy[reaction]}: ${ownerSummary.counts[reaction]}`}
                key={reaction}
                style={styles.choice}
              >
                <Text style={styles.emoji}>{EMOJI[reaction]}</Text>
                <Text style={styles.count}>{ownerSummary.counts[reaction]}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.total}>
            {copy.reactionsCount(ownerSummary.totalCount)}
          </Text>
        </View>
      ) : null}

      {errorMessage ? <InlineError message={errorMessage} /> : null}
    </View>
  );
}
