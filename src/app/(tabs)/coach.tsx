import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Colors, MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { useWorkoutState } from '@/context/AppContext';
import { buildCoachFactPacket } from '@/features/coach/coachRetrieval';
import {
  parseCoachProgressContext,
  type CoachProgressSearchParams,
} from '@/features/coach/coachProgressContext';
import { getCoachProgressContextCopy } from '@/features/coach/coachProgressContextCopy';
import { useCoachRetrievalSources } from '@/features/coach/useCoachRetrievalSources';
import { companionCopy } from '@/features/companion/companionCopy';
import { CompanionProgressCard } from '@/features/companion/CompanionProgressCard';
import { deriveCompanionProgress } from '@/features/companion/companionProgression';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

const COACH_ACTIONS = [
  { labelKey: 'coach.addRecoveryCheckIn' as const, route: '/profile/recovery-check-in' as const },
  { labelKey: 'coach.manageLimitations' as const, route: '/profile/limitations' as const },
  { labelKey: 'coach.openSafetyRecovery' as const, route: '/profile/safety-recovery' as const },
  { labelKey: 'coach.openCombinedReview' as const, route: '/profile/combined-review' as const },
  { labelKey: 'coach.openCombinedProposal' as const, route: '/profile/combined-proposal' as const },
] as const;

export default function CoachScreen() {
  const { colors } = useAppTheme();
  const { formatNumber, locale, t } = useLocalization();
  const { workoutSessions } = useWorkoutState();
  const retrievalSources = useCoachRetrievalSources();
  const searchParams = useLocalSearchParams<CoachProgressSearchParams>();
  const safeAreaInsets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const progress = useMemo(() => deriveCompanionProgress(workoutSessions), [workoutSessions]);
  const progressContext = useMemo(
    () => parseCoachProgressContext(searchParams),
    [searchParams],
  );
  const progressPacket = useMemo(
    () =>
      progressContext
        ? buildCoachFactPacket({ request: progressContext.request, sources: retrievalSources })
        : null,
    [progressContext, retrievalSources],
  );
  const copy = companionCopy[locale];
  const contextCopy = getCoachProgressContextCopy(locale);
  const exerciseHistory = progressPacket?.ok
    ? progressPacket.data.facts.exerciseHistory ?? null
    : null;
  const exerciseName =
    progressContext?.request.exerciseName ?? exerciseHistory?.exercise.exerciseName ?? null;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: safeAreaInsets.bottom + Spacing.eight,
          paddingTop: safeAreaInsets.top + Spacing.four,
        },
      ]}
      showsVerticalScrollIndicator={false}
      style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <LiquidGlassIconButton
            accessibilityLabel={t('common.back')}
            Icon={ChevronLeft}
            onPress={() => router.back()}
          />
          <View style={styles.headerCopy}>
            <SectionHeader title={copy.title} subtitle={copy.subtitle} />
          </View>
        </View>

        <CompanionProgressCard colors={colors} locale={locale} progress={progress} />

        {progressContext ? (
          <AppCard>
            <Text style={styles.title}>{contextCopy.title}</Text>
            <Text style={styles.body}>{contextCopy.description}</Text>
            {exerciseHistory && exerciseName ? (
              <Text selectable style={styles.contextSummary}>
                {exerciseHistory.totalMatchingSessions > 0
                  ? contextCopy.exerciseSummary(
                      exerciseName,
                      formatNumber(exerciseHistory.totalMatchingSessions),
                      formatNumber(progressContext.retrievalDays),
                    )
                  : contextCopy.noMatchingHistory}
              </Text>
            ) : (
              <Text selectable style={styles.contextSummary}>{contextCopy.unavailable}</Text>
            )}
            {progressContext.requestedDays > progressContext.retrievalDays ? (
              <Text selectable style={styles.contextNote}>
                {contextCopy.boundedPeriod(
                  formatNumber(progressContext.requestedDays),
                  formatNumber(progressContext.retrievalDays),
                )}
              </Text>
            ) : null}
            <AppButton
              label={contextCopy.openProgress}
              onPress={() => router.push('/training-progress')}
              variant="secondary"
            />
          </AppCard>
        ) : null}

        <AppCard>
          <Text style={styles.title}>{t('coach.toolsTitle')}</Text>
          <Text style={styles.body}>{t('coach.toolsBody')}</Text>
          <View style={styles.actions}>
            {COACH_ACTIONS.map((action) => (
              <AppButton
                key={action.route}
                label={t(action.labelKey)}
                onPress={() => router.push(action.route)}
                variant="secondary"
              />
            ))}
          </View>
        </AppCard>
        <AppCard>
          <Text style={styles.title}>{t('coach.registrationProfileTitle')}</Text>
          <Text style={styles.body}>{t('coach.registrationProfileBody')}</Text>
          <AppButton
            label={t('coach.openProfile')}
            onPress={() => router.push('/(tabs)/profile')}
            variant="secondary"
          />
        </AppCard>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    actions: { gap: Spacing.two, marginTop: Spacing.two },
    body: {
      color: colors.textSecondary,
      flexShrink: 1,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
    },
    container: { gap: Spacing.three, maxWidth: MaxContentWidth, width: '100%' },
    content: { alignItems: 'center', flexGrow: 1, paddingHorizontal: Spacing.three },
    contextNote: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
      marginTop: Spacing.two,
    },
    contextSummary: {
      color: colors.textPrimary,
      fontSize: Typography.body.fontSize,
      fontWeight: '700',
      lineHeight: Typography.body.lineHeight,
      marginTop: Spacing.two,
    },
    headerCopy: { flex: 1, minWidth: 0 },
    headerRow: { alignItems: 'flex-start', flexDirection: 'row', gap: Spacing.three },
    screen: { backgroundColor: colors.background, flex: 1 },
    title: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
  });
