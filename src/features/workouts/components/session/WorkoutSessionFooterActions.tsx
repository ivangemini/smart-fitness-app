import { View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import type { createStyles } from '@/features/workouts/styles/workoutSessionScreenStyles';
import { useLocalization } from '@/localization';

type WorkoutSessionFooterActionsProps = {
  onAddExercises: () => void;
  onTestGif: () => void;
  styles: ReturnType<typeof createStyles>;
  visible: boolean;
};

export function WorkoutSessionFooterActions({
  onAddExercises,
  onTestGif,
  styles,
  visible,
}: WorkoutSessionFooterActionsProps) {
  const { t } = useLocalization();
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.sessionFooterActions}>
      <PrimaryButton label={t('workouts.session.addExercises')} onPress={onAddExercises} />
      <SecondaryButton label={t('workouts.session.testGif')} onPress={onTestGif} />
    </View>
  );
}
