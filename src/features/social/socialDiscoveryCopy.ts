export function getSocialDiscoveryCopy(locale: string) {
  const russian = locale.toLowerCase().startsWith('ru');

  return russian
    ? {
        eyebrow: 'СОЦИАЛЬНЫЙ ПОИСК',
        title: 'Поиск',
        subtitle: 'Профили, сообщества и ваши подписки.',
        profilesTab: 'Профили',
        communitiesTab: 'Сообщества',
        subscriptionsTab: 'Подписки',
        profileSectionTitle: 'Найти профиль',
        manageProfile: 'Управлять моим профилем',
        communitiesTitle: 'Сообщества',
        communitiesBody:
          'Каталог сообществ пока не подключён к серверу. Здесь появится поиск, когда серверный раздел сообществ станет доступен.',
        communityGuidelines: 'Правила сообщества',
        subscriptionsTitle: 'Подписки',
        subscriptionsBody: 'Откройте список подписок или публикации профилей, на которые вы подписаны.',
        relationships: 'Мои подписки',
        followingFeed: 'Лента подписок',
      }
    : {
        eyebrow: 'SOCIAL DISCOVERY',
        title: 'Search',
        subtitle: 'Profiles, communities, and your subscriptions.',
        profilesTab: 'Profiles',
        communitiesTab: 'Communities',
        subscriptionsTab: 'Subscriptions',
        profileSectionTitle: 'Find a profile',
        manageProfile: 'Manage my profile',
        communitiesTitle: 'Communities',
        communitiesBody:
          'The community directory is not connected to the server yet. Search will appear here when the server-side community catalog is available.',
        communityGuidelines: 'Community guidelines',
        subscriptionsTitle: 'Subscriptions',
        subscriptionsBody: 'Open your subscriptions or the feed from profiles you follow.',
        relationships: 'My subscriptions',
        followingFeed: 'Following feed',
      };
}
