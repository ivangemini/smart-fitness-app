import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { useMemo } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppCard } from '@/components/ui/AppCard';
import { InlineError } from '@/components/ui/InlineError';
import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { resolveLiquidGlassPalette } from '@/theme/liquidGlass';

import { getSocialStoryCopy } from '../socialStoryCopy';
import {
  canRefreshSocialStoryMedia,
  getSocialStoryMediaOperationLabel,
  getSocialStoryMediaStatus,
  isSocialStoryMediaBusy,
} from '../socialStoryMediaModel';
import { useSocialStoryAuthoring } from '../useSocialStoryAuthoring';

export default function SocialStoryAuthorScreen() {
  const { locale } = useLocalization();
  const copy = getSocialStoryCopy(locale);
  const authoring = useSocialStoryAuthoring(copy);
  const safeAreaInsets = useSafeAreaInsets();
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(
    () => resolveLiquidGlassPalette(resolvedAppearance),
    [resolvedAppearance],
  );
  const styles = useMemo(
    () =>
      StyleSheet.create({
        actions: { gap: Spacing.two },
        body: {
          color: colors.textSecondary,
          fontSize: Typography.body.fontSize,
          fontWeight: Typography.body.fontWeight,
          lineHeight: Typography.body.lineHeight,
        },
        content: {
          alignSelf: 'center',
          flexGrow: 1,
          gap: Spacing.three,
          maxWidth: MaxContentWidth,
          paddingHorizontal: Spacing.three,
          width: '100%',
        },
        header: {
          alignItems: 'center',
          flexDirection: 'row',
          gap: Spacing.three,
          justifyContent: 'space-between',
        },
        preview: {
          alignItems: 'center',
          backgroundColor: glass.controlFill,
          borderColor: glass.controlBorder,
          borderRadius: 24,
          borderWidth: StyleSheet.hairlineWidth,
          justifyContent: 'center',
          overflow: 'hidden',
          width: '100%',
        },
        previewImage: { height: '100%', width: '100%' },
        screen: { backgroundColor: glass.backgroundBase, flex: 1 },
        statusCard: { gap: Spacing.two },
        title: {
          color: colors.textPrimary,
          flexShrink: 1,
          fontSize: Typography.screenTitle.fontSize,
          fontWeight: Typography.screenTitle.fontWeight,
          lineHeight: Typography.screenTitle.lineHeight,
        },
      }),
    [colors, glass],
  );

  const busy = isSocialStoryMediaBusy(authoring.operation);
  const operationLabel = getSocialStoryMediaOperationLabel(authoring.operation, copy);
  const statusLabel = getSocialStoryMediaStatus(authoring.asset, copy);
  const canRefresh = canRefreshSocialStoryMedia(authoring.asset) && !busy;
  const publicPreview =
    authoring.asset?.publicDescriptor?.variants.post_640?.url ??
    authoring.asset?.publicDescriptor?.variants.post_320?.url ??
    null;
  const displayUri = publicPreview ?? authoring.previewUri;
  const placeholder =
    authoring.asset?.publicDescriptor?.placeholder.type === 'average_color'
      ? authoring.asset.publicDescriptor.placeholder.value
      : undefined;

  const publishStory = async () => {
    const storyId = await authoring.publish();
    if (!storyId) return;
    router.replace({ pathname: '/social/story/[storyId]', params: { storyId } });
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: safeAreaInsets.bottom + Spacing.three,
            paddingTop: safeAreaInsets.top + Spacing.two,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{copy.authorTitle}</Text>
          <LiquidGlassIconButton
            accessibilityLabel={copy.cancel}
            Icon={X}
            onPress={() => router.back()}
            testID="story-author-close"
          />
        </View>

        <Text style={styles.body}>{copy.authorBody}</Text>

        {!authoring.ready || authoring.operation === 'loading' ? (
          <LoadingState label={copy.loading} />
        ) : !authoring.isAuthenticated ? (
          <InlineError message={copy.imageSessionExpired} />
        ) : (
          <>
            {displayUri ? (
              <View
                style={[
                  styles.preview,
                  {
                    aspectRatio: authoring.previewAspectRatio,
                    backgroundColor: placeholder,
                  },
                ]}
              >
                <Image
                  accessibilityLabel={copy.yourStory}
                  resizeMode="contain"
                  source={{ uri: displayUri }}
                  style={styles.previewImage}
                />
              </View>
            ) : null}

            {operationLabel || statusLabel || authoring.errorMessage ? (
              <AppCard style={styles.statusCard}>
                {operationLabel ? <Text style={styles.body}>{operationLabel}</Text> : null}
                {!operationLabel && statusLabel ? (
                  <Text style={styles.body}>{statusLabel}</Text>
                ) : null}
                {authoring.errorMessage ? (
                  <InlineError message={authoring.errorMessage} />
                ) : null}
              </AppCard>
            ) : null}

            <View style={styles.actions}>
              <PrimaryButton
                disabled={busy}
                label={displayUri ? copy.replaceImage : copy.chooseImage}
                onPress={() => void authoring.chooseImage()}
              />
              {Platform.OS !== 'web' ? (
                <SecondaryButton
                  disabled={busy}
                  label={copy.takePhoto}
                  onPress={() => void authoring.chooseImage('camera')}
                />
              ) : null}
              {canRefresh ? (
                <SecondaryButton
                  label={copy.refreshStatus}
                  onPress={() => void authoring.refreshStatus()}
                />
              ) : null}
              {authoring.asset ? (
                <SecondaryButton
                  disabled={busy}
                  label={copy.removeImage}
                  onPress={() => void authoring.removeImage()}
                />
              ) : null}
              <PrimaryButton
                disabled={!authoring.canPublish}
                label={copy.publishStory}
                loading={authoring.operation === 'publishing'}
                onPress={() => void publishStory()}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
