import { X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LiquidGlassIconButton } from '@/components/ui/LiquidGlassIconButton';
import { LiquidGlassSurface } from '@/components/ui/LiquidGlassSurface';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { Spacing } from '@/constants/theme';
import {
  getReviewedExerciseIntelligence,
  selectExerciseIntelligenceText,
} from '@/features/exercises/exerciseIntelligence';
import { loadExercisePreference } from '@/features/exercises/preferencesRepository';
import { exerciseRepository } from '@/features/exercises/repository';
import {
  buildSmartReplaceCandidates,
  type SmartReplaceCandidate,
} from '@/features/exercises/smartReplace';
import type { Exercise as RepositoryExercise } from '@/features/exercises/types';
import { buildTemplateSmartReplacePreview } from '@/features/workouts/templateSmartReplacePreview';
import { useLocalization } from '@/localization';
import { getTemplateSmartReplaceCopy } from '@/localization/templateSmartReplaceCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';
import type {
  Exercise,
  Workout,
  WorkoutTemplateReplacementPatch,
  WorkoutTemplateReplacementPatchStatus,
} from '@/types';

import { createTemplateSmartReplaceModalStyles } from './TemplateSmartReplaceModal.styles';

type Props = {
  exerciseCatalog: readonly Exercise[];
  onApply: (
    patch: WorkoutTemplateReplacementPatch,
  ) => Promise<WorkoutTemplateReplacementPatchStatus>;
  onClose: () => void;
  sourceExerciseId: string | null;
  workout: Workout;
};

