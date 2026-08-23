import type { SupportedLocale } from './messages';

export const getTemplateSmartReplaceCopy = (locale: SupportedLocale) => {
  const ru = locale === 'ru';
  return {
    title: ru ? 'Smart Replace в шаблоне' : 'Template Smart Replace',
    subtitle: ru
      ? 'Замена применяется только к будущему сохранённому шаблону после проверки.'
      : 'Replacement changes only the future saved template after review.',
    replaceExercise: ru ? 'Smart Replace' : 'Smart Replace',
    reviewedSuggestions: ru ? 'Проверенные варианты' : 'Reviewed suggestions',
    noReviewedSuggestions: ru
      ? 'Для этого упражнения нет доступных проверенных вариантов.'
      : 'No reviewed replacements are available for this exercise.',
    loading: ru ? 'Загрузка вариантов…' : 'Loading replacements…',
    manualCatalog: ru ? 'Все упражнения' : 'All exercises',
    searchPlaceholder: ru ? 'Поиск упражнения' : 'Search exercises',
    noManualResults: ru ? 'Ничего не найдено.' : 'No exercises found.',
    reviewedReason: ru ? 'Проверенная замена' : 'Reviewed substitution',
    previewTitle: ru ? 'Предпросмотр замены' : 'Replacement preview',
    before: ru ? 'Сейчас' : 'Before',
    after: ru ? 'После' : 'After',
    prescriptionRows: (count: number) =>
      ru
        ? `Строк prescription с новой идентичностью: ${count}`
        : `Prescription rows remapped: ${count}`,
    preserved: ru
      ? 'Вес, повторы, target RPE и остальные поля prescription сохраняются. История завершённых тренировок не меняется.'
      : 'Load, reps, target RPE and other prescription fields are preserved. Completed workout history is unchanged.',
    apply: ru ? 'Применить к шаблону' : 'Apply to template',
    chooseAnother: ru ? 'Выбрать другое' : 'Choose another',
    cancel: ru ? 'Отмена' : 'Cancel',
    stale: ru
      ? 'Шаблон изменился после предпросмотра. Откройте замену ещё раз.'
      : 'The template changed after preview. Open the replacement again.',
    blocked: ru
      ? 'Эту замену больше нельзя безопасно применить.'
      : 'This replacement can no longer be applied safely.',
    unavailable: ru
      ? 'Предпросмотр этой замены недоступен.'
      : 'This replacement preview is unavailable.',
    applying: ru ? 'Применение…' : 'Applying…',
  };
};

export type TemplateSmartReplaceCopy = ReturnType<
  typeof getTemplateSmartReplaceCopy
>;
