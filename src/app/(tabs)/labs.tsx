import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthGateCard } from '@/components/auth';
import { getFloatingTabBarBottomClearance } from '@/components/navigation/floatingTabBarLayout';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Colors, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { LabDocumentCard } from '@/features/labs/LabDocumentCard';
import { getLabsCopy } from '@/features/labs/labsCopy';
import { useLabs } from '@/features/labs/LabsContext';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

export default function LabsScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { formatDate, locale } = useLocalization();
  const { isAuthenticated, ready } = useAuthSession();
  const { documents, error, loading, refresh } = useLabs();
  const insets = useSafeAreaInsets();
  const copy = useMemo(() => getLabsCopy(locale), [locale]);
  const styles = useMemo(() => createStyles(colors), [colors]);

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
              <Text style={styles.body}>{copy.uploadUnavailable}</Text>
              <AppButton disabled label={copy.addResults} />
            </AppCard>

            {documents.length === 0 ? (
              <AppCard>
                <Text style={styles.cardTitle}>{copy.emptyTitle}</Text>
                <Text style={styles.body}>{copy.emptyBody}</Text>
              </AppCard>
            ) : (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{copy.documentsTitle}</Text>
                <View style={styles.stack}>
                  {documents.map((document) => (
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
              </View>
            )}

            <View style={styles.grid}>
              <AppCard style={styles.gridCard}>
                <Text style={styles.cardTitle}>{copy.biomarkersTitle}</Text>
                <Text style={styles.body}>{copy.biomarkersBody}</Text>
              </AppCard>
              <AppCard style={styles.gridCard}>
                <Text style={styles.cardTitle}>{copy.trendsTitle}</Text>
                <Text style={styles.body}>{copy.trendsBody}</Text>
              </AppCard>
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
    cardTitle: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
    centerCard: { alignItems: 'center' },
    container: { gap: Spacing.three, maxWidth: MaxContentWidth, width: '100%' },
    content: { alignItems: 'center', flexGrow: 1, padding: Spacing.three },
    grid: { gap: Spacing.three },
    gridCard: { flex: 1 },
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
