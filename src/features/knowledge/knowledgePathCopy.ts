import type { KnowledgeLearningStateValue } from '@/api/knowledge';
import type { SupportedLocale } from '@/localization';

const EN = {
  openPaths: 'Browse learning paths',
  pathsTitle: 'Learning paths',
  pathsSubtitle: 'Reviewed sequences of current lessons. Open, skip, and revisit freely.',
  loading: 'Loading reviewed paths…',
  emptyTitle: 'No learning paths available',
  emptyBody: 'Reviewed paths will appear here when every required lesson is current.',
  errorTitle: 'Learning paths are unavailable right now',
  errorBody: 'Check your connection and try again.',
  retry: 'Try again',
  back: 'Back',
  steps: (count: number) => `${count} lessons`,
  openPath: 'Open path',
  openLesson: 'Open lesson',
  exactVersionUnavailableTitle: 'This lesson version is no longer available',
  exactVersionUnavailableBody:
    'The learning path points to a reviewed exact version that has changed. Return to the path and refresh it.',
  stateLabel: (state: KnowledgeLearningStateValue | null) => {
    if (state === 'understood') return 'Understood';
    if (state === 'read') return 'Read';
    return 'Not started';
  },
};

const RU: typeof EN = {
  openPaths: 'Открыть учебные маршруты',
  pathsTitle: 'Учебные маршруты',
  pathsSubtitle: 'Проверенные последовательности актуальных материалов. Можно свободно пропускать и возвращаться.',
  loading: 'Загружаем учебные маршруты…',
  emptyTitle: 'Учебные маршруты пока недоступны',
  emptyBody: 'Они появятся здесь, когда все обязательные материалы маршрута будут актуальны.',
  errorTitle: 'Учебные маршруты сейчас недоступны',
  errorBody: 'Проверь подключение и попробуй снова.',
  retry: 'Повторить',
  back: 'Назад',
  steps: (count: number) => `Материалов: ${count}`,
  openPath: 'Открыть маршрут',
  openLesson: 'Открыть материал',
  exactVersionUnavailableTitle: 'Эта версия материала больше недоступна',
  exactVersionUnavailableBody:
    'Маршрут привязан к конкретной проверенной версии, которая изменилась. Вернись к маршруту и обнови его.',
  stateLabel: (state: KnowledgeLearningStateValue | null) => {
    if (state === 'understood') return 'Понятно';
    if (state === 'read') return 'Прочитано';
    return 'Не начато';
  },
};

export const getKnowledgePathCopy = (locale: SupportedLocale) =>
  locale === 'ru' ? RU : EN;
