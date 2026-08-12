import type { SupportedLocale } from '@/localization';

export type SocialStoryExpansionCopy = {
  locale: SupportedLocale;
  back: string;
  audience: string;
  following: string;
  closeFriends: string;
  manageStories: string;
  reply: string;
  replyPlaceholder: string;
  sendReply: string;
  replyFailed: string;
  viewers: string;
  replies: string;
  noViewers: string;
  noReplies: string;
  settingsTitle: string;
  closeFriendsTitle: string;
  closeFriendsBody: string;
  usernamePlaceholder: string;
  add: string;
  remove: string;
  loadFailed: string;
  archiveTitle: string;
  archiveEmpty: string;
  highlightsTitle: string;
  highlightPlaceholder: string;
  createHighlight: string;
  deleteHighlight: string;
  addToHighlight: string;
  pushTitle: string;
  pushUnavailable: string;
  pushRequested: string;
};

const copy: Record<SupportedLocale, SocialStoryExpansionCopy> = {
  en: {
    locale: 'en',
    back: 'Back',
    audience: 'Audience',
    following: 'Following',
    closeFriends: 'Close Friends',
    manageStories: 'Story settings',
    reply: 'Reply',
    replyPlaceholder: 'Reply to this story',
    sendReply: 'Send reply',
    replyFailed: 'The story reply could not be sent.',
    viewers: 'Viewers',
    replies: 'Replies',
    noViewers: 'No viewers yet.',
    noReplies: 'No replies yet.',
    settingsTitle: 'Story settings',
    closeFriendsTitle: 'Close Friends',
    closeFriendsBody: 'Only current followers can be added. Removing a follower also removes them from this list.',
    usernamePlaceholder: 'Follower username',
    add: 'Add',
    remove: 'Remove',
    loadFailed: 'Story settings could not be loaded.',
    archiveTitle: 'Archive',
    archiveEmpty: 'Expired stories will appear here.',
    highlightsTitle: 'Highlights',
    highlightPlaceholder: 'Highlight title',
    createHighlight: 'Create highlight',
    deleteHighlight: 'Delete highlight',
    addToHighlight: 'Add to highlight',
    pushTitle: 'Story push notifications',
    pushUnavailable: 'Delivery is not active yet. This setting only saves your preference until a push provider is connected.',
    pushRequested: 'Remember that I want Story push notifications',
  },
  ru: {
    locale: 'ru',
    back: 'Назад',
    audience: 'Аудитория',
    following: 'Подписчики',
    closeFriends: 'Близкие друзья',
    manageStories: 'Настройки историй',
    reply: 'Ответить',
    replyPlaceholder: 'Ответить на историю',
    sendReply: 'Отправить ответ',
    replyFailed: 'Не удалось отправить ответ на историю.',
    viewers: 'Просмотры',
    replies: 'Ответы',
    noViewers: 'Просмотров пока нет.',
    noReplies: 'Ответов пока нет.',
    settingsTitle: 'Настройки историй',
    closeFriendsTitle: 'Близкие друзья',
    closeFriendsBody: 'Добавить можно только текущих подписчиков. Если человек отпишется, он также исчезнет из этого списка.',
    usernamePlaceholder: 'Имя подписчика',
    add: 'Добавить',
    remove: 'Удалить',
    loadFailed: 'Не удалось загрузить настройки историй.',
    archiveTitle: 'Архив',
    archiveEmpty: 'Истёкшие истории будут появляться здесь.',
    highlightsTitle: 'Актуальное',
    highlightPlaceholder: 'Название актуального',
    createHighlight: 'Создать актуальное',
    deleteHighlight: 'Удалить актуальное',
    addToHighlight: 'Добавить в актуальное',
    pushTitle: 'Push-уведомления историй',
    pushUnavailable: 'Доставка push пока не активна. Сейчас настройка только запоминает ваше предпочтение до подключения push-провайдера.',
    pushRequested: 'Запомнить, что я хочу push-уведомления об историях',
  },
};

export const getSocialStoryExpansionCopy = (locale: SupportedLocale) => copy[locale];
