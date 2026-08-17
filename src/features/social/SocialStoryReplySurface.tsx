import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';

import type { SocialApi } from '@/api/social';
import { SOCIAL_STORY_REPLY_MAX_LENGTH } from '@/api/social/story-expansion-contracts';
import { AppCard } from '@/components/ui/AppCard';
import { InlineError } from '@/components/ui/InlineError';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { resolveLiquidGlassPalette } from '@/theme/liquidGlass';

import type { SocialStoryExpansionCopy } from './socialStoryExpansionCopy';
import {
  resolveSocialStoryReplyIdentity,
  type SocialStoryReplyIdentity,
} from './socialStoryReplyIdentity';

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
        fieldDisabled: {
          backgroundColor: glass.disabledFill,
          borderColor: glass.disabledBorder,
        },
        meta: {
          color: colors.textSecondary,
          fontSize: Typography.caption.fontSize,
          lineHeight: Typography.caption.lineHeight,
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
  const replyIdentity = useRef<SocialStoryReplyIdentity | null>(null);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    replyIdentity.current = null;
    setBody('');
    setError(null);
  }, [storyId]);

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
    const identity = resolveSocialStoryReplyIdentity(replyIdentity.current, {
      storyId,
      body: normalized,
    });
    replyIdentity.current = identity;
    setSending(true);
    setError(null);
    try {
      await api.createStoryReply(storyId, {
        schemaVersion: 1,
        idempotencyKey: identity.idempotencyKey,
        body: normalized,
      });
      replyIdentity.current = null;
      setBody('');
    } catch {
      setError(copy.replyFailed);
    } finally {
      setSending(false);
    }
  }, [api, body, copy.replyFailed, owner, sending, storyId]);

  if (owner) {
    return (
      <AppCard style={styles.card}>
        <Text style={styles.title}>{copy.activityTitle}</Text>
        <Text style={styles.meta}>{copy.activityBody}</Text>
        <SecondaryButton
          label={copy.activityTitle}
          onPress={() =>
            router.push({
              pathname: '/social/story/activity',
              params: { storyId },
            })
          }
        />
      </AppCard>
    );
  }

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
        style={[styles.field, sending ? styles.fieldDisabled : null]}
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
