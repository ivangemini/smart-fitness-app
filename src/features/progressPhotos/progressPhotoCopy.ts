import type { SupportedLocale } from '@/localization/messages';

import type { ProgressPhotoPose } from './progressPhotoStore';

export const getProgressPhotoCopy = (locale: SupportedLocale) => {
  const ru = locale === 'ru';
  return {
    title: ru ? 'Фото прогресса' : 'Progress photos',
    subtitle: ru
      ? 'Стандартизируйте ракурс, дистанцию и освещение, чтобы сравнение было честнее.'
      : 'Keep pose, distance and lighting consistent so future comparisons are more meaningful.',
    privateTitle: ru ? 'Приватно по умолчанию' : 'Private by default',
    privateDescription: ru
      ? 'Этот экран хранит копии фото локально в данных приложения и не загружает их в облако или соцсеть. Удаление аккаунта включает локальную очистку этих фото.'
      : 'This flow stores app-owned local copies and does not upload them to cloud or social surfaces. Account deletion includes local cleanup of these photos.',
    exportNotice: ru
      ? 'Экспорт данных в приложении пока остаётся заблокированным общим privacy-контрактом.'
      : 'App data export remains blocked by the existing privacy contract for now.',
    guideTitle: ru ? 'Как снимать одинаково' : 'Standardized capture guide',
    guideBody: ru
      ? 'Поставьте камеру примерно на уровне середины корпуса, используйте одинаковую дистанцию и фон, нейтральную позу и похожее освещение. Не втягивайте живот и не меняйте позирование между датами.'
      : 'Keep the camera around mid-torso height, use a similar distance and background, neutral posture, and similar lighting. Avoid changing posing between dates.',
    poseLabel: (pose: ProgressPhotoPose) => {
      if (pose === 'front') return ru ? 'Спереди' : 'Front';
      if (pose === 'side') return ru ? 'Сбоку' : 'Side';
      return ru ? 'Сзади' : 'Back';
    },
    selectedPose: ru ? 'Выбранный ракурс' : 'Selected pose',
    takePhoto: ru ? 'Снять фото' : 'Take photo',
    importPhoto: ru ? 'Выбрать из медиатеки' : 'Choose from library',
    latestByPose: ru ? 'Последние ракурсы' : 'Latest by pose',
    noPhoto: ru ? 'Нет фото' : 'No photo',
    timeline: ru ? 'История фото' : 'Photo history',
    timelineEmpty: ru
      ? 'Добавьте первое фото спереди, сбоку или сзади.'
      : 'Add your first front, side, or back progress photo.',
    addedAt: ru ? 'Добавлено' : 'Added',
    sourceCamera: ru ? 'Камера' : 'Camera',
    sourceLibrary: ru ? 'Медиатека' : 'Library',
    importedTimeNote: ru
      ? 'Для импортированных фото используется время добавления. EXIF и геолокация не сохраняются как метаданные прогресса.'
      : 'Imported photos use the time they were added. EXIF and location are not retained as progress metadata.',
    deletePhoto: ru ? 'Удалить' : 'Delete',
    deleteTitle: ru ? 'Удалить фото прогресса?' : 'Delete progress photo?',
    deleteBody: ru
      ? 'Локальная копия и её метаданные будут удалены из приложения.'
      : 'The app-owned local copy and its metadata will be removed.',
    cancel: ru ? 'Отмена' : 'Cancel',
    delete: ru ? 'Удалить' : 'Delete',
    loading: ru ? 'Загрузка фото…' : 'Loading photos…',
    saving: ru ? 'Сохранение…' : 'Saving…',
    cameraPermission: ru
      ? 'Нужен доступ к камере, чтобы снять фото прогресса.'
      : 'Camera access is required to take a progress photo.',
    libraryPermission: ru
      ? 'Нужен доступ к медиатеке, чтобы выбрать фото прогресса.'
      : 'Photo library access is required to choose a progress photo.',
    loadError: ru
      ? 'Не удалось загрузить локальные фото прогресса.'
      : 'Could not load local progress photos.',
    saveError: ru
      ? 'Не удалось сохранить фото в локальное хранилище приложения.'
      : 'Could not save the photo into app-owned local storage.',
    deleteError: ru
      ? 'Не удалось полностью удалить фото. Очистка будет повторена при следующей загрузке.'
      : 'The photo could not be fully removed. Cleanup will retry on the next load.',
    signedOut: ru
      ? 'Для приватного хранения фото нужен активный аккаунт.'
      : 'An active account is required for private progress-photo storage.',
    back: ru ? 'Назад' : 'Back',
  };
};
