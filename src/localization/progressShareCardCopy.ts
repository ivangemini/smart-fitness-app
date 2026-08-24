import type { SupportedLocale } from './messages';

export const getProgressShareCardCopy = (locale: SupportedLocale) => ({
  brand: 'Smart Fitness',
  workoutTitle: locale === 'ru' ? 'Тренировка завершена' : 'Workout complete',
  prTitle: locale === 'ru' ? 'Новый личный рекорд' : 'New personal record',
  weeklyTitle: locale === 'ru' ? 'Итоги недели' : 'Weekly training review',
  weightTitle: locale === 'ru' ? 'Прогресс веса' : 'Weight progress',
  measurementTitle: locale === 'ru' ? 'Прогресс замеров' : 'Measurement progress',
  duration: locale === 'ru' ? 'Длительность' : 'Duration',
  exercises: locale === 'ru' ? 'Упражнения' : 'Exercises',
  workingSets: locale === 'ru' ? 'Рабочие подходы' : 'Working sets',
  volume: locale === 'ru' ? 'Объём' : 'Volume',
  previous: locale === 'ru' ? 'Предыдущее' : 'Previous',
  change: locale === 'ru' ? 'Изменение' : 'Change',
  current: locale === 'ru' ? 'Сейчас' : 'Current',
  completedPlanned: locale === 'ru' ? 'По плану выполнено' : 'Planned completed',
  otherCompleted: locale === 'ru' ? 'Другие тренировки' : 'Other workouts',
  unresolvedPlan: locale === 'ru' ? 'Не сопоставлено в плане' : 'Unresolved plan',
  activeMuscles: locale === 'ru' ? 'Активные мышцы' : 'Active muscles',
  movementPatterns: locale === 'ru' ? 'Паттерны движений' : 'Movement patterns',
  recovery: locale === 'ru' ? 'Контекст восстановления' : 'Recovery context',
  adaptive: locale === 'ru' ? 'Адаптивные действия' : 'Adaptive actions',
  adaptiveUnavailable: locale === 'ru' ? 'Нет данных' : 'Not available',
  adaptiveSummary: (progress: string, maintain: string, review: string) =>
    locale === 'ru'
      ? `прогресс ${progress} · оставить ${maintain} · проверить ${review}`
      : `progress ${progress} · maintain ${maintain} · review ${review}`,
  recoveryUnknown: locale === 'ru' ? 'Нет свежих данных' : 'No fresh data',
  recoveryNeutral: locale === 'ru' ? 'Без модификатора' : 'No modifier',
  recoveryCaution: locale === 'ru' ? 'Осторожность' : 'Caution',
  recoveryStrongCaution: locale === 'ru' ? 'Повышенная осторожность' : 'Strong caution',
  signalCount: (count: string) =>
    locale === 'ru' ? `Сигналов: ${count}` : `Signals: ${count}`,
  minuteUnit: locale === 'ru' ? 'мин' : 'min',
  repsUnit: locale === 'ru' ? 'повт.' : 'reps',
  metricLoad: locale === 'ru' ? 'Вес' : 'Load',
  metricReps: locale === 'ru' ? 'Повторения' : 'Repetitions',
  metricEstimated1Rm: locale === 'ru' ? 'Расчётный 1ПМ' : 'Estimated 1RM',
  metricSessionVolume: locale === 'ru' ? 'Объём за сессию' : 'Session volume',
  metricWaist: locale === 'ru' ? 'Талия' : 'Waist',
  metricChest: locale === 'ru' ? 'Грудь' : 'Chest',
  metricHips: locale === 'ru' ? 'Бёдра' : 'Hips',
  metricShoulders: locale === 'ru' ? 'Плечи' : 'Shoulders',
  metricNeck: locale === 'ru' ? 'Шея' : 'Neck',
  metricUpperArm: locale === 'ru' ? 'Плечо' : 'Upper arm',
  metricThigh: locale === 'ru' ? 'Бедро' : 'Thigh',
  metricCalf: locale === 'ru' ? 'Икра' : 'Calf',
  metricBodyFat: locale === 'ru' ? 'Жир' : 'Body fat',
  metricCustom: locale === 'ru' ? 'Замер' : 'Measurement',
  sourceNote:
    locale === 'ru'
      ? 'Сформировано из сохранённых данных Smart Fitness'
      : 'Built from recorded Smart Fitness data',
  shareAction: locale === 'ru' ? 'Поделиться' : 'Share',
  sharePreviewTitle: locale === 'ru' ? 'Поделиться прогрессом' : 'Share progress',
  sharePreviewSubtitle:
    locale === 'ru'
      ? 'Проверьте карточку перед открытием системного меню.'
      : 'Review the card before opening the system share sheet.',
  shareImage: locale === 'ru' ? 'Поделиться карточкой' : 'Share card',
  shareSummary: locale === 'ru' ? 'Поделиться сводкой' : 'Share summary',
  sharePrivacy:
    locale === 'ru'
      ? 'Отправка начинается только после вашего действия. Фото, заметки и скрытая публикация не добавляются.'
      : 'Sharing starts only after your action. Photos, notes, and hidden publication are not included.',
  shareFailed:
    locale === 'ru'
      ? 'Не удалось открыть системное меню. Попробуйте ещё раз.'
      : 'Could not open the system share sheet. Try again.',
  close: locale === 'ru' ? 'Закрыть' : 'Close',
});
