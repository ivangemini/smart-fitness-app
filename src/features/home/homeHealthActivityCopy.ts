import type { SupportedLocale } from '@/localization';

export type HomeHealthActivityCopy = {
  activeEnergy: string;
  activity: string;
  connect: string;
  denied: string;
  distance: string;
  load: string;
  loading: string;
  noData: string;
  source: string;
  steps: string;
};

const copy: Record<SupportedLocale, HomeHealthActivityCopy> = {
  en: {
    activeEnergy: 'Active energy',
    activity: 'Activity',
    connect: 'Connect Apple Health',
    denied: 'Apple Health access is off. You can change access in iOS Settings.',
    distance: 'Distance',
    load: 'Load Apple Health activity',
    loading: 'Reading Apple Health…',
    noData: 'No Apple Health activity samples are available for today.',
    source: 'Apple Health',
    steps: 'Steps',
  },
  ru: {
    activeEnergy: 'Активная энергия',
    activity: 'Активность',
    connect: 'Подключить Apple Health',
    denied: 'Доступ к Apple Health отключён. Его можно изменить в настройках iOS.',
    distance: 'Дистанция',
    load: 'Загрузить активность Apple Health',
    loading: 'Читаем Apple Health…',
    noData: 'За сегодня в Apple Health нет доступных данных активности.',
    source: 'Apple Health',
    steps: 'Шаги',
  },
};

export const getHomeHealthActivityCopy = (locale: SupportedLocale) => copy[locale];
