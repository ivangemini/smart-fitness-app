import { router } from 'expo-router';
import { Dumbbell, ImagePlus, TrendingUp, X } from 'lucide-react-native';
import { useMemo } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SOCIAL_STORY_CAPTION_MAX_LENGTH, type SocialStoryOverlayValueDto } from '@/api/social';
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

import { SocialStoryAudienceSelector } from '../SocialStoryAudienceSelector';
import { getSocialStoryCopy } from '../socialStoryCopy';
import { getSocialStoryExpansionCopy } from '../socialStoryExpansionCopy';
import { canRefreshSocialStoryMedia, getSocialStoryMediaOperationLabel, getSocialStoryMediaStatus, isSocialStoryMediaBusy } from '../socialStoryMediaModel';
import { SocialStoryOverlayEditor } from '../SocialStoryOverlayEditor';
import { SocialStoryOverlayView } from '../SocialStoryOverlayView';
import { useSocialStoryAuthoring } from '../useSocialStoryAuthoring';

const normalizeOverlayPreviewText = (value: string): string => value.normalize('NFKC').replace(/\s+/gu, ' ').trim();

export default function SocialStoryAuthorScreen() {
  const { locale } = useLocalization();
  const copy = getSocialStoryCopy(locale);
  const expansionCopy = getSocialStoryExpansionCopy(locale);
  const authoring = useSocialStoryAuthoring(copy);
  const insets = useSafeAreaInsets();
  const { colors, resolvedAppearance } = useAppTheme();
  const glass = useMemo(() => resolveLiquidGlassPalette(resolvedAppearance), [resolvedAppearance]);
  const ru = locale === 'ru';
  const styles = useMemo(() => StyleSheet.create({
    screen: { backgroundColor: glass.backgroundBase, flex: 1, width: '100%' },
    content: { alignSelf: 'center', flexGrow: 1, gap: Spacing.three, maxWidth: MaxContentWidth, minWidth: 0, paddingHorizontal: Spacing.three, width: '100%' },
    header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
    headerTitle: { color: colors.textPrimary, fontSize: Typography.cardTitle.fontSize, fontWeight: '800' },
    body: { color: colors.textSecondary, fontSize: Typography.body.fontSize, lineHeight: Typography.body.lineHeight },
    quickRow: { flexDirection: 'row', gap: Spacing.two },
    quickCard: { alignItems: 'center', backgroundColor: glass.controlFill, borderColor: glass.controlBorder, borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, flex: 1, gap: Spacing.two, justifyContent: 'center', minHeight: 118, padding: Spacing.three },
    quickLabel: { color: colors.textPrimary, fontSize: Typography.callout.fontSize, fontWeight: '800', textAlign: 'center' },
    sectionRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.two },
    sectionTitle: { color: colors.textPrimary, fontSize: Typography.cardTitle.fontSize, fontWeight: '800' },
    pickerCard: { alignItems: 'center', backgroundColor: glass.cardFill, borderColor: glass.cardBorder, borderRadius: 22, borderWidth: StyleSheet.hairlineWidth, gap: Spacing.two, justifyContent: 'center', minHeight: 210, padding: Spacing.four },
    preview: { alignItems: 'center', backgroundColor: glass.controlFill, borderColor: glass.controlBorder, borderRadius: 24, borderWidth: StyleSheet.hairlineWidth, justifyContent: 'center', overflow: 'hidden', width: '100%' },
    previewImage: { height: '100%', width: '100%' },
    captionField: { gap: Spacing.one },
    captionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
    captionLabel: { color: colors.textPrimary, fontSize: Typography.bodyEmphasized.fontSize, fontWeight: Typography.bodyEmphasized.fontWeight },
    captionCount: { color: colors.textSecondary, fontSize: Typography.caption.fontSize },
    captionInput: { backgroundColor: glass.controlFill, borderColor: glass.controlBorder, borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, color: colors.textPrimary, fontSize: Typography.body.fontSize, minHeight: 52, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two },
    statusCard: { gap: Spacing.two },
    actions: { gap: Spacing.two },
  }), [colors, glass]);

  const busy = isSocialStoryMediaBusy(authoring.operation);
  const operationLabel = getSocialStoryMediaOperationLabel(authoring.operation, copy);
  const statusLabel = getSocialStoryMediaStatus(authoring.asset, copy);
  const canRefresh = canRefreshSocialStoryMedia(authoring.asset) && !busy;
  const publicPreview = authoring.asset?.publicDescriptor?.variants.post_640?.url ?? authoring.asset?.publicDescriptor?.variants.post_320?.url ?? null;
  const displayUri = publicPreview ?? authoring.previewUri;
  const placeholder = authoring.asset?.publicDescriptor?.placeholder.type === 'average_color' ? authoring.asset.publicDescriptor.placeholder.value : undefined;
  const normalizedOverlayText = normalizeOverlayPreviewText(authoring.overlayText);
  const previewOverlay: SocialStoryOverlayValueDto | null = normalizedOverlayText ? { schemaVersion: 1, text: normalizedOverlayText, placement: authoring.overlayPlacement } : null;

  const chooseTemplate = (kind: 'workout' | 'progress') => {
    authoring.setOverlayText(kind === 'workout' ? (ru ? 'Моя тренировка' : 'My workout') : (ru ? 'Мой прогресс' : 'My progress'));
    void authoring.chooseImage();
  };
  const publishStory = async () => {
    const storyId = await authoring.publish();
    if (storyId) router.replace({ pathname: '/social/story/[storyId]', params: { storyId } });
  };

  return <View style={styles.screen}>
    <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four, paddingTop: insets.top + Spacing.two }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <LiquidGlassIconButton accessibilityLabel={copy.cancel} Icon={X} onPress={() => router.back()} testID="story-author-close" />
        <Text style={styles.headerTitle}>{ru ? 'Добавить в историю' : 'Add to story'}</Text>
        <View style={{ width: 48 }} />
      </View>

      {!authoring.ready || authoring.operation === 'loading' ? <LoadingState label={copy.loading} /> : !authoring.isAuthenticated ? <InlineError message={copy.imageSessionExpired} /> : !displayUri ? <>
        <View style={styles.quickRow}>
          <Pressable accessibilityRole="button" onPress={() => chooseTemplate('workout')} style={styles.quickCard}>
            <Dumbbell color={colors.accent} size={34} />
            <Text style={styles.quickLabel}>{ru ? 'Тренировка' : 'Workout'}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => chooseTemplate('progress')} style={styles.quickCard}>
            <TrendingUp color={colors.accent} size={34} />
            <Text style={styles.quickLabel}>{ru ? 'Прогресс' : 'Progress'}</Text>
          </Pressable>
        </View>
        <View style={styles.sectionRow}><Text style={styles.sectionTitle}>{ru ? 'Недавние' : 'Recent'}</Text></View>
        <Pressable accessibilityRole="button" onPress={() => void authoring.chooseImage()} style={styles.pickerCard}>
          <ImagePlus color={colors.textPrimary} size={42} />
          <Text style={styles.quickLabel}>{ru ? 'Выбрать фото из медиатеки' : 'Choose a photo'}</Text>
          <Text style={styles.body}>{ru ? 'Откроется системная медиатека с недавними фотографиями.' : 'Your recent photos will open in the system photo picker.'}</Text>
        </Pressable>
        {Platform.OS !== 'web' ? <SecondaryButton disabled={busy} label={copy.takePhoto} onPress={() => void authoring.chooseImage('camera')} /> : null}
      </> : <>
        <View style={[styles.preview, { aspectRatio: authoring.previewAspectRatio, backgroundColor: placeholder }]}>
          <Image accessibilityLabel={copy.yourStory} resizeMode="contain" source={{ uri: displayUri }} style={styles.previewImage} />
          <SocialStoryOverlayView overlay={previewOverlay} />
        </View>
        <SocialStoryOverlayEditor copy={{ label: copy.overlayLabel, placeholder: copy.overlayPlaceholder, placementLabel: copy.overlayPlacementLabel, placements: { top: copy.overlayTop, center: copy.overlayCenter, bottom: copy.overlayBottom } }} disabled={busy} onPlacementChange={authoring.setOverlayPlacement} onTextChange={authoring.setOverlayText} placement={authoring.overlayPlacement} value={authoring.overlayText} />
        <View style={styles.captionField}>
          <View style={styles.captionHeader}><Text style={styles.captionLabel}>{copy.captionLabel}</Text><Text style={styles.captionCount}>{authoring.caption.length}/{SOCIAL_STORY_CAPTION_MAX_LENGTH}</Text></View>
          <TextInput accessibilityLabel={copy.captionLabel} editable={!busy} maxLength={SOCIAL_STORY_CAPTION_MAX_LENGTH} onChangeText={authoring.setCaption} placeholder={ru ? 'Добавьте подпись…' : copy.captionPlaceholder} placeholderTextColor={colors.textSecondary} style={styles.captionInput} value={authoring.caption} />
        </View>
        <SocialStoryAudienceSelector copy={expansionCopy} disabled={busy} onChange={authoring.setAudience} value={authoring.audience} />
        {operationLabel || statusLabel || authoring.errorMessage ? <AppCard style={styles.statusCard}>{operationLabel ? <Text style={styles.body}>{operationLabel}</Text> : null}{!operationLabel && statusLabel ? <Text style={styles.body}>{statusLabel}</Text> : null}{authoring.errorMessage ? <InlineError message={authoring.errorMessage} /> : null}</AppCard> : null}
        <View style={styles.actions}>
          <SecondaryButton disabled={busy} label={copy.replaceImage} onPress={() => void authoring.chooseImage()} />
          <SecondaryButton disabled={busy} label={copy.removeImage} onPress={() => void authoring.removeImage()} />
          {canRefresh ? <SecondaryButton label={copy.refreshStatus} onPress={() => void authoring.refreshStatus()} /> : null}
          <PrimaryButton disabled={!authoring.canPublish} label={copy.publishStory} loading={authoring.operation === 'publishing'} onPress={() => void publishStory()} />
        </View>
      </>}
    </ScrollView>
  </View>;
}
