import type { SupportedLocale } from '@/localization';

export type SocialStoryCopy = {
  addStory: string;
  approved: string;
  authorBody: string;
  authorTitle: string;
  cancel: string;
  captionLabel: string;
  captionPlaceholder: string;
  chooseImage: string;
  close: string;
  completingImage: string;
  deleteFailed: string;
  deleteStory: string;
  deleteStoryBody: string;
  deleteStoryTitle: string;
  deletingStory: string;
  failed: string;
  imageAlreadyAttached: string;
  imageGenericError: string;
  imageOffline: string;
  imagePermissionDenied: string;
  imageProcessingFailed: string;
  imageRejected: string;
  imageSelectionFailed: string;
  imageSessionExpired: string;
  imageStale: string;
  imageTooLarge: string;
  imageUnsupported: string;
  imageUploadExpired: string;
  imageUploadUnavailable: string;
  imageValidationFailed: string;
  likeLoadFailed: string;
  likeStory: string;
  likeUpdateFailed: string;
  likesCount: (count: number) => string;
  loadError: string;
  loading: string;
  openStory: string;
  overlayBottom: string;
  overlayCenter: string;
  overlayLabel: string;
  overlayPlacementLabel: string;
  overlayPlaceholder: string;
  overlayTop: string;
  preparingImage: string;
  processing: string;
  publishStory: string;
  publishingStory: string;
  refreshStatus: string;
  removeImage: string;
  removingImage: string;
  replaceImage: string;
  retry: string;
  reviewRequired: string;
  selectingImage: string;
  stories: string;
  storyUnavailable: string;
  takePhoto: string;
  unlikeStory: string;
  uploadPending: string;
  uploadingImage: string;
  yourStory: string;
};

