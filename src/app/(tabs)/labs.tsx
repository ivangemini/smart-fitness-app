import * as ImagePicker from 'expo-image-picker';
import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthGateCard } from '@/components/auth';
import { getFloatingTabBarBottomClearance } from '@/components/navigation/floatingTabBarLayout';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Colors, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { LabBiomarkerCard } from '@/features/labs/LabBiomarkerCard';
import { getBiomarkerDisplayName } from '@/features/labs/biomarkerNames';
import { LabDocumentCard } from '@/features/labs/LabDocumentCard';
import { getLabsCopy } from '@/features/labs/labsCopy';
import { useLabs } from '@/features/labs/LabsContext';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

const DOCUMENT_PREVIEW_LIMIT = 12;
const ATTENTION_PREVIEW_LIMIT = 6;
const BIOMARKER_PREVIEW_LIMIT = 20;

export default function LabsScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { formatDate, locale } = useLocalization();
  const { isAuthenticated, ready } = useAuthSession();
  const { documents, error, loading, markers, refresh, uploadPhoto, uploading } = useLabs();
  const [uploadError, setUploadError] = useState(false);
  const insets = useSafeAreaInsets();
  const copy = useMemo(() => getLabsCopy(locale), [locale]);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const attentionMarkers = useMemo(
    () =>
      markers
        .filter(
          (result) =>
            result.semanticState !== 'unknown' && result.semanticState !== 'in_range',
        )
        .slice(0, ATTENTION_PREVIEW_LIMIT),
    [markers],
  );

  const openMarker = (markerId: string) =>
    router.push({
      pathname: '/labs-marker/[markerId]',
      params: { markerId },
    });

  const choosePhoto = async () => {
    setUploadError(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
      exif: false,
    });
    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    try {
      await uploadPhoto({
        uri: asset.uri,
        fileName: asset.fileName,
        fileSize: asset.fileSize,
        mimeType: asset.mimeType,
      });
    } catch {
      setUploadError(true);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingBottom: getFloatingTabBarBottomClearance(insets.bottom) },
      ]}
      showsVerticalScrollIndicator={false}
      style={styles.screen}>
      <View style={styles.container}>
        <SectionHeader title={copy.tabTitle} subtitle={copy.subtitle} />

        {!ready || loading ? (
          <AppCard style={styles.centerCard}>
            <ActivityIndicator color={colors.textPrimary} />
            <Text style={styles.body}>{copy.loading}</Text>
          </AppCard>
        ) : !isAuthenticated ? (
          <AuthGateCard />
        ) : error ? (
          <AppCard>
            <Text style={styles.cardTitle}>{copy.loadFailed}</Text>
            <AppButton label={copy.retry} onPress={() => void refresh()} variant="secondary" />
          </AppCard>
        ) : (
          <>
            <AppCard>
              <Text style={styles.cardTitle}>{copy.addResults}</Text>
              <Text style={styles.body}>{copy.uploadHint}</Text>
              <AppButton
                disabled={uploading}
                label={uploading ? copy.uploadInProgress : copy.addPhoto}
                onPress={() => void choosePhoto()}
              />
              <Text style={styles.caption}>{copy.unsupportedPhoto}</Text>
              {uploadError ? <Text style={styles.errorText}>{copy.uploadFailed}</Text> : null}
            </AppCard>

            {attentionMarkers.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{copy.attentionTitle}</Text>
                <View style={styles.stack}>
                  {attentionMarkers.map((result) => (
                    <LabBiomarkerCard
                      key={result.markerId}
                      name={getBiomarkerDisplayName(result.markerId, locale)}
                      onPress={() => openMarker(result.markerId)}
                      result={result}
                      statusLabel={copy.semanticState[result.semanticState]}
                    />
                  ))}
                </View>
              </View>
            ) : null}

            {markers.length === 0 ? (
              <AppCard>
                <Text style={styles.cardTitle}>{copy.emptyTitle}</Text>
                <Text style={styles.body}>{copy.emptyBody}</Text>
              </AppCard>
            ) : (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{copy.biomarkersTitle}</Text>
                <Text style={styles.body}>{copy.biomarkersBody}</Text>
                <View style={styles.stack}>
                  {markers.slice(0, BIOMARKER_PREVIEW_LIMIT).map((result) => (
                    <LabBiomarkerCard
                      key={result.markerId}
                      name={getBiomarkerDisplayName(result.markerId, locale)}
                      onPress={() => openMarker(result.markerId)}
                      result={result}
                      statusLabel={copy.semanticState[result.semanticState]}
                    />
                  ))}
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{copy.documentsTitle}</Text>
              {documents.length === 0 ? (
                <Text style={styles.body}>{copy.noDocuments}</Text>
              ) : (
                <View style={styles.stack}>
                  {documents.slice(0, DOCUMENT_PREVIEW_LIMIT).map((document) => (
                    <LabDocumentCard
                      dateLabel={formatDate(new Date(document.createdAt), { dateStyle: 'medium' })}
                      document={document}
                      key={document.id}
                      onPress={() =>
                        router.push({
                          pathname: '/labs-document/[documentId]',
                          params: { documentId: document.id },
                        })
                      }
                      statusLabel={copy.status[document.status]}
                    />
                  ))}
                </View>
              )}
            </View>
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
    caption: {
      color: colors.textMuted,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    errorText: {
      color: colors.error,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    cardTitle: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
    centerCard: { alignItems: 'center' },
    container: { gap: Spacing.four, maxWidth: MaxContentWidth, width: '100%' },
    content: { alignItems: 'center', flexGrow: 1, padding: Spacing.three },
    screen: { backgroundColor: colors.background, flex: 1 },
    section: { gap: Spacing.two },
    sectionTitle: {
      color: colors.textSecondary,
      fontSize: Typography.sectionTitle.fontSize,
      fontWeight: Typography.sectionTitle.fontWeight,
      letterSpacing: Typography.sectionTitle.letterSpacing,
      textTransform: Typography.sectionTitle.textTransform,
    },
    stack: { gap: Spacing.two },
  });
