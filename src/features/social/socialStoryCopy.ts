import type { SupportedLocale } from '@/localization';

export type SocialStoryCopy = {
  close: string;
  loadError: string;
  loading: string;
  openStory: string;
  retry: string;
  stories: string;
  storyUnavailable: string;
};

const copy: Record<SupportedLocale, SocialStoryCopy> = {
  en: {
    close: 'Close story',
    loadError: 'Stories could not be loaded.',
    loading: 'Loading story',
    openStory: 'Open story',
    retry: 'Retry',
    stories: 'Stories',
    storyUnavailable: 'This story is no longer available.',
  },
  ru: {
    close: 'Закрыть историю',
    loadError: 'Не удалось загрузить истории.',
    loading: 'Загрузка истории',
    openStory: 'Открыть историю',
    retry: 'Повторить',
    stories: 'Истории',
    storyUnavailable: 'Эта история больше недоступна.',
  },
};

export const getSocialStoryCopy = (locale: SupportedLocale) => copy[locale];
