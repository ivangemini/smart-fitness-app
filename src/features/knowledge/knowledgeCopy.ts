import type { KnowledgeArticleFormat, KnowledgeCategory } from '@/api/knowledge';
import type { SupportedLocale } from '@/localization';

const EN = {
  libraryTitle: 'Learn',
  librarySubtitle: 'Reviewed explanations of training, nutrition, physiology, recovery, body composition, and Labs concepts.',
  searchPlaceholder: 'Search reviewed topics',
  allCategories: 'All',
  conceptsTitle: 'Concepts',
  clearConcept: 'Clear concept filter',
  loading: 'Loading reviewed articles…',
  emptyTitle: 'No articles found',
  emptyBody: 'Try another category, concept, or search phrase.',
  errorTitle: 'Knowledge is unavailable right now',
  errorBody: 'Check your connection and try again.',
  retry: 'Try again',
  openArticle: 'Read article',
  sourcesTitle: 'Reviewed sources',
  evidenceTitle: 'Evidence notes',
  quizTitle: 'Knowledge check',
  quizBody: 'Questions are linked to this exact article version. Answer evaluation will be enabled in the quiz phase.',
  quizCount: (count: number) => `${count} questions available`,
  publishedVersion: (version: number) => `Version ${version}`,
  backToLibrary: 'Back to Learn',
  openLibrary: 'Open Learn library',
  openSource: 'Open source',
} as const;

const RU: typeof EN = {
  libraryTitle: 'Обучение',
  librarySubtitle: 'Проверенные материалы о тренировках, питании, физиологии, восстановлении, композиции тела и отдельных темах анализов.',
  searchPlaceholder: 'Поиск по проверенным темам',
  allCategories: 'Все',
  conceptsTitle: 'Темы',
  clearConcept: 'Сбросить фильтр темы',
  loading: 'Загружаем проверенные статьи…',
  emptyTitle: 'Статьи не найдены',
  emptyBody: 'Попробуй другую категорию, тему или поисковую фразу.',
  errorTitle: 'Раздел обучения сейчас недоступен',
  errorBody: 'Проверь подключение и попробуй снова.',
  retry: 'Повторить',
  openArticle: 'Читать статью',
  sourcesTitle: 'Проверенные источники',
  evidenceTitle: 'Что подтверждают источники',
  quizTitle: 'Проверка знаний',
  quizBody: 'Вопросы привязаны к этой версии статьи. Проверка ответов будет включена на этапе тестов.',
  quizCount: (count: number) => `Доступно вопросов: ${count}`,
  publishedVersion: (version: number) => `Версия ${version}`,
  backToLibrary: 'Назад к обучению',
  openLibrary: 'Открыть библиотеку обучения',
  openSource: 'Открыть источник',
};

export const getKnowledgeCopy = (locale: SupportedLocale) => (locale === 'ru' ? RU : EN);

const CATEGORY_LABELS: Record<SupportedLocale, Record<KnowledgeCategory, string>> = {
  en: {
    training: 'Training',
    nutrition: 'Nutrition',
    physiology: 'Physiology',
    recovery: 'Recovery',
    body_composition: 'Body composition',
    labs: 'Labs',
  },
  ru: {
    training: 'Тренировки',
    nutrition: 'Питание',
    physiology: 'Физиология',
    recovery: 'Восстановление',
    body_composition: 'Композиция тела',
    labs: 'Анализы',
  },
};

const FORMAT_LABELS: Record<SupportedLocale, Record<KnowledgeArticleFormat, string>> = {
  en: {
    quick_lesson: 'Quick lesson',
    standard: 'Article',
    deep_dive: 'Deep dive',
    practical_guide: 'Practical guide',
    reference: 'Reference',
  },
  ru: {
    quick_lesson: 'Короткий урок',
    standard: 'Статья',
    deep_dive: 'Подробный разбор',
    practical_guide: 'Практическое руководство',
    reference: 'Справка',
  },
};

export const getKnowledgeCategoryLabel = (
  locale: SupportedLocale,
  category: KnowledgeCategory,
) => CATEGORY_LABELS[locale][category];

export const getKnowledgeFormatLabel = (
  locale: SupportedLocale,
  format: KnowledgeArticleFormat,
) => FORMAT_LABELS[locale][format];
