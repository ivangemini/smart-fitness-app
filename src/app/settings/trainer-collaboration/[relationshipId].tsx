import { Stack, useLocalSearchParams } from 'expo-router';

import { TrainerCollaborationDetailScreen } from '@/features/trainer/TrainerCollaborationDetailScreen';

export default function TrainerCollaborationDetailRoute() {
  const params = useLocalSearchParams<{ relationshipId?: string | string[] }>();
  const relationshipId = Array.isArray(params.relationshipId)
    ? params.relationshipId[0] ?? ''
    : params.relationshipId ?? '';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TrainerCollaborationDetailScreen relationshipId={relationshipId} />
    </>
  );
}