export function TemplateSmartReplaceModal({
  exerciseCatalog,
  onApply,
  onClose,
  sourceExerciseId,
  workout,
}: Props) {
  const { colors } = useAppTheme();
  const { locale } = useLocalization();
  const copy = useMemo(() => getTemplateSmartReplaceCopy(locale), [locale]);
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () => createTemplateSmartReplaceModalStyles(colors),
    [colors],
  );
  const [query, setQuery] = useState('');
  const [reviewedCandidates, setReviewedCandidates] = useState<
    SmartReplaceCandidate[]
  >([]);
  const [loadingReviewed, setLoadingReviewed] = useState(false);
  const [selectedReplacementId, setSelectedReplacementId] = useState<string | null>(
    null,
  );
  const [applyStatus, setApplyStatus] = useState<
    WorkoutTemplateReplacementPatchStatus | 'applying' | null
  >(null);

  const intelligence = useMemo(
    () =>
      sourceExerciseId
        ? getReviewedExerciseIntelligence(sourceExerciseId)
        : undefined,
    [sourceExerciseId],
  );
  const catalogById = useMemo(
    () => new Map(exerciseCatalog.map((exercise) => [exercise.id, exercise] as const)),
    [exerciseCatalog],
  );
  const occupiedIds = useMemo(
    () =>
      new Set(
        workout.exercises
          .map((exercise) => exercise.id)
          .filter((exerciseId) => exerciseId !== sourceExerciseId),
      ),
    [sourceExerciseId, workout.exercises],
  );

  useEffect(() => {
    setQuery('');
    setSelectedReplacementId(null);
    setApplyStatus(null);
  }, [sourceExerciseId, workout.id]);

  useEffect(() => {
    let cancelled = false;
    const reviewedSubstitutions = intelligence?.substitutions ?? [];

    if (!sourceExerciseId || reviewedSubstitutions.length === 0) {
      setReviewedCandidates([]);
      setLoadingReviewed(false);
      return () => {
        cancelled = true;
      };
    }

    const load = async () => {
      setLoadingReviewed(true);
      try {
        const resolved = await Promise.all(
          reviewedSubstitutions.map((substitution) =>
            exerciseRepository.getExerciseById(substitution.exerciseId),
          ),
        );
        const resolvedExercises = resolved.filter(
          (exercise): exercise is RepositoryExercise => exercise !== null,
        );
        const preferences = Object.fromEntries(
          await Promise.all(
            resolvedExercises.map(async (exercise) => [
              exercise.id,
              await loadExercisePreference(exercise.id),
            ] as const),
          ),
        );
        const next = buildSmartReplaceCandidates({
          currentExerciseId: sourceExerciseId,
          reviewedSubstitutions,
          resolvedExercises,
          preferences,
        }).filter(
          (candidate) =>
            catalogById.has(candidate.exercise.id) &&
            !occupiedIds.has(candidate.exercise.id),
        );
        if (!cancelled) setReviewedCandidates(next);
      } catch {
        if (!cancelled) setReviewedCandidates([]);
      } finally {
        if (!cancelled) setLoadingReviewed(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [catalogById, intelligence, occupiedIds, sourceExerciseId]);

  const reviewedIds = useMemo(
    () => new Set(reviewedCandidates.map((candidate) => candidate.exercise.id)),
    [reviewedCandidates],
  );
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const manualOptions = useMemo(
    () =>
      exerciseCatalog
        .filter(
          (exercise) =>
            exercise.id !== sourceExerciseId &&
            !occupiedIds.has(exercise.id) &&
            !reviewedIds.has(exercise.id),
        )
        .filter((exercise) =>
          normalizedQuery
            ? `${exercise.name} ${exercise.id}`
                .toLocaleLowerCase()
                .includes(normalizedQuery)
            : true,
        )
        .sort((left, right) => left.name.localeCompare(right.name)),
    [
      exerciseCatalog,
      normalizedQuery,
      occupiedIds,
      reviewedIds,
      sourceExerciseId,
    ],
  );

  const preview = useMemo(
    () =>
      sourceExerciseId && selectedReplacementId
        ? buildTemplateSmartReplacePreview({
            workout,
            sourceExerciseId,
            replacementExerciseId: selectedReplacementId,
            exerciseCatalog,
          })
        : null,
    [exerciseCatalog, selectedReplacementId, sourceExerciseId, workout],
  );

  if (!sourceExerciseId) return null;

  const chooseReplacement = (exerciseId: string) => {
    setApplyStatus(null);
    setSelectedReplacementId(exerciseId);
  };

  const applyReplacement = async () => {
    if (!sourceExerciseId || preview?.status !== 'ready') return;
    setApplyStatus('applying');
    const status = await onApply({
      templateId: preview.templateId,
      sourceExerciseId,
      replacementExerciseId: preview.replacementExercise.id,
      expectedFingerprint: preview.expectedFingerprint,
    });
    if (status === 'applied') {
      onClose();
      return;
    }
    setApplyStatus(status);
  };

  const reviewedHeader = (
    <View style={styles.headerContent}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>
        </View>
        <LiquidGlassIconButton
          accessibilityLabel={copy.cancel}
          Icon={X}
          onPress={onClose}
        />
      </View>

      <Text style={styles.sectionTitle}>{copy.reviewedSuggestions}</Text>
      {loadingReviewed ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.accent} />
          <Text style={styles.secondaryText}>{copy.loading}</Text>
        </View>
      ) : reviewedCandidates.length === 0 ? (
        <Text style={styles.secondaryText}>{copy.noReviewedSuggestions}</Text>
      ) : (
        <View style={styles.reviewedList}>
          {reviewedCandidates.map((candidate) => {
            const replacement = catalogById.get(candidate.exercise.id);
            if (!replacement) return null;
            return (
              <Pressable
                accessibilityRole="button"
                key={candidate.exercise.id}
                onPress={() => chooseReplacement(candidate.exercise.id)}
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                ]}>
                <Text style={styles.optionTitle}>{replacement.name}</Text>
                <Text style={styles.optionDetail}>
                  {selectExerciseIntelligenceText(
                    candidate.reviewedSubstitution.rationale,
                    locale,
                  )}
                </Text>
                <Text style={styles.reason}>{copy.reviewedReason}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <Text style={styles.sectionTitle}>{copy.manualCatalog}</Text>
      <TextInput
        accessibilityLabel={copy.searchPlaceholder}
        autoCapitalize="none"
        onChangeText={setQuery}
        placeholder={copy.searchPlaceholder}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.accent}
        style={styles.searchInput}
        value={query}
      />
    </View>
  );

  const previewBody = (
    <View style={styles.previewBody}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{copy.previewTitle}</Text>
          <Text style={styles.subtitle}>{workout.title}</Text>
        </View>
        <LiquidGlassIconButton
          accessibilityLabel={copy.cancel}
          Icon={X}
          onPress={onClose}
        />
      </View>

      {preview?.status === 'ready' ? (
        <>
          <View style={styles.comparisonRow}>
            <View style={styles.comparisonColumn}>
              <Text style={styles.label}>{copy.before}</Text>
              <Text style={styles.comparisonValue}>
                {preview.sourceExercise.name}
              </Text>
            </View>
            <Text accessibilityElementsHidden style={styles.arrow}>→</Text>
            <View style={styles.comparisonColumn}>
              <Text style={styles.label}>{copy.after}</Text>
              <Text style={styles.comparisonValue}>
                {preview.replacementExercise.name}
              </Text>
            </View>
          </View>
          <Text style={styles.secondaryText}>
            {copy.prescriptionRows(preview.affectedPrescriptionRows.length)}
          </Text>
          <Text style={styles.secondaryText}>{copy.preserved}</Text>
          {applyStatus === 'stale' ? (
            <Text style={styles.errorText}>{copy.stale}</Text>
          ) : null}
          {applyStatus === 'blocked' ? (
            <Text style={styles.errorText}>{copy.blocked}</Text>
          ) : null}
          <View style={styles.actions}>
            <SecondaryButton
              disabled={applyStatus === 'applying'}
              label={copy.chooseAnother}
              onPress={() => {
                setSelectedReplacementId(null);
                setApplyStatus(null);
              }}
            />
            <PrimaryButton
              disabled={applyStatus === 'applying'}
              label={applyStatus === 'applying' ? copy.applying : copy.apply}
              onPress={() => void applyReplacement()}
            />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.errorText}>{copy.unavailable}</Text>
          <SecondaryButton
            label={copy.chooseAnother}
            onPress={() => setSelectedReplacementId(null)}
          />
        </>
      )}
    </View>
  );

  return (
    <View
      style={[
        styles.overlay,
        {
          paddingBottom: insets.bottom + Spacing.three,
          paddingTop: insets.top + Spacing.three,
        },
      ]}>
      <LiquidGlassSurface radius={28} style={styles.panel} variant="elevated">
        {selectedReplacementId ? (
          previewBody
        ) : (
          <FlatList
            contentContainerStyle={styles.listContent}
            data={manualOptions}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(exercise) => exercise.id}
            ListEmptyComponent={
              <Text style={styles.secondaryText}>{copy.noManualResults}</Text>
            }
            ListHeaderComponent={reviewedHeader}
            renderItem={({ item }) => (
              <Pressable
                accessibilityRole="button"
                onPress={() => chooseReplacement(item.id)}
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                ]}>
                <Text style={styles.optionTitle}>{item.name}</Text>
                <Text style={styles.optionDetail}>{item.id}</Text>
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </LiquidGlassSurface>
    </View>
  );
}
