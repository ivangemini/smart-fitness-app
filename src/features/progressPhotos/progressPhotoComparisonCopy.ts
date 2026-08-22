import type { SupportedLocale } from '@/localization/messages';

import type { ProgressPhotoComparisonReason } from './progressPhotoComparison';
import type { ProgressPhotoPose } from './progressPhotoStore';

export const getProgressPhotoComparisonCopy = (locale: SupportedLocale) => {
  const ru = locale === 'ru';
  return {
    title: ru ? 'Сравнение фото' : 'Photo comparison',
    subtitle: ru
      ? 'Сравнивайте два приватных фото одного ракурса. Вес и талия показываются только как отдельные сохранённые факты.'
      : 'Compare two private photos from the same pose. Weight and waist are shown only as separate stored facts.',
    back: ru ? 'Назад' : 'Back',
    pose: ru ? 'Ракурс' : 'Pose',
    poseLabel: (pose: ProgressPhotoPose) => {
      if (pose === 'front') return ru ? 'Спереди' : 'Front';
      if (pose === 'side') return ru ? 'Сбоку' : 'Side';
      return ru ? 'Сзади' : 'Back';
    },
    selecting: ru ? 'Куда выбрать фото' : 'Selecting for',
    before: ru ? 'До' : 'Before',
    after: ru ? 'После' : 'After',
    timeline: ru ? 'Выберите даты' : 'Choose dates',
    timelineHint: ru
      ? 'Сначала выберите «До» или «После», затем нажмите на фото этого же ракурса.'
      : 'Choose Before or After, then tap a photo from the same pose.',
    noComparablePose: ru
      ? 'Для сравнения нужны минимум два сохранённых фото одного ракурса.'
      : 'Comparison requires at least two saved photos from the same pose.',
    noTwoForPose: ru
      ? 'Для этого ракурса пока меньше двух фото.'
      : 'This pose does not have two photos yet.',
    sideBySide: ru ? 'Рядом' : 'Side by side',
    overlay: ru ? 'Наложение' : 'Overlay',
    overlayUnavailable: ru
      ? 'Наложение доступно только для пары со стандартизированным соотношением 3:4.'
      : 'Overlay is available only for a pair with the standardized 3:4 aspect ratio.',
    overlayNotice: ru
      ? 'Наложение — визуальная подсказка, а не выравнивание тела и не измерение. Поза, дистанция и положение человека всё ещё могут отличаться.'
      : 'Overlay is a visual aid, not body registration or a measurement. Pose, distance, and subject position can still differ.',
    evidenceTitle: ru ? 'Сохранённые данные рядом с датой' : 'Stored data near each date',
    evidenceNotice: ru
      ? 'Вес ищется в пределах ±7 дней, талия — ±14 дней. Эти значения не вычисляются по фото.'
      : 'Weight is matched within ±7 days and waist within ±14 days. These values are not derived from the photo.',
    weight: ru ? 'Вес' : 'Weight',
    waist: ru ? 'Талия' : 'Waist',
    noNearbyWeight: ru ? 'Нет веса рядом с датой' : 'No nearby weight',
    noNearbyWaist: ru ? 'Нет замера талии рядом с датой' : 'No nearby waist measurement',
    loading: ru ? 'Загрузка фото…' : 'Loading photos…',
    loadError: ru ? 'Не удалось загрузить фото для сравнения.' : 'Could not load photos for comparison.',
    signedOut: ru
      ? 'Для сравнения приватных фото нужен активный аккаунт.'
      : 'An active account is required to compare private progress photos.',
    invalidReason: (reason: ProgressPhotoComparisonReason) => {
      if (reason === 'same_photo') return ru ? 'Выберите два разных фото.' : 'Choose two different photos.';
      if (reason === 'pose_mismatch') return ru ? 'Фото должны быть одного ракурса.' : 'Photos must use the same pose.';
      if (reason === 'chronology_invalid') {
        return ru
          ? 'Дата «До» должна быть раньше даты «После».'
          : 'The Before photo must be earlier than the After photo.';
      }
      return ru ? 'Выберите два фото для сравнения.' : 'Choose two photos to compare.';
    },
  };
};
