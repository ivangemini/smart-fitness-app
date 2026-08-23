import { Stack } from 'expo-router';

import { TrainerCollaborationScreen } from '@/features/trainer/TrainerCollaborationScreen';

export default function TrainerCollaborationSettingsScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TrainerCollaborationScreen />
    </>
  );
}
