import type { SupportedLocale } from '@/localization';

export type SocialStoryReactionCopy = {
  chooseReaction: string;
  clearReaction: string;
  clap: string;
  fire: string;
  loadFailed: string;
  love: string;
  reactionsCount: (count: number) => string;
  strong: string;
  updateFailed: string;
};

const copy: Record<SupportedLocale, SocialStoryReactionCopy> = {
  en: {
    chooseReaction: 'React to story',
    clearReaction: 'Remove reaction',
    clap: 'Clap',
    fire: 'Fire',
    loadFailed: 'Story reactions could not be loaded.',
    love: 'Love',
    reactionsCount: (count) => `${count} ${count === 1 ? 'reaction' : 'reactions'}`,
    strong: 'Strong',
    updateFailed: 'The story reaction could not be updated.',
  },
  ru: {
    chooseReaction: 'Реакция на историю',
    clearReaction: 'Убрать реакцию',
    clap: 'Аплодисменты',
    fire: 'Огонь',
    loadFailed: 'Не удалось загрузить реакции на историю.',
    love: 'Любовь',
    reactionsCount: (count) => `Реакций: ${count}`,
    strong: 'Сила',
    updateFailed: 'Не удалось обновить реакцию на историю.',
  },
};

export const getSocialStoryReactionCopy = (locale: SupportedLocale) => copy[locale];
