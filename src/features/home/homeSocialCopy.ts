import type { SupportedLocale } from '@/localization';

export type HomeSocialCopy = {
  addFood: string;
  calories: string;
  carbsShort: string;
  collapseMetrics: string;
  currentWeight: string;
  expandMetrics: string;
  fatShort: string;
  feedTitle: string;
  logWeight: string;
  macros: string;
  noWorkout: string;
  notConnected: string;
  proteinShort: string;
  recovery: string;
  restDay: string;
  steps: string;
  streak: string;
  today: string;
  todaysWorkout: string;
  nextWorkout: string;
};

const copy: Record<SupportedLocale, HomeSocialCopy> = {
  en: {
    addFood: 'Add food',
    calories: 'kcal',
    carbsShort: 'C',
    collapseMetrics: 'Collapse today details',
    currentWeight: 'Weight',
    expandMetrics: 'Expand today details',
    fatShort: 'F',
    feedTitle: 'Following',
    logWeight: 'Log weight',
    macros: 'Macros',
    noWorkout: 'No workout scheduled',
    notConnected: 'Not connected',
    proteinShort: 'P',
    recovery: 'Recovery',
    restDay: 'Rest day',
    steps: 'Steps',
    streak: 'Streak',
    today: 'Today',
    todaysWorkout: "Today's workout",
    nextWorkout: 'Next workout',
  },
  ru: {
    addFood: 'Добавить еду',
    calories: 'ккал',
    carbsShort: 'У',
    collapseMetrics: 'Свернуть показатели за сегодня',
    currentWeight: 'Вес',
    expandMetrics: 'Развернуть показатели за сегодня',
    fatShort: 'Ж',
    feedTitle: 'Подписки',
    logWeight: 'Записать вес',
    macros: 'БЖУ',
    noWorkout: 'Тренировка не запланирована',
    notConnected: 'Не подключено',
    proteinShort: 'Б',
    recovery: 'Восстановление',
    restDay: 'День отдыха',
    steps: 'Шаги',
    streak: 'Серия',
    today: 'Сегодня',
    todaysWorkout: 'Тренировка сегодня',
    nextWorkout: 'Следующая тренировка',
  },
};

export const getHomeSocialCopy = (locale: SupportedLocale) => copy[locale];
