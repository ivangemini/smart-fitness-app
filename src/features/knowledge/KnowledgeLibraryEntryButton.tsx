import { router } from 'expo-router';

import { AppButton } from '@/components/ui/AppButton';
import { useLocalization } from '@/localization';

import { getKnowledgeCopy } from './knowledgeCopy';

export function KnowledgeLibraryEntryButton() {
  const { locale } = useLocalization();
  const copy = getKnowledgeCopy(locale);

  return (
    <AppButton
      label={copy.openLibrary}
      onPress={() => router.push('/knowledge')}
      variant="secondary"
    />
  );
}
