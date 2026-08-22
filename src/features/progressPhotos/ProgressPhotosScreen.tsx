import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Colors, MaxContentWidth, Radii, Spacing } from '@/constants/theme';
import { useAuthSession } from '@/hooks/useAuthSession';
import { createUuid } from '@/lib/ids';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

import { getProgressPhotoCopy } from './progressPhotoCopy';
import { progressPhotoRepository } from './progressPhotoRepository';
import type {
  ProgressPhotoPose,
  ProgressPhotoRecord,
  ProgressPhotoSource,
} from './progressPhotoStore';

const POSES: ProgressPhotoPose[] = ['front', 'side', 'back'];

export default function ProgressPhotosScreen() {
  const { colors } = useAppTheme();
  const { user } = useAuthSession();
  const { formatDate, locale } = useLocalization();
  const insets = useSafeAreaInsets();
  const copy = useMemo(() => getProgressPhotoCopy(locale), [locale]);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const poseOptions = useMemo(
    () => POSES.map((pose) => ({ label: copy.poseLabel(pose), value: pose })),
    [copy],
  );
  const [selectedPose, setSelectedPose] = useState<ProgressPhotoPose>('front');
  const [photos, setPhotos] = useState<ProgressPhotoRecord[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user?.id) {
      setPhotos([]);
      setLoadState('ready');
      return;
    }
    try {
      const next = await progressPhotoRepository.list(user.id);
      setPhotos(next);
      setLoadState('ready');
    } catch {
      setLoadState('error');
    }
  }, [user?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const latestByPose = useMemo(() => {
    const next = new Map<ProgressPhotoPose, ProgressPhotoRecord>();
    for (const photo of photos) {
      if (!next.has(photo.pose)) next.set(photo.pose, photo);
    }
    return next;
  }, [photos]);

  const addAsset = async (
    asset: ImagePicker.ImagePickerAsset,
    source: ProgressPhotoSource,
  ) => {
    if (!user?.id) {
      setMessage(copy.signedOut);
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      await progressPhotoRepository.add({
        userId: user.id,
        photoId: createUuid(),
        pose: selectedPose,
        source,
        sourceUri: asset.uri,
        width: asset.width,
        height: asset.height,
        mimeType: asset.mimeType ?? 'image/jpeg',
        now: new Date().toISOString(),
      });
      await load();
    } catch {
      setMessage(copy.saveError);
    } finally {
      setBusy(false);
    }
  };

  const launch = async (source: ProgressPhotoSource) => {
    setMessage(null);
    if (source === 'camera') {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setMessage(copy.cameraPermission);
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 4],
        exif: false,
        mediaTypes: ['images'],
        quality: 0.9,
      });
      if (!result.canceled && result.assets[0]) {
        await addAsset(result.assets[0], 'camera');
      }
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setMessage(copy.libraryPermission);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 4],
      exif: false,
      mediaTypes: ['images'],
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]) {
      await addAsset(result.assets[0], 'library');
    }
  };

  const removePhoto = (photo: ProgressPhotoRecord) => {
    Alert.alert(copy.deleteTitle, copy.deleteBody, [
      { text: copy.cancel, style: 'cancel' },
      {
        text: copy.delete,
        style: 'destructive',
        onPress: () => {
          if (!user?.id) return;
          setBusy(true);
          setMessage(null);
          void progressPhotoRepository
            .remove(user.id, photo.id)
            .then(load)
            .catch(() => setMessage(copy.deleteError))
            .finally(() => setBusy(false));
        },
      },
    ]);
  };

  const header = (
    <View style={styles.headerStack}>
      <SectionHeader title={copy.title} subtitle={copy.subtitle} />
      <AppButton label={copy.back} onPress={() => router.back()} variant="secondary" />

      <AppCard style={styles.infoCard}>
        <Text style={styles.cardTitle}>{copy.privateTitle}</Text>
        <Text style={styles.detail}>{copy.privateDescription}</Text>
        <Text style={styles.detail}>{copy.exportNotice}</Text>
      </AppCard>

      <AppCard style={styles.infoCard}>
        <Text style={styles.cardTitle}>{copy.guideTitle}</Text>
        <Text style={styles.detail}>{copy.guideBody}</Text>
      </AppCard>

      <View style={styles.captureBlock}>
        <Text style={styles.cardTitle}>{copy.selectedPose}</Text>
        <SegmentedControl
          accessibilityLabel={copy.selectedPose}
          disabled={busy}
          onChange={setSelectedPose}
          options={poseOptions}
          value={selectedPose}
        />
        <View style={styles.actions}>
          <AppButton
            disabled={busy || !user?.id}
            label={copy.takePhoto}
            loading={busy}
            onPress={() => void launch('camera')}
          />
          <AppButton
            disabled={busy || !user?.id}
            label={copy.importPhoto}
            onPress={() => void launch('library')}
            variant="secondary"
          />
        </View>
        <Text style={styles.detail}>{copy.importedTimeNote}</Text>
        {message ? <Text style={styles.error}>{message}</Text> : null}
        {!user?.id ? <Text style={styles.error}>{copy.signedOut}</Text> : null}
      </View>

      <View style={styles.latestSection}>
        <Text style={styles.cardTitle}>{copy.latestByPose}</Text>
        <View style={styles.latestRow}>
          {POSES.map((pose) => {
            const photo = latestByPose.get(pose);
            return (
              <View key={pose} style={styles.latestSlot}>
                {photo ? (
                  <Image
                    accessibilityLabel={copy.poseLabel(pose)}
                    contentFit="cover"
                    source={{ uri: photo.localUri }}
                    style={styles.latestImage}
                  />
                ) : (
                  <View style={styles.emptySlot}>
                    <Text style={styles.emptySlotText}>{copy.noPhoto}</Text>
                  </View>
                )}
                <Text numberOfLines={1} style={styles.slotLabel}>
                  {copy.poseLabel(pose)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <Text style={styles.cardTitle}>{copy.timeline}</Text>
      {loadState === 'loading' ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.accent} />
          <Text style={styles.detail}>{copy.loading}</Text>
        </View>
      ) : null}
      {loadState === 'error' ? <Text style={styles.error}>{copy.loadError}</Text> : null}
      {loadState === 'ready' && photos.length === 0 ? (
        <Text style={styles.detail}>{copy.timelineEmpty}</Text>
      ) : null}
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={header}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + Spacing.eight, paddingTop: insets.top + Spacing.three },
      ]}
      data={loadState === 'ready' ? photos : []}
      initialNumToRender={6}
      keyExtractor={(photo) => photo.id}
      maxToRenderPerBatch={6}
      renderItem={({ item }) => (
        <AppCard style={styles.photoCard}>
          <Image
            accessibilityLabel={copy.poseLabel(item.pose)}
            contentFit="cover"
            source={{ uri: item.localUri }}
            style={styles.timelineImage}
          />
          <View style={styles.photoMeta}>
            <Text style={styles.photoTitle}>{copy.poseLabel(item.pose)}</Text>
            <Text style={styles.detail}>
              {copy.addedAt}:{' '}
              {formatDate(item.capturedAt, {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            <Text style={styles.detail}>
              {item.source === 'camera' ? copy.sourceCamera : copy.sourceLibrary}
            </Text>
            <AppButton
              disabled={busy}
              label={copy.deletePhoto}
              onPress={() => removePhoto(item)}
              variant="secondary"
            />
          </View>
        </AppCard>
      )}
      showsVerticalScrollIndicator={false}
      style={styles.screen}
      updateCellsBatchingPeriod={80}
      windowSize={5}
    />
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    actions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
    captureBlock: { gap: Spacing.two },
    cardTitle: { color: colors.textPrimary, fontSize: 17, fontWeight: '800' },
    content: {
      alignSelf: 'center',
      gap: Spacing.three,
      maxWidth: MaxContentWidth,
      paddingHorizontal: Spacing.three,
      width: '100%',
    },
    detail: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
    emptySlot: {
      alignItems: 'center',
      aspectRatio: 3 / 4,
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.borderSubtle,
      borderRadius: Radii.medium,
      borderWidth: StyleSheet.hairlineWidth,
      justifyContent: 'center',
      width: '100%',
    },
    emptySlotText: { color: colors.textMuted, fontSize: 12, textAlign: 'center' },
    error: { color: colors.error, fontSize: 13, lineHeight: 19 },
    headerStack: { gap: Spacing.three },
    infoCard: { gap: Spacing.two },
    latestImage: { aspectRatio: 3 / 4, borderRadius: Radii.medium, width: '100%' },
    latestRow: { flexDirection: 'row', gap: Spacing.two },
    latestSection: { gap: Spacing.two },
    latestSlot: { flex: 1, gap: Spacing.one, minWidth: 0 },
    loadingRow: { alignItems: 'center', flexDirection: 'row', gap: Spacing.two },
    photoCard: { gap: Spacing.three, marginTop: Spacing.three },
    photoMeta: { gap: Spacing.one },
    photoTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '800' },
    screen: { backgroundColor: colors.background, flex: 1 },
    slotLabel: { color: colors.textSecondary, fontSize: 12, textAlign: 'center' },
    timelineImage: { aspectRatio: 3 / 4, borderRadius: Radii.large, width: '100%' },
  });
