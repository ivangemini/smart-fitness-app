import type { SupportedLocale } from './messages';

export const getNotificationSettingsCopy = (locale: SupportedLocale) => {
  const isRussian = locale === 'ru';

  return {
    title: isRussian ? 'Уведомления' : 'Notifications',
    subtitle: isRussian
      ? 'Управляйте системным разрешением и регистрацией push-уведомлений.'
      : 'Manage system permission and push-device registration.',
    permission: isRussian ? 'Разрешение' : 'Permission',
    delivery: isRussian ? 'Доставка' : 'Delivery',
    permissionAllowed: isRussian ? 'Разрешены' : 'Allowed',
    permissionDenied: isRussian ? 'Запрещены в системе' : 'Blocked in system settings',
    permissionNotEnabled: isRussian ? 'Не включены' : 'Not enabled',
    registrationRegistered: isRussian ? 'Устройство зарегистрировано' : 'Device registered',
    registrationError: isRussian
      ? 'Не удалось синхронизировать устройство'
      : 'Device sync failed',
    registrationWaiting: isRussian ? 'Ожидает синхронизации' : 'Waiting for sync',
    enableNotifications: isRussian ? 'Включить уведомления' : 'Enable notifications',
    openSystemSettings: isRussian ? 'Открыть настройки системы' : 'Open system settings',
    syncDevice: isRussian ? 'Синхронизировать устройство' : 'Sync device',
  } as const;
};
