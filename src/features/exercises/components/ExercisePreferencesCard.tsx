import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { FormField } from '@/components/ui/FormField';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { getExercisePreferencesCopy } from '@/localization/exercisePreferencesCopy';
import type { SupportedLocale } from '@/localization/messages';
import { useAppTheme } from '@/theme/AppThemeProvider';

import {
  EMPTY_EXERCISE_PREFERENCE,
  EXERCISE_PREFERENCE_NOTE_MAX_LENGTH,
  exercisePreferencesEqual,
  type ExercisePreference,
} from '../preferences';
import {
  loadExercisePreference,
  saveExercisePreference,
} from '../preferencesRepository';

type PreferenceStatus = 'idle' | 'saved' | 'load_error' | 'save_error';

type ExercisePreferencesCardProps = {
  exerciseId: string;
  locale: SupportedLocale;
};

export function ExercisePreferencesCard({
  exerciseId,
  locale,
}: ExercisePreferencesCardProps) {
  const { colors } = useAppTheme();
  const copy = useMemo(() => getExercisePreferencesCopy(locale), [locale]);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [preference, setPreference] = useState<ExercisePreference>({
    ...EMPTY_EXERCISE_PREFERENCE,
  });
  const [savedPreference, setSavedPreference] = useState<ExercisePreference>({
    ...EMPTY_EXERCISE_PREFERENCE,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<PreferenceStatus>('idle');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setStatus('idle');

    const load = async () => {
      try {
        const nextPreference = await loadExercisePreference(exerciseId);
        if (cancelled) return;
        setPreference(nextPreference);
        setSavedPreference(nextPreference);
      } catch {
        if (cancelled) return;
        const emptyPreference = { ...EMPTY_EXERCISE_PREFERENCE };
        setPreference(emptyPreference);
        setSavedPreference(emptyPreference);
        setStatus('load_error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [exerciseId]);

  const dirty = !exercisePreferencesEqual(preference, savedPreference);
  const canSave = !loading && !saving && (dirty || status === 'load_error');

  const updatePreference = (next: ExercisePreference) => {
    setPreference(next);
    setStatus('idle');
  };

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    setStatus('idle');

    try {
      const persisted = await saveExercisePreference(exerciseId, preference);
      setPreference(persisted);
      setSavedPreference(persisted);
      setStatus('saved');
    } catch {
      setStatus('save_error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppCard>
      <View style={styles.stack}>
        <View style={styles.copyStack}>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.secondary}>{copy.description}</Text>
        </View>

        <View style={styles.preferenceRow}>
          <View style={styles.preferenceCopy}>
            <Text style={styles.label}>{copy.avoidTitle}</Text>
            <Text style={styles.secondary}>{copy.avoidDescription}</Text>
          </View>
          <Switch
            accessibilityLabel={copy.avoidTitle}
            accessibilityHint={copy.avoidDescription}
            disabled={loading || saving}
            onValueChange={(avoid) => updatePreference({ ...preference, avoid })}
            value={preference.avoid}
          />
        </View>

        <FormField
          accessibilityLabel={copy.noteLabel}
          editable={!loading && !saving}
          helperText={copy.noteHelper(EXERCISE_PREFERENCE_NOTE_MAX_LENGTH)}
          label={copy.noteLabel}
          maxLength={EXERCISE_PREFERENCE_NOTE_MAX_LENGTH}
          multiline
          onChangeText={(note) => updatePreference({ ...preference, note })}
          placeholder={copy.notePlaceholder}
          style={styles.noteInput}
          value={preference.note}
        />

        <AppButton
          disabled={!canSave}
          label={saving ? copy.saving : copy.save}
          loading={saving}
          onPress={() => void save()}
        />

        {status === 'saved' ? (
          <Text accessibilityLiveRegion="polite" style={styles.successText}>
            {copy.saved}
          </Text>
        ) : null}
        {status === 'load_error' || status === 'save_error' ? (
          <Text accessibilityLiveRegion="polite" style={styles.errorText}>
            {status === 'load_error' ? copy.loadError : copy.saveError}
          </Text>
        ) : null}
      </View>
    </AppCard>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    copyStack: { gap: Spacing.one },
    errorText: {
      color: colors.error,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    label: {
      color: colors.textPrimary,
      fontSize: Typography.body.fontSize,
      fontWeight: '700',
      lineHeight: Typography.body.lineHeight,
    },
    noteInput: {
      minHeight: 96,
      textAlignVertical: 'top',
    },
    preferenceCopy: { flex: 1, gap: Spacing.one },
    preferenceRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.three,
    },
    secondary: {
      color: colors.textSecondary,
      fontSize: Typography.callout.fontSize,
      lineHeight: Typography.callout.lineHeight,
    },
    stack: { gap: Spacing.three },
    successText: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
    title: {
      color: colors.textPrimary,
      fontSize: Typography.cardTitle.fontSize,
      fontWeight: Typography.cardTitle.fontWeight,
      lineHeight: Typography.cardTitle.lineHeight,
    },
  });
