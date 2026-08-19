import type {
  KnowledgeArticleFormat,
  KnowledgeCategory,
  KnowledgeEvidenceStrength,
  KnowledgeQuizQuestionType,
  KnowledgeRiskTier,
  KnowledgeSourceType,
} from '@/api/knowledge';

const CATEGORY_LABELS = {
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
} satisfies Record<'en' | 'ru', Record<KnowledgeCategory, string>>;

const FORMAT_LABELS = {
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
} satisfies Record<'en' | 'ru', Record<KnowledgeArticleFormat, string>>;

const SOURCE_TYPE_LABELS = {
  en: {
    systematic_review: 'Systematic review',
    meta_analysis: 'Meta-analysis',
    position_statement: 'Position statement',
    guideline: 'Guideline',
    randomized_trial: 'Randomized trial',
    observational_study: 'Observational study',
    narrative_review: 'Narrative review',
    other: 'Source',
  },
  ru: {
    systematic_review: 'Систематический обзор',
    meta_analysis: 'Метаанализ',
    position_statement: 'Позиционный документ',
    guideline: 'Руководство',
    randomized_trial: 'Рандомизированное исследование',
    observational_study: 'Наблюдательное исследование',
    narrative_review: 'Нарративный обзор',
    other: 'Источник',
  },
} satisfies Record<'en' | 'ru', Record<KnowledgeSourceType, string>>;

const EVIDENCE_LABELS = {
  en: { limited: 'Limited evidence', moderate: 'Moderate evidence', strong: 'Strong evidence' },
  ru: { limited: 'Ограниченные данные', moderate: 'Умеренные данные', strong: 'Сильные данные' },
} satisfies Record<'en' | 'ru', Record<KnowledgeEvidenceStrength, string>>;

const QUESTION_TYPE_LABELS = {
  en: {
    recall: 'Recall',
    understanding: 'Understanding',
    application: 'Application',
    misconception: 'Common misconception',
  },
  ru: {
    recall: 'Воспроизведение',
    understanding: 'Понимание',
    application: 'Применение',
    misconception: 'Типичное заблуждение',
  },
} satisfies Record<'en' | 'ru', Record<KnowledgeQuizQuestionType, string>>;

const RISK_LABELS = {
  en: { tier_1: 'General education', tier_2: 'Reviewed health context', tier_3: 'Human-reviewed medical-adjacent education' },
  ru: { tier_1: 'Образовательный материал', tier_2: 'Проверенный контекст здоровья', tier_3: 'Медицински смежный материал с ручной проверкой' },
} satisfies Record<'en' | 'ru', Record<KnowledgeRiskTier, string>>;

export const getKnowledgeCopy = (locale: 'en' | 'ru') => {
  const common = {
    en: {
      libraryTitle: 'Knowledge',
      librarySubtitle: 'Reviewed lessons about training, nutrition, physiology and recovery.',
      searchLabel: 'Search library',
      searchPlaceholder: 'Search title, summary, or topic',
      all: 'All',
      empty: 'No published lessons match this view yet.',
      errorTitle: 'Knowledge is unavailable',
      errorBody: 'The reviewed library could not be loaded right now.',
      retry: 'Try again',
      signInTitle: 'Sign in to open Knowledge',
      signInBody: 'The current reader API is authenticated even though canonical articles are shared content.',
      openArticle: 'Read article',
      version: (value: number) => `Version ${value}`,
      sources: 'Reviewed sources',
      evidence: 'Evidence behind this article',
      quizPreview: 'Knowledge check',
      quizReady: (count: number) => `${count} reviewed question${count === 1 ? '' : 's'} prepared for this article.`,
      quizLater: 'Answer submission will be enabled with the reviewed quiz-evaluation contract.',
      published: 'Published',
      noSources: 'No source metadata is available.',
      articleUnavailable: 'This published article is not available in the selected language.',
      back: 'Back',
      library: 'Open Knowledge library',
      coachLibraryTitle: 'Learn the why',
      coachLibraryBody: 'Open the reviewed Knowledge library for training, nutrition, physiology, recovery and Labs concepts.',
    },
    ru: {
      libraryTitle: 'Знания',
      librarySubtitle: 'Проверенные материалы о тренировках, питании, физиологии и восстановлении.',
      searchLabel: 'Поиск по библиотеке',
      searchPlaceholder: 'Название, описание или тема',
      all: 'Все',
      empty: 'В этом разделе пока нет подходящих опубликованных материалов.',
      errorTitle: 'Библиотека недоступна',
      errorBody: 'Сейчас не удалось загрузить проверенные материалы.',
      retry: 'Повторить',
      signInTitle: 'Войди, чтобы открыть Знания',
      signInBody: 'Текущий reader API требует авторизацию, хотя канонические статьи являются общей библиотекой.',
      openArticle: 'Читать',
      version: (value: number) => `Версия ${value}`,
      sources: 'Проверенные источники',
      evidence: 'На чём основана статья',
      quizPreview: 'Проверка понимания',
      quizReady: (count: number) => `Для этой статьи подготовлено вопросов: ${count}.`,
      quizLater: 'Ответы будут включены после отдельного проверенного контракта оценки тестов.',
      published: 'Опубликовано',
      noSources: 'Метаданные источников недоступны.',
      articleUnavailable: 'Эта опубликованная статья недоступна на выбранном языке.',
      back: 'Назад',
      library: 'Открыть библиотеку знаний',
      coachLibraryTitle: 'Разобраться почему',
      coachLibraryBody: 'Открой проверенную библиотеку о тренировках, питании, физиологии, восстановлении и анализах.',
    },
  } as const;

  return {
    ...common[locale],
    category: (value: KnowledgeCategory) => CATEGORY_LABELS[locale][value],
    format: (value: KnowledgeArticleFormat) => FORMAT_LABELS[locale][value],
    sourceType: (value: KnowledgeSourceType) => SOURCE_TYPE_LABELS[locale][value],
    evidenceStrength: (value: KnowledgeEvidenceStrength) => EVIDENCE_LABELS[locale][value],
    questionType: (value: KnowledgeQuizQuestionType) => QUESTION_TYPE_LABELS[locale][value],
    riskTier: (value: KnowledgeRiskTier) => RISK_LABELS[locale][value],
  };
};
