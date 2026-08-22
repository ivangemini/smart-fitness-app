import type { SupportedLocale } from '@/localization/messages';

export const getBodyCompositionProgressCopy = (locale: SupportedLocale) => {
  const ru = locale === 'ru';
  return {
    title: ru ? 'Состав тела' : 'Body composition',
    subtitle: ru
      ? 'Вес, замеры и приватные фото прогресса в одном хронологическом представлении.'
      : 'Review stored weight, measurements and private progress photos in one longitudinal view.',
    period: ru ? 'Период' : 'Period',
    weightTrend: ru ? 'Динамика веса' : 'Weight trend',
    weightTrendNeedsData: ru
      ? 'Для графика нужны минимум две записи веса в выбранном периоде.'
      : 'At least two weight entries in the selected period are needed for the chart.',
    currentWeight: ru ? 'Текущий вес' : 'Current weight',
    change7d: ru ? 'Изменение за 7 дней' : '7-day change',
    change30d: ru ? 'Изменение за 30 дней' : '30-day change',
    waist: ru ? 'Талия' : 'Waist',
    periodChange: ru ? 'Изменение за период' : 'Period change',
    entries: ru ? 'записей' : 'entries',
    percentPointsUnit: ru ? 'п.п.' : 'pp',
    measurements: ru ? 'Сохранённые замеры' : 'Stored measurements',
    measurementNotice: ru
      ? 'Это введённые вами значения. Они не определяются по фотографиям.'
      : 'These are values you recorded. They are not inferred from photos.',
    storedMeasurement: ru ? 'Сохранённый замер' : 'Stored measurement',
    measurementDetails: ru ? 'Все замеры' : 'All measurements',
    photos: ru ? 'Приватная лента фото' : 'Private photo timeline',
    photosNotice: ru
      ? 'Фото — только визуальные данные. Приложение не оценивает процент жира по изображениям.'
      : 'Photos are visual evidence only. The app does not estimate body-fat percentage from images.',
    photoCount: ru ? 'Фото' : 'Photos',
    firstPhoto: ru ? 'Первое за период' : 'First in period',
    latestPhoto: ru ? 'Последнее за период' : 'Latest in period',
    poseLabel: (pose: 'front' | 'side' | 'back') => {
      if (pose === 'front') return ru ? 'Спереди' : 'Front';
      if (pose === 'side') return ru ? 'Сбоку' : 'Side';
      return ru ? 'Сзади' : 'Back';
    },
    sourceCamera: ru ? 'Камера' : 'Camera',
    sourceLibrary: ru ? 'Медиатека' : 'Photo library',
    openPhotos: ru ? 'Открыть фото прогресса' : 'Open progress photos',
    comparePhotos: ru ? 'Сравнить фото' : 'Compare photos',
    compareUnavailable: ru
      ? 'Добавьте минимум два фото одного ракурса для сравнения.'
      : 'Add at least two photos from the same pose to compare.',
    noWeight: ru ? 'За этот период нет записей веса.' : 'No weight in this period.',
    noWaist: ru ? 'За этот период нет замеров талии.' : 'No waist measurement in this period.',
    noMeasurements: ru
      ? 'За этот период нет сохранённых замеров.'
      : 'No stored measurements in this period.',
    noPhotos: ru
      ? 'За этот период нет приватных фото прогресса.'
      : 'No private progress photos in this period.',
    timelineTruncated: ru
      ? 'Показаны последние 24 фото за этот период.'
      : 'Showing the most recent 24 photos in this period.',
    loading: ru ? 'Загрузка приватной истории фото…' : 'Loading private photo history…',
    loadError: ru
      ? 'Не удалось загрузить приватную историю фото.'
      : 'Private photo history could not be loaded.',
    signedOut: ru
      ? 'Войдите в аккаунт, чтобы видеть принадлежащие ему фото прогресса.'
      : 'Sign in to view account-owned progress photos.',
    unavailable: '—',
    back: ru ? 'Назад' : 'Back',
  };
};
