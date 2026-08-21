import type { KnowledgeLocale } from '@/api/knowledge/contracts';

export const getCoachLearnCopy = (locale: KnowledgeLocale) =>
  locale === 'ru'
    ? {
        title: 'Узнать больше',
        intro: 'Проверенные материалы, связанные с этим выводом Coach.',
        openLesson: 'Открыть материал',
      }
    : {
        title: 'Learn more',
        intro: 'Reviewed education related to this Coach finding.',
        openLesson: 'Open lesson',
      };
