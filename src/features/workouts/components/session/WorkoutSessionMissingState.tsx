import { Text, View } from 'react-native';

import { SecondaryButton } from '@/components/ui/SecondaryButton';
import type { createStyles } from '@/features/workouts/styles/workoutSessionScreenStyles';
import { useLocalization } from '@/localization';

type WorkoutSessionMissingStateProps = {
  backgroundColor: string;
  onBackToWorkouts: () => void;
  styles: ReturnType<typeof createStyles>;
};

export function WorkoutSessionMissingState({
  backgroundColor,
  onBackToWorkouts,
  styles,
}: WorkoutSessionMissingStateProps) {
  const { t } = useLocalization();

  return (
    <View style={[styles.screen, { backgroundColor }]}>
      <View style={styles.loadingState}>
        <Text style={styles.emptyTitle}>{t('workouts.session.missingTitle')}</Text>
        <SecondaryButton
          label={t('workouts.session.backToWorkouts')}
          onPress={onBackToWorkouts}
        />
      </View>
    </View>
  );
}
