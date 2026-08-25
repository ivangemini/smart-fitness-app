export function getSocialDiscoveryCopy(locale: string) {
  const russian = locale.toLowerCase().startsWith('ru');

  return russian
    ? {
        eyebrow: 'СОЦИАЛЬНЫЙ ПОИСК',
        title: 'Поиск',
        subtitle: 'Профили и ваши подписки.',
        profilesTab: 'Профили',
        subscriptionsTab: 'Подписки',
        profileSectionTitle: 'Найти профиль',
        manageProfile: 'Управлять моим профилем',
        subscriptionsTitle: 'Подписки',
        subscriptionsBody: 'Откройте список подписок или публикации профилей, на которые вы подписаны.',
        relationships: 'Мои подписки',
        followingFeed: 'Лента подписок',
      }
    : {
        eyebrow: 'SOCIAL DISCOVERY',
        title: 'Search',
        subtitle: 'Profiles and your subscriptions.',
        profilesTab: 'Profiles',
        subscriptionsTab: 'Subscriptions',
        profileSectionTitle: 'Find a profile',
        manageProfile: 'Manage my profile',
        subscriptionsTitle: 'Subscriptions',
        subscriptionsBody: 'Open your subscriptions or the feed from profiles you follow.',
        relationships: 'My subscriptions',
        followingFeed: 'Following feed',
      };
}
