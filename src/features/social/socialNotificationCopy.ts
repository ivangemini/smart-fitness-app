import type { SocialNotificationType } from '@/api/social';
import type { SupportedLocale } from '@/localization';

const en = {
  action: 'Notifications',
  eyebrow: 'SOCIAL',
  title: 'Notifications',
  subtitle: 'Follow requests and activity on your workouts and Stories.',
  loading: 'Loading notifications…',
  emptyTitle: 'No notifications yet',
  emptyBody: 'Follow requests, accepted follows, reactions, comments, and Story activity will appear here.',
  signInTitle: 'Sign in required',
  signInBody: 'Sign in to view your Social notifications.',
  signInAction: 'Sign in',
  profileRequiredTitle: 'Create your Social profile',
  profileRequiredBody: 'A Social profile is required before notifications can be viewed.',
  profileRequiredAction: 'Set up Social profile',
  loadMore: 'Load more',
  reload: 'Reload notifications',
  retry: 'Retry',
  refresh: 'Refresh notifications',
  unread: 'Unread',
  read: 'Read',
  open: 'Open notification',
  followRequest: 'sent you a follow request.',
  followAccepted: 'accepted your follow request.',
  workoutReaction: 'liked your published workout.',
  workoutComment: 'commented on your published workout.',
  storyLike: 'liked your Story.',
  storyReaction: 'reacted to your Story.',
  loadCursor: 'This notification page expired. Reload notifications from the beginning.',
  loadOffline: 'Connect to the internet to load notifications.',
  loadSession: 'Your session expired. Sign in again.',
  loadGeneric: 'Notifications could not be loaded right now.',
  readError: 'The notification could not be marked as read.',
} as const;

export type SocialNotificationCopy = Record<keyof typeof en, string>;

const ru: SocialNotificationCopy = {
  action: 'Уведомления',
  eyebrow: 'SOCIAL',
  title: 'Уведомления',
  subtitle: 'Заявки на подписку и активность в тренировках и Stories.',
  loading: 'Загрузка уведомлений…',
  emptyTitle: 'Уведомлений пока нет',
  emptyBody: 'Заявки, принятые подписки, реакции, комментарии и активность в Stories появятся здесь.',
  signInTitle: 'Требуется вход',
  signInBody: 'Войдите, чтобы просматривать Social-уведомления.',
  signInAction: 'Войти',
  profileRequiredTitle: 'Создайте Social-профиль',
  profileRequiredBody: 'Для просмотра уведомлений сначала нужен Social-профиль.',
  profileRequiredAction: 'Настроить Social-профиль',
  loadMore: 'Загрузить ещё',
  reload: 'Перезагрузить уведомления',
  retry: 'Повторить',
  refresh: 'Обновить уведомления',
  unread: 'Не прочитано',
  read: 'Прочитано',
  open: 'Открыть уведомление',
  followRequest: 'отправил(а) вам заявку на подписку.',
  followAccepted: 'принял(а) вашу заявку на подписку.',
  workoutReaction: 'оценил(а) вашу опубликованную тренировку.',
  workoutComment: 'оставил(а) комментарий к вашей тренировке.',
  storyLike: 'поставил(а) отметку «Нравится» вашей Story.',
  storyReaction: 'отреагировал(а) на вашу Story.',
  loadCursor: 'Страница уведомлений устарела. Загрузите список сначала.',
  loadOffline: 'Подключитесь к интернету, чтобы загрузить уведомления.',
  loadSession: 'Сессия истекла. Войдите снова.',
  loadGeneric: 'Сейчас не удалось загрузить уведомления.',
  readError: 'Не удалось отметить уведомление как прочитанное.',
};

export const getSocialNotificationCopy = (
  locale: SupportedLocale,
): SocialNotificationCopy => (locale === 'ru' ? ru : en);

export const getSocialNotificationMessage = (
  copy: SocialNotificationCopy,
  type: SocialNotificationType,
): string => {
  if (type === 'follow_request') return copy.followRequest;
  if (type === 'follow_accepted') return copy.followAccepted;
  if (type === 'workout_reaction') return copy.workoutReaction;
  if (type === 'workout_comment') return copy.workoutComment;
  if (type === 'story_like') return copy.storyLike;
  return copy.storyReaction;
};