const copy: Record<SupportedLocale, SocialStoryCopy> = {
  en: {
    addStory: 'Add story',
    approved: 'Ready to publish.',
    authorBody:
      'Choose one photo from your library or take a new one. You can add optional text over the image and a separate caption. Content is checked before publishing.',
    authorTitle: 'New story',
    cancel: 'Cancel',
    captionLabel: 'Caption',
    captionPlaceholder: 'Add a caption',
    chooseImage: 'Choose from library',
    close: 'Close story',
    completingImage: 'Finalizing image',
    deleteFailed: 'The story could not be deleted.',
    deleteStory: 'Delete story',
    deleteStoryBody: 'This removes the story immediately.',
    deleteStoryTitle: 'Delete this story?',
    deletingStory: 'Deleting story',
    failed: 'Image processing failed. Choose another image or try again.',
    imageAlreadyAttached: 'This image is already attached to a story.',
    imageGenericError: 'The story image could not be prepared.',
    imageOffline: 'Connect to the internet and try again.',
    imagePermissionDenied: 'Camera or photo access is required to add a story image.',
    imageProcessingFailed: 'The image could not be processed.',
    imageRejected: 'This image cannot be published.',
    imageSelectionFailed: 'The image could not be selected.',
    imageSessionExpired: 'Sign in again to continue.',
    imageStale: 'The image changed on the server. Refresh its status and try again.',
    imageTooLarge: 'The image is too large to upload.',
    imageUnsupported: 'Choose a supported image.',
    imageUploadExpired: 'The upload expired. Choose the image again.',
    imageUploadUnavailable: 'Image uploads are temporarily unavailable.',
    imageValidationFailed: 'The uploaded image did not pass validation.',
    likeLoadFailed: 'Like status could not be loaded.',
    likeStory: 'Like story',
    likeUpdateFailed: 'The story Like could not be updated.',
    likesCount: (count) => `${count} ${count === 1 ? 'like' : 'likes'}`,
    loadError: 'Stories could not be loaded.',
    loading: 'Loading story',
    openStory: 'Open story',
    overlayBottom: 'Bottom',
    overlayCenter: 'Center',
    overlayLabel: 'Text overlay',
    overlayPlacementLabel: 'Position',
    overlayPlaceholder: 'Add text over the photo',
    overlayTop: 'Top',
    preparingImage: 'Preparing image',
    processing: 'Your image is being checked.',
    publishStory: 'Publish story',
    publishingStory: 'Publishing story',
    refreshStatus: 'Refresh status',
    removeImage: 'Remove image',
    removingImage: 'Removing image',
    replaceImage: 'Replace from library',
    retry: 'Retry',
    reviewRequired: 'This image needs review before it can be published.',
    selectingImage: 'Selecting image',
    stories: 'Stories',
    storyUnavailable: 'This story is no longer available.',
    takePhoto: 'Take photo',
    unlikeStory: 'Unlike story',
    uploadPending: 'Waiting for upload processing.',
    uploadingImage: 'Uploading image',
    yourStory: 'Your story',
  },
  ru: {
    addStory: 'Добавить историю',
    approved: 'Готово к публикации.',
    authorBody:
      'Выберите одно фото из медиатеки или снимите новое. Можно добавить текст поверх фото и отдельную подпись. Контент пройдет проверку перед публикацией.',
    authorTitle: 'Новая история',
    cancel: 'Отмена',
    captionLabel: 'Подпись',
    captionPlaceholder: 'Добавьте подпись',
    chooseImage: 'Выбрать из медиатеки',
    close: 'Закрыть историю',
    completingImage: 'Завершение загрузки',
    deleteFailed: 'Не удалось удалить историю.',
    deleteStory: 'Удалить историю',
    deleteStoryBody: 'История будет удалена сразу.',
    deleteStoryTitle: 'Удалить эту историю?',
    deletingStory: 'Удаление истории',
    failed: 'Обработка изображения не удалась. Выберите другое или повторите попытку.',
    imageAlreadyAttached: 'Это изображение уже прикреплено к истории.',
    imageGenericError: 'Не удалось подготовить изображение для истории.',
    imageOffline: 'Подключитесь к интернету и повторите попытку.',
    imagePermissionDenied: 'Для добавления изображения в историю нужен доступ к камере или фото.',
    imageProcessingFailed: 'Не удалось обработать изображение.',
    imageRejected: 'Это изображение нельзя опубликовать.',
    imageSelectionFailed: 'Не удалось выбрать изображение.',
    imageSessionExpired: 'Войдите снова, чтобы продолжить.',
    imageStale: 'Состояние изображения изменилось на сервере. Обновите статус и повторите.',
    imageTooLarge: 'Изображение слишком большое для загрузки.',
    imageUnsupported: 'Выберите поддерживаемое изображение.',
    imageUploadExpired: 'Время загрузки истекло. Выберите изображение снова.',
    imageUploadUnavailable: 'Загрузка изображений временно недоступна.',
    imageValidationFailed: 'Загруженное изображение не прошло проверку.',
    likeLoadFailed: 'Не удалось загрузить состояние отметки «Нравится».',
    likeStory: 'Отметить историю как понравившуюся',
    likeUpdateFailed: 'Не удалось обновить отметку «Нравится».',
    likesCount: (count) => `Отметок «Нравится»: ${count}`,
    loadError: 'Не удалось загрузить истории.',
    loading: 'Загрузка истории',
    openStory: 'Открыть историю',
    overlayBottom: 'Снизу',
    overlayCenter: 'По центру',
    overlayLabel: 'Текст на фото',
    overlayPlacementLabel: 'Положение',
    overlayPlaceholder: 'Добавьте текст поверх фото',
    overlayTop: 'Сверху',
    preparingImage: 'Подготовка изображения',
    processing: 'Изображение проходит проверку.',
    publishStory: 'Опубликовать историю',
    publishingStory: 'Публикация истории',
    refreshStatus: 'Обновить статус',
    removeImage: 'Удалить изображение',
    removingImage: 'Удаление изображения',
    replaceImage: 'Заменить из медиатеки',
    retry: 'Повторить',
    reviewRequired: 'Изображение требует проверки перед публикацией.',
    selectingImage: 'Выбор изображения',
    stories: 'Истории',
    storyUnavailable: 'Эта история больше недоступна.',
    takePhoto: 'Снять фото',
    unlikeStory: 'Убрать отметку «Нравится»',
    uploadPending: 'Ожидание обработки загрузки.',
    uploadingImage: 'Загрузка изображения',
    yourStory: 'Ваша история',
  },
};

export const getSocialStoryCopy = (locale: SupportedLocale) => copy[locale];
