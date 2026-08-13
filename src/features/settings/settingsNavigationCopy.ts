export function getSettingsNavigationCopy(locale: string) {
  const russian = locale.toLowerCase().startsWith('ru');

  return russian
    ? {
        account: 'Аккаунт',
        profile: 'Профиль и личные данные',
        profileSubtitle: 'Аккаунт, личные данные и публичный профиль.',
        socialProfile: 'Публичный профиль',
        preferences: 'Предпочтения',
        appearance: 'Оформление',
        language: 'Язык',
        units: 'Единицы измерения',
        dataPrivacy: 'Данные и конфиденциальность',
        dataSync: 'Данные и синхронизация',
        privacy: 'Конфиденциальность',
        support: 'Приложение',
        about: 'О приложении',
        developer: 'Разработчик',
        developerTools: 'Диагностика и обновления',
        rootSubtitle: 'Компактные настройки аккаунта, приложения и данных.',
      }
    : {
        account: 'Account',
        profile: 'Profile & personal details',
        profileSubtitle: 'Account, personal details, and your public profile.',
        socialProfile: 'Public profile',
        preferences: 'Preferences',
        appearance: 'Appearance',
        language: 'Language',
        units: 'Units',
        dataPrivacy: 'Data & privacy',
        dataSync: 'Data & Sync',
        privacy: 'Privacy',
        support: 'App',
        about: 'About',
        developer: 'Developer',
        developerTools: 'Diagnostics & updates',
        rootSubtitle: 'Compact controls for your account, app, and data.',
      };
}
