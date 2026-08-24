export const getTrainerCollaborationC3Copy = (locale: string) => {
  const ru = locale.toLowerCase().startsWith('ru');

  return {
    title: ru ? 'Работа с тренером' : 'Trainer collaboration',
    subtitle: ru
      ? 'Комментарии человека-тренера и только разрешённые клиентом данные.'
      : 'Human trainer comments and only the client-authorized evidence.',
    relationshipUnavailable: ru
      ? 'Связь не найдена или больше недоступна этому аккаунту.'
      : 'The relationship was not found or is no longer available to this account.',
    activeOnly: ru
      ? 'Комментарии и данные доступны только для активной связи.'
      : 'Comments and evidence are available only for an active relationship.',
    refresh: ru ? 'Обновить' : 'Refresh',
    commentsTitle: ru ? 'Комментарии тренера' : 'Trainer comments',
    commentsHint: ru
      ? 'Это сообщения человека-тренера, а не AI Coach. Они не меняют ваши фитнес-данные.'
      : 'These are human trainer messages, not AI Coach output. They do not change your fitness data.',
    commentsEmpty: ru ? 'Комментариев пока нет.' : 'No comments yet.',
    commentsUnavailable: ru
      ? 'Не удалось загрузить комментарии. Доступ мог быть отозван.'
      : 'Could not load comments. Access may have been revoked.',
    commentLabel: ru ? 'Новый комментарий' : 'New comment',
    commentPlaceholder: ru ? 'Напишите комментарий клиенту' : 'Write a comment for the client',
    sendComment: ru ? 'Отправить комментарий' : 'Send comment',
    commentTooLong: ru ? 'Максимум 2000 символов.' : 'Maximum 2000 characters.',
    commentFailed: ru
      ? 'Комментарий не отправлен. Проверьте подключение и актуальность связи.'
      : 'Comment was not sent. Check connectivity and relationship status.',
    trainerOnlyComment: ru
      ? 'Новые комментарии может писать только аккаунт тренера.'
      : 'Only the trainer account can author new comments.',
    humanTrainer: ru ? 'Тренер' : 'Trainer',
    evidenceTitle: ru ? 'Разрешённые данные клиента' : 'Authorized client evidence',
    evidenceHint: ru
      ? 'Каждая категория загружается отдельно и повторно проверяется сервером.'
      : 'Each category loads separately and is re-authorized by the server.',
    clientEvidenceHint: ru
      ? 'Вы видите выданные разрешения, но этот экран не дублирует ваши собственные фитнес-данные. Их читает только активный тренер в рамках выбранных категорий.'
      : 'You can see the granted permissions, but this screen does not duplicate your own fitness data. Only the active trainer reads the selected categories.',
    loadEvidence: ru ? 'Показать' : 'Show',
    reloadEvidence: ru ? 'Обновить данные' : 'Reload evidence',
    evidenceUnavailable: ru
      ? 'Данные недоступны. Разрешение могло быть отозвано или изменено.'
      : 'Evidence is unavailable. The permission may have been revoked or changed.',
    evidenceEmpty: ru ? 'Нет данных для этой категории.' : 'No data for this category.',
    privacy: ru
      ? 'C3 остаётся только для чтения: тренер не может напрямую менять тренировки, программы, прогресс или восстановление.'
      : 'C3 remains read-only: the trainer cannot directly change workouts, programs, progress, or recovery.',
    fields: ru
      ? {
          date: 'Дата',
          duration: 'Длительность',
          exercises: 'Упражнения',
          sets: 'Завершённые подходы',
          volume: 'Объём',
          goal: 'Цель',
          difficulty: 'Сложность',
          weeks: 'Недель',
          cadence: 'Тренировок в неделю',
          active: 'Активна',
          weight: 'Вес',
          measurement: 'Измерение',
          sleepDuration: 'Сон, ч',
          sleepQuality: 'Качество сна',
          fatigue: 'Усталость',
          soreness: 'Крепатура',
          stress: 'Стресс',
          painInterference: 'Влияние боли',
          readiness: 'Готовность',
          yes: 'Да',
          no: 'Нет',
        }
      : {
          date: 'Date',
          duration: 'Duration',
          exercises: 'Exercises',
          sets: 'Completed sets',
          volume: 'Volume',
          goal: 'Goal',
          difficulty: 'Difficulty',
          weeks: 'Weeks',
          cadence: 'Sessions per week',
          active: 'Active',
          weight: 'Weight',
          measurement: 'Measurement',
          sleepDuration: 'Sleep, h',
          sleepQuality: 'Sleep quality',
          fatigue: 'Fatigue',
          soreness: 'Soreness',
          stress: 'Stress',
          painInterference: 'Pain interference',
          readiness: 'Readiness',
          yes: 'Yes',
          no: 'No',
        },
  };
};
