import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { FormField } from '@/components/ui/FormField';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAppActions } from '@/context/AppContext';
import { createUuid, formatShortDate } from '@/lib';
import { useLocalization } from '@/localization';
import { getWeightEntryCopy } from '@/localization/weightEntryCopy';
import { useAppTheme } from '@/theme/AppThemeProvider';
import { displayWeightInputToKg, parseDisplayNumber, useUnitPreferences } from '@/units';

export default function WeightEntryScreen() {
  const { colors } = useAppTheme();
  const { addWeightEntry } = useAppActions();
  const { locale } = useLocalization();
  const copy = useMemo(() => getWeightEntryCopy(locale), [locale]);
  const { weight: weightUnit } = useUnitPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const safeAreaInsets = useSafeAreaInsets();
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');

  const saveWeight = () => {
    const parsedDisplayWeight = parseDisplayNumber(weight);
    const parsedWeightKg = Number(displayWeightInputToKg(weight, weightUnit));

    if (
      !Number.isFinite(parsedDisplayWeight) ||
      parsedDisplayWeight <= 0 ||
      !Number.isFinite(parsedWeightKg)
    ) {
      setError(copy.invalidWeight);
      return;
    }

    const now = new Date();
    addWeightEntry({
      id: createUuid(),
      date: formatShortDate(now.toISOString()),
      weight: parsedWeightKg,
      createdAt: now.toISOString(),
    });
    setError('');
    setWeight('');
    router.back();
  };

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[
        styles.content,
        { paddingBottom: safeAreaInsets.bottom + Spacing.eight },
      ]}
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      keyboardShouldPersistTaps="handled"
      style={styles.screen}>
      <View style={styles.container}>
        <SectionHeader title={copy.title} />
        <AppCard>
          <View style={styles.fieldGroup}>
            <FormField
              errorMessage={error || null}
              keyboardType="decimal-pad"
              label={copy.weightLabel(weightUnit)}
              onChangeText={(value) => {
                setWeight(value);
                if (error) setError('');
              }}
              placeholder={weightUnit === 'lb' ? '182.3' : '82.7'}
              value={weight}
            />
          </View>
          <AppButton label={copy.save} onPress={saveWeight} />
        </AppCard>
        <AppButton label={copy.cancel} onPress={() => router.back()} variant="secondary" />
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    container: { gap: Spacing.three, maxWidth: MaxContentWidth, width: '100%' },
    content: { alignItems: 'center', flexGrow: 1, padding: Spacing.three },
    fieldGroup: { marginBottom: Spacing.two },
    screen: { backgroundColor: colors.background, flex: 1 },
  });
