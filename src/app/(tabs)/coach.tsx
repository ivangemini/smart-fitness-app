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
import { parseCoachActivityProgressContext } from '@/features/coach/coachActivityProgressContext';
import { getCoachActivityProgressContextCopy } from '@/features/coach/coachActivityProgressContextCopy';
import { parseCoachBodyProgressContext } from '@/features/coach/coachBodyProgressContext';
import { getCoachBodyProgressContextCopy } from '@/features/coach/coachBodyProgressContextCopy';
import { buildCoachHighlightsProgressFacts } from '@/features/coach/coachHighlightsProgressFacts';
import { parseCoachHighlightsProgressContext } from '@/features/coach/coachHighlightsProgressContext';
import { getCoachHighlightsProgressContextCopy } from '@/features/coach/coachHighlightsProgressContextCopy';
import { parseCoachMeasurementProgressContext } from '@/features/coach/coachMeasurementProgressContext';
import { getCoachMeasurementProgressContextCopy } from '@/features/coach/coachMeasurementProgressContextCopy';
import { buildCoachFactPacket } from '@/features/coach/coachRetrieval';
import {
  parseCoachProgressContext,
  type CoachProgressSearchParams,
} from '@/features/coach/coachProgressContext';
import { getCoachProgressContextCopy } from '@/features/coach/coachProgressContextCopy';
import {
  buildCoachMeasurementProgressFactPacket,
  buildCoachWeightProgressFactPacket,
} from '@/features/coach/coachScopedRetrieval';
import { useCoachRetrievalSources } from '@/features/coach/useCoachRetrievalSources';
import { companionCopy } from '@/features/companion/companionCopy';
import { CompanionProgressCard } from '@/features/companion/CompanionProgressCard';
import { deriveCompanionProgress } from '@/features/companion/companionProgression';
import { ProactiveInsightCard } from '@/features/companion/ProactiveInsightCard';
import { getProactiveInsightCopy } from '@/features/companion/proactiveInsightCopy';
import { useProactiveInsight } from '@/features/companion/useProactiveInsight';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';

const COACH_ACTIONS = [
  {
    labelKey: 'coach.addRecoveryCheckIn' as const,
    route: '/profile/recovery-check-in' as const,
  },
  {
    labelKey: 'coach.manageLimitations' as const,
    route: '/profile/limitations' as const,
  },
  {
    labelKey: 'coach.openSafetyRecovery' as const,
    route: '/profile/safety-recovery' as const,
  },
  {
    labelKey: 'coach.openCombinedReview' as const,
    route: '/profile/combined-review' as const,
  },
  {
    labelKey: 'coach.openCombinedProposal' as const,
    route: '/profile/combined-proposal' as const,
  },
] as const;

