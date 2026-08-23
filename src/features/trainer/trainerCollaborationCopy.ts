import type { TrainerReadScope, TrainerRelationshipRole, TrainerRelationshipStatus } from './trainerCollaborationModel';

export const getTrainerCollaborationCopy = (locale: string) => {
  const ru = locale.toLowerCase().startsWith('ru');

  const scopeLabels: Record<TrainerReadScope, string> = ru
    ? {
        workout_history_summary: 'Сводка истории тренировок',
        workout_templates: 'Шаблоны тренировок',
        training_programs: 'Тренировочные программы',
        progress_summary: 'Сводка прогресса',
        recovery_summary: 'Сводка восстановления',
      }
    : {
        workout_history_summary: 'Workout history summary',
        workout_templates: 'Workout templates',
        training_programs: 'Training programs',
        progress_summary: 'Progress summary',
        recovery_summary: 'Recovery summary',
      };

  const statusLabels: Record<TrainerRelationshipStatus, string> = ru
    ? { invited: 'Ожидает подтверждения', active: 'Активно', revoked: 'Отозвано' }
    : { invited: 'Pending acceptance', active: 'Active', revoked: 'Revoked' };

  const roleLabels: Record<TrainerRelationshipRole, string> = ru
    ? { client: 'Ваш тренер', trainer: 'Ваш клиент' }
    : { client: 'Your trainer', trainer: 'Your client' };

  return {
    title: ru ? 'Тренер и клиент' : 'Trainer collaboration',
    subtitle: ru
      ? 'Отдельные от Social и AI Coach разрешения для работы с человеком-тренером.'
      : 'Human trainer permissions kept separate from Social and AI Coach.',
    inviteTitle: ru ? 'Пригласить тренера' : 'Invite a trainer',
    inviteBody: ru
      ? 'Укажите ID аккаунта тренера и выберите, какие категории он сможет видеть после принятия приглашения.'
      : 'Enter the trainer account ID and choose what they may view after accepting the invitation.',
    trainerId: ru ? 'ID аккаунта тренера' : 'Trainer account ID',
    trainerIdHelper: ru
      ? 'Нужен UUID аккаунта. Social-подписка не даёт этих прав.'
      : 'Use the account UUID. A Social follow does not grant these permissions.',
    trainerIdInvalid: ru ? 'Введите корректный UUID аккаунта.' : 'Enter a valid account UUID.',
    scopes: ru ? 'Разрешения' : 'Permissions',
    scopesHint: ru
      ? 'Нужно выбрать минимум одно. Разрешения начнут действовать только после принятия тренером.'
      : 'Select at least one. Permissions activate only after the trainer accepts.',
    createInvitation: ru ? 'Отправить приглашение' : 'Send invitation',
    relationships: ru ? 'Связи' : 'Relationships',
    empty: ru ? 'Связей с тренером пока нет.' : 'No trainer relationships yet.',
    refresh: ru ? 'Обновить' : 'Refresh',
    accept: ru ? 'Принять' : 'Accept',
    revoke: ru ? 'Отозвать доступ' : 'Revoke access',
    cancelInvitation: ru ? 'Отменить приглашение' : 'Cancel invitation',
    awaitingAcceptance: ru ? 'Ждём принятия тренером.' : 'Waiting for the trainer to accept.',
    privacy: ru
      ? 'C2 не даёт тренеру права менять тренировки, программы или прогресс. Прямые записи в фитнес-данные отключены.'
      : 'C2 does not let a trainer change workouts, programs, or progress. Direct fitness mutations remain disabled.',
    accountRequired: ru ? 'Войдите в аккаунт, чтобы управлять связями.' : 'Sign in to manage trainer relationships.',
    unavailable: ru
      ? 'Не удалось загрузить связи. Проверьте подключение и доступность сервера.'
      : 'Could not load relationships. Check connectivity and server availability.',
    mutationFailed: ru ? 'Действие не выполнено. Попробуйте ещё раз.' : 'The action failed. Try again.',
    counterpartFallback: ru ? 'Аккаунт' : 'Account',
    status: ru ? 'Статус' : 'Status',
    role: ru ? 'Роль' : 'Role',
    grantedScopes: ru ? 'Выданные разрешения' : 'Granted permissions',
    scopeLabels,
    statusLabels,
    roleLabels,
  };
};
