import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import type { SocialApi } from '@/api/social';
import { SOCIAL_STORY_REPLY_MAX_LENGTH } from '@/api/social/story-expansion-contracts';
import type {
  SocialStoryReplyDto,
  SocialStoryViewerDto,
} from '@/api/social/story-expansion-contracts';
import { AppCard } from '@/components/ui/AppCard';
import { InlineError } from '@/components/ui/InlineError';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { resolveLiquidGlassPalette } from '@/theme/liquidGlass';

import type { SocialStoryExpansionCopy } from './socialStoryExpansionCopy';

const createReplyIdempotencyKey = (): string => {
  const uuid = globalThis.crypto?.randomUUID?.();
  if (uuid) return `story-reply-${uuid}`;
  return `story-reply-${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random()
    .toString(36)
    .slice(2)}`;
};

type Props = {
  api: SocialApi;
  copy: SocialStoryExpansionCopy;
  owner: boolean;
  storyId: string;
};

export function SocialStoryReplySurface({ api, copy, owner, storyId }: Props) {
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: { gap: Spacing.two },
        field: {
          backgroundColor: glass.controlFill,
          borderColor: glass.controlBorder,
          borderRadius: 14,
          borderWidth: StyleSheet.hairlineWidth,
          color: colors.textPrimary,
          fontSize: Typography.body.fontSize,
          lineHeight: Typography.body.lineHeight,
          minHeight: 52,
          paddingHorizontal: Spacing.two,
          paddingVertical: Spacing.two,
        },
        item: { gap: 2 },
        meta: {
          color: colors.textSecondary,
          fontSize: Typography.caption.fontSize,
          lineHeight: Typography.caption.lineHeight,
        },
        text: {
          color: colors.textPrimary,
          fontSize: Typography.body.fontSize,
          lineHeight: Typography.body.lineHeight,
        },
        title: {
          color: colors.textPrimary,
          fontSize: Typography.bodyEmphasized.fontSize,
          fontWeight: Typography.bodyEmphasized.fontWeight,
          lineHeight: Typography.bodyEmphasized.lineHeight,
        },
      }),
    [colors, glass],
  );
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewers, setViewers] = useState<SocialStoryViewerDto[]>([]);
  const [replies, setReplies] = useState<SocialStoryReplyDto[]>([]);

  const loadOwnerActivity = useCallback(async () => {
    if (!owner) {
      setViewers([]);
      setReplies([]);
      return;
    }
    setError(null);
    try {
      const [viewerPage, replyPage] = await Promise.all([
        api.listStoryViewers(storyId, { limit: 50 }),
        api.listStoryReplies(storyId, { limit: 50 }),
      ]);
      setViewers(viewerPage.items);
      setReplies(replyPage.items);
    } catch {
      setError(copy.loadFailed);
    }
  }, [api, copy.loadFailed, owner, storyId]);

  useEffect(() => {
    void loadOwnerActivity();
  }, [loadOwnerActivity]);

  const sendReply = useCallback(async () => {
    const normalized = body.trim();
    if (
      owner ||
      sending ||
      normalized.length < 1 ||
      normalized.length > SOCIAL_STORY_REPLY_MAX_LENGTH
    ) {
      return;
    }
    setSending(true);
    setError(null);
    try {
      await api.createStoryReply(storyId, {
        schemaVersion: 1,
        idempotencyKey: createReplyIdempotencyKey(),
        body: normalized,
      });
      setBody('');
    } catch {
      setError(copy.replyFailed);
    } finally {
      setSending(false);
    }
  }, [api, body, copy.replyFailed, owner, sending, storyId]);

  if (!owner) {
    return (
      <AppCard style={styles.card}>
        <Text style={styles.title}>{copy.reply}</Text>
        <TextInput
          accessibilityLabel={copy.replyPlaceholder}
          editable={!sending}
          maxLength={SOCIAL_STORY_REPLY_MAX_LENGTH}
          multiline
          onChangeText={setBody}
          placeholder={copy.replyPlaceholder}
          placeholderTextColor={colors.textSecondary}
          style={styles.field}
          value={body}
        />
        <PrimaryButton
          disabled={body.trim().length === 0 || sending}
          label={copy.sendReply}
          loading={sending}
          onPress={() => void sendReply()}
        />
        {error ? <InlineError message={error} /> : null}
      </AppCard>
    );
  }

  return (
    <View style={{ gap: Spacing.two }}>
      <AppCard style={styles.card}>
        <Text style={styles.title}>{copy.viewers}</Text>
        {viewers.length === 0 ? (
          <Text style={styles.meta}>{copy.noViewers}</Text>
        ) : (
          viewers.map((viewer) => (
            <View key={`${viewer.profile.username}-${viewer.viewedAt}`} style={styles.item}>
              <Text style={styles.text}>@{viewer.profile.username}</Text>
              <Text style={styles.meta}>{new Date(viewer.viewedAt).toLocaleString()}</Text>
            </View>
          ))
        )}
      </AppCard>
      <AppCard style={styles.card}>
        <Text style={styles.title}>{copy.replies}</Text>
        {replies.length === 0 ? (
          <Text style={styles.meta}>{copy.noReplies}</Text>
        ) : (
          replies.map((reply) => (
            <View key={reply.id} style={styles.item}>
              <Text style={styles.meta}>@{reply.author.username}</Text>
              <Text style={styles.text}>{reply.body}</Text>
            </View>
          ))
        )}
      </AppCard>
      {error ? <InlineError message={error} /> : null}
    </View>
  );
}