export default function CoachScreen() {
  const { colors } = useAppTheme();
  const { formatNumber, locale, t } = useLocalization();
  const { user } = useAuthSession();
  const { workoutSessions } = useWorkoutState();
  const retrievalSources = useCoachRetrievalSources();
  const searchParams = useLocalSearchParams();
  const safeAreaInsets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const progress = useMemo(
    () => deriveCompanionProgress(workoutSessions),
    [workoutSessions],
  );
  const { dismiss: dismissProactiveInsight, insight: proactiveInsight } =
    useProactiveInsight({
      sessions: workoutSessions,
      userId: user?.id ?? null,
    });
  const progressContext = useMemo(
    () =>
      parseCoachProgressContext(searchParams as CoachProgressSearchParams),
    [searchParams],
  );
  const bodyProgressContext = useMemo(
    () =>
      parseCoachBodyProgressContext(searchParams as CoachProgressSearchParams),
    [searchParams],
  );
  const measurementProgressContext = useMemo(
    () =>
      parseCoachMeasurementProgressContext(
        searchParams as CoachProgressSearchParams,
      ),
    [searchParams],
  );
  const activityProgressContext = useMemo(
    () =>
      parseCoachActivityProgressContext(
        searchParams as CoachProgressSearchParams,
      ),
    [searchParams],
  );
  const highlightsProgressContext = useMemo(
    () =>
      parseCoachHighlightsProgressContext(
        searchParams as CoachProgressSearchParams,
      ),
    [searchParams],
  );
  const progressPacket = useMemo(
    () =>
      progressContext
        ? buildCoachFactPacket({
            request: progressContext.request,
            sources: retrievalSources,
          })
        : null,
    [progressContext, retrievalSources],
  );
  const bodyProgressPacket = useMemo(
    () =>
      bodyProgressContext
        ? buildCoachWeightProgressFactPacket({
            request: bodyProgressContext.request,
            sources: retrievalSources,
          })
        : null,
    [bodyProgressContext, retrievalSources],
  );
  const measurementProgressPacket = useMemo(
    () =>
      measurementProgressContext
        ? buildCoachMeasurementProgressFactPacket({
            request: measurementProgressContext.request,
            sources: retrievalSources,
            measurementKey: measurementProgressContext.measurementKey,
          })
        : null,
    [measurementProgressContext, retrievalSources],
  );
  const activityProgressPacket = useMemo(
    () =>
      activityProgressContext
        ? buildCoachFactPacket({
            request: activityProgressContext.request,
            sources: retrievalSources,
          })
        : null,
    [activityProgressContext, retrievalSources],
  );
  const highlightsProgressFacts = useMemo(
    () =>
      highlightsProgressContext
        ? buildCoachHighlightsProgressFacts({
            sessions: workoutSessions,
            endAt: highlightsProgressContext.endAt,
            days: highlightsProgressContext.retrievalDays,
          })
        : null,
    [highlightsProgressContext, workoutSessions],
  );
  const copy = companionCopy[locale];
  const proactiveCopy = proactiveInsight
    ? getProactiveInsightCopy(locale, proactiveInsight, formatNumber)
    : null;
  const contextCopy = getCoachProgressContextCopy(locale);
  const bodyContextCopy = getCoachBodyProgressContextCopy(locale);
  const measurementContextCopy = getCoachMeasurementProgressContextCopy(locale);
  const activityContextCopy = getCoachActivityProgressContextCopy(locale);
  const highlightsContextCopy = getCoachHighlightsProgressContextCopy(locale);
  const exerciseHistory = progressPacket?.ok
    ? progressPacket.data.facts.exerciseHistory ?? null
    : null;
  const bodyMetrics = bodyProgressPacket?.ok
    ? bodyProgressPacket.data.facts.bodyMetrics ?? null
    : null;
  const measurementMetrics = measurementProgressPacket?.ok
    ? measurementProgressPacket.data.facts.bodyMetrics ?? null
    : null;
  const trainingSummary = activityProgressPacket?.ok
    ? activityProgressPacket.data.facts.trainingSummary ?? null
    : null;
  const exerciseName =
    progressContext?.request.exerciseName ??
    exerciseHistory?.exercise.exerciseName ??
    null;
  const measurementLabel = measurementMetrics?.measurements[0]?.label ?? null;

  const openProactiveEvidence = () => {
    if (!proactiveInsight) return;
    if (proactiveInsight.kind === 'consistency_up') {
      router.push('/activity-progress');
      return;
    }
    router.push({
      pathname: '/training-progress',
      params: {
        exerciseId: proactiveInsight.exerciseId,
        exerciseName: proactiveInsight.exerciseName,
      },
    });
  };

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

        <CompanionProgressCard
          colors={colors}
          locale={locale}
          progress={progress}
        />

        {proactiveInsight && proactiveCopy ? (
          <ProactiveInsightCard
            copy={proactiveCopy}
            onDismiss={() => {
              void dismissProactiveInsight();
            }}
            onOpenEvidence={openProactiveEvidence}
          />
        ) : null}

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
              <Text selectable style={styles.contextSummary}>
                {contextCopy.unavailable}
              </Text>
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

        {bodyProgressContext ? (
          <AppCard>
            <Text style={styles.title}>{bodyContextCopy.title}</Text>
            <Text style={styles.body}>{bodyContextCopy.description}</Text>
            <Text selectable style={styles.contextSummary}>
              {bodyMetrics
                ? bodyMetrics.weights.length > 0
                  ? bodyContextCopy.summary(
                      formatNumber(bodyMetrics.weights.length),
                      formatNumber(bodyProgressContext.requestedDays),
                    )
                  : bodyContextCopy.noMatchingHistory
                : bodyContextCopy.unavailable}
            </Text>
            <AppButton
              label={bodyContextCopy.openProgress}
              onPress={() => router.push('/weight-details')}
              variant="secondary"
            />
          </AppCard>
        ) : null}

        {measurementProgressContext ? (
          <AppCard>
            <Text style={styles.title}>{measurementContextCopy.title}</Text>
            <Text style={styles.body}>{measurementContextCopy.description}</Text>
            <Text selectable style={styles.contextSummary}>
              {measurementMetrics
                ? measurementMetrics.measurements.length > 0 && measurementLabel
                  ? measurementContextCopy.summary(
                      measurementLabel,
                      formatNumber(measurementMetrics.measurements.length),
                      formatNumber(measurementProgressContext.retrievalDays),
                    )
                  : measurementContextCopy.noMatchingHistory
                : measurementContextCopy.unavailable}
            </Text>
            {measurementProgressContext.requestedDays >
            measurementProgressContext.retrievalDays ? (
              <Text selectable style={styles.contextNote}>
                {measurementContextCopy.boundedPeriod(
                  formatNumber(measurementProgressContext.requestedDays),
                  formatNumber(measurementProgressContext.retrievalDays),
                )}
              </Text>
            ) : null}
            <AppButton
              label={measurementContextCopy.openProgress}
              onPress={() => router.push('/measurement-progress')}
              variant="secondary"
            />
          </AppCard>
        ) : null}

        {activityProgressContext ? (
          <AppCard>
            <Text style={styles.title}>{activityContextCopy.title}</Text>
            <Text style={styles.body}>{activityContextCopy.description}</Text>
            <Text selectable style={styles.contextSummary}>
              {trainingSummary
                ? trainingSummary.frequency.sessionCount > 0
                  ? activityContextCopy.summary(
                      formatNumber(trainingSummary.frequency.sessionCount),
                      formatNumber(activityProgressContext.retrievalDays),
                    )
                  : activityContextCopy.noMatchingHistory
                : activityContextCopy.unavailable}
            </Text>
            {activityProgressContext.requestedDays >
            activityProgressContext.retrievalDays ? (
              <Text selectable style={styles.contextNote}>
                {activityContextCopy.boundedPeriod(
                  formatNumber(activityProgressContext.requestedDays),
                  formatNumber(activityProgressContext.retrievalDays),
                )}
              </Text>
            ) : null}
            <AppButton
              label={activityContextCopy.openProgress}
              onPress={() => router.push('/activity-progress')}
              variant="secondary"
            />
          </AppCard>
        ) : null}

        {highlightsProgressContext && highlightsProgressFacts ? (
          <AppCard>
            <Text style={styles.title}>{highlightsContextCopy.title}</Text>
            <Text style={styles.body}>{highlightsContextCopy.description}</Text>
            <Text selectable style={styles.contextSummary}>
              {highlightsProgressFacts.evidence.sessionCount > 0 &&
              highlightsProgressFacts.evidence.estimated1RmSetCount > 0
                ? highlightsContextCopy.summary(
                    formatNumber(highlightsProgressFacts.evidence.sessionCount),
                    formatNumber(highlightsProgressContext.retrievalDays),
                  )
                : highlightsContextCopy.noMatchingHistory}
            </Text>
            <Text selectable style={styles.contextNote}>
              {highlightsContextCopy.recordBoundary}
            </Text>
            {highlightsProgressContext.requestedDays >
            highlightsProgressContext.retrievalDays ? (
              <Text selectable style={styles.contextNote}>
                {highlightsContextCopy.boundedPeriod(
                  formatNumber(highlightsProgressContext.requestedDays),
                  formatNumber(highlightsProgressContext.retrievalDays),
                )}
              </Text>
            ) : null}
            <AppButton
              label={highlightsContextCopy.openProgress}
              onPress={() => router.push('/progress-highlights')}
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
    container: {
      gap: Spacing.three,
      maxWidth: MaxContentWidth,
      width: '100%',
    },
    content: {
      alignItems: 'center',
      flexGrow: 1,
      paddingHorizontal: Spacing.three,
    },
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
    headerRow: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: Spacing.three,
    },
    screen: { backgroundColor: colors.background, flex: 1 },
    title: {
      color: colors.textPrimary,
      flexShrink: 1,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
  });