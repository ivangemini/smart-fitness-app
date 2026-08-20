import type { SupportedLocale } from '@/localization';
import type { KnowledgePathStepLearningView } from './knowledgePathLearningPolicy';

const EN = {
  openPaths: 'Browse learning paths',
  pathsTitle: 'Learning paths',
  pathsSubtitle:
    'Reviewed sequences of current lessons. Open, skip, and revisit freely.',
  loading: 'Loading reviewed paths…',
  emptyTitle: 'No learning paths available',
  emptyBody:
    'Reviewed paths will appear here when every required lesson is current.',
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
  stateLabel: (state: KnowledgePathStepLearningView): string => {
    if (state === 'loading') return 'Loading learning status…';
    if (state === 'unavailable') return 'Learning status unavailable';
    if (state === 'understood') return 'Understood';
    if (state === 'read') return 'Read';
    if (state === 'refresh_useful') return 'Updated lesson available';
    return 'Not started';
  },
};

const RU: typeof EN = {
  openPaths: 'Открыть учебные маршруты',
  pathsTitle: 'Учебные маршруты',
  pathsSubtitle:
    'Проверенные последовательности актуальных материалов. Можно свободно пропускать и возвращаться.',
  loading: 'Загружаем учебные маршруты…',
  emptyTitle: 'Учебные маршруты пока недоступны',
  emptyBody:
    'Они появятся здесь, когда все обязательные материалы маршрута будут актуальны.',
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
  stateLabel: (state: KnowledgePathStepLearningView): string => {
    if (state === 'loading') return 'Загружаем статус обучения…';
    if (state === 'unavailable') return 'Статус обучения недоступен';
    if (state === 'understood') return 'Понятно';
    if (state === 'read') return 'Прочитано';
    if (state === 'refresh_useful') return 'Доступна обновлённая версия';
    return 'Не начато';
  },
};

export const getKnowledgePathCopy = (locale: SupportedLocale) =>
  locale === 'ru' ? RU : EN;
