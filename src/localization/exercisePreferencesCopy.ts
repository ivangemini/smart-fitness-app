import type { SupportedLocale } from './messages';

export const getExercisePreferencesCopy = (locale: SupportedLocale) => {
  const isRussian = locale === 'ru';

  return {
    title: isRussian ? 'Предпочтения упражнения' : 'Exercise preferences',
    description: isRussian
      ? 'Сохраняются только на этом устройстве. Эти настройки подготовлены для будущих умных замен и пока не меняют программу автоматически.'
      : 'Saved on this device only. These settings prepare future smart replacements and do not change your program automatically yet.',
    avoidTitle: isRussian ? 'Избегать это упражнение' : 'Avoid this exercise',
    avoidDescription: isRussian
      ? 'Отметьте, если движение неудобно, не подходит по оборудованию или вы не хотите его видеть в будущих заменах.'
      : 'Use this when the movement is uncomfortable, equipment is unavailable, or you do not want it in future replacements.',
    noteLabel: isRussian ? 'Личная заметка' : 'Personal note',
    notePlaceholder: isRussian
      ? 'Например: заменить на тренажёр, если занята скамья'
      : 'For example: use the machine when the bench is busy',
    noteHelper: (maxLength: number) =>
      isRussian
        ? `Необязательно · до ${maxLength} символов`
        : `Optional · up to ${maxLength} characters`,
    save: isRussian ? 'Сохранить предпочтения' : 'Save preferences',
    saving: isRussian ? 'Сохранение…' : 'Saving…',
    saved: isRussian ? 'Предпочтения сохранены' : 'Preferences saved',
    loadError: isRussian
      ? 'Не удалось загрузить сохранённые предпочтения. Можно изменить их и попробовать сохранить заново.'
      : 'Saved preferences could not be loaded. You can edit them and try saving again.',
    saveError: isRussian
      ? 'Не удалось сохранить предпочтения. Попробуйте ещё раз.'
      : 'Preferences could not be saved. Try again.',
  };
};
