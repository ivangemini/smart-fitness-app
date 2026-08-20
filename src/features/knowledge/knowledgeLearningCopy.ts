import type { KnowledgeLearningStateValue } from '@/api/knowledge/learningContracts';
import type { SupportedLocale } from '@/localization';

const EN = {
  learningTitle: 'Learning state',
  stateUnavailable: 'Not synced yet',
  markRead: 'Mark as read',
  markingRead: 'Saving read state…',
  pendingRead:
    'Read completion is queued and will sync when the connection returns.',
  syncIssue:
    'Learning state could not be fully synced. The article remains available to read.',
  retrySync: 'Retry sync',
  quizTitle: 'Knowledge check',
  quizBody:
    'Answers are evaluated on the server against this exact article version. No answer key is stored on this device.',
  quizReadRequired:
    'Mark this article as read and let that state sync before checking your answers.',
  answerAll: 'Answer every question before submitting.',
  submitQuiz: 'Check answers',
  submittingQuiz: 'Checking answers…',
  quizUnavailable:
    'Quiz evaluation needs a connection. No answer was scored locally.',
  quizPassed: 'Understanding confirmed for this article version.',
  quizNeedsReview: 'Review the explanations and try again when useful.',
  resultCount: (correct: number, total: number) =>
    `${correct} of ${total} answers correct`,
  correct: 'Correct',
  review: 'Review',
};

const RU: typeof EN = {
  learningTitle: 'Статус обучения',
  stateUnavailable: 'Пока не синхронизировано',
  markRead: 'Отметить прочитанным',
  markingRead: 'Сохраняем статус…',
  pendingRead:
    'Отметка о прочтении поставлена в очередь и синхронизируется после восстановления соединения.',
  syncIssue:
    'Статус обучения синхронизирован не полностью. Статья остаётся доступной для чтения.',
  retrySync: 'Повторить синхронизацию',
  quizTitle: 'Проверка знаний',
  quizBody:
    'Ответы проверяются на сервере для этой точной версии статьи. Ключ правильных ответов на устройстве не хранится.',
  quizReadRequired:
    'Сначала отметь статью прочитанной и дождись синхронизации статуса.',
  answerAll: 'Ответь на все вопросы перед проверкой.',
  submitQuiz: 'Проверить ответы',
  submittingQuiz: 'Проверяем ответы…',
  quizUnavailable:
    'Для проверки нужен интернет. На устройстве ответы не оценивались.',
  quizPassed: 'Понимание этой версии статьи подтверждено.',
  quizNeedsReview: 'Просмотри пояснения и при необходимости попробуй ещё раз.',
  resultCount: (correct: number, total: number) =>
    `Правильных ответов: ${correct} из ${total}`,
  correct: 'Верно',
  review: 'Разобрать',
};

const STATE_LABELS: Record<
  SupportedLocale,
  Record<KnowledgeLearningStateValue, string>
> = {
  en: {
    unseen: 'Unseen',
    read: 'Read',
    understood: 'Understood',
    refresh_useful: 'Refresh useful',
  },
  ru: {
    unseen: 'Не изучено',
    read: 'Прочитано',
    understood: 'Понято',
    refresh_useful: 'Полезно освежить',
  },
};

export const getKnowledgeLearningCopy = (locale: SupportedLocale) =>
  locale === 'ru' ? RU : EN;

export const getKnowledgeLearningStateLabel = (
  locale: SupportedLocale,
  state: KnowledgeLearningStateValue,
) => STATE_LABELS[locale][state];
