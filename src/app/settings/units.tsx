import { StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Spacing } from '@/constants/theme';
import { SettingsScreenLayout } from '@/features/settings/SettingsScreenLayout';
import { useLocalization } from '@/localization';
import {
  getUnitCopy,
  useUnitPreferences,
  type EnergyUnit,
  type LengthUnit,
  type WeightUnit,
} from '@/units';

export default function UnitsSettingsScreen() {
  const { locale } = useLocalization();
  const { energy, length, setEnergyUnit, setLengthUnit, setWeightUnit, weight } = useUnitPreferences();
  const copy = getUnitCopy(locale);
  const weightOptions: ReadonlyArray<{ label: string; value: WeightUnit }> = [
    { label: 'kg', value: 'kg' },
    { label: 'lb', value: 'lb' },
  ];
  const lengthOptions: ReadonlyArray<{ label: string; value: LengthUnit }> = [
    { label: 'cm', value: 'cm' },
    { label: 'in', value: 'in' },
  ];
  const energyOptions: ReadonlyArray<{ label: string; value: EnergyUnit }> = [
    { label: 'kcal', value: 'kcal' },
    { label: 'kJ', value: 'kJ' },
  ];

  return (
    <SettingsScreenLayout subtitle={copy.footer} title={copy.section}>
      <AppCard>
        <SegmentedControl
          accessibilityLabel={copy.weight}
          onChange={setWeightUnit}
          options={weightOptions}
          value={weight}
        />
        <View style={styles.gap} />
        <SegmentedControl
          accessibilityLabel={copy.length}
          onChange={setLengthUnit}
          options={lengthOptions}
          value={length}
        />
        <View style={styles.gap} />
        <SegmentedControl
          accessibilityLabel={copy.energy}
          onChange={setEnergyUnit}
          options={energyOptions}
          value={energy}
        />
      </AppCard>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({ gap: { height: Spacing.two } });
