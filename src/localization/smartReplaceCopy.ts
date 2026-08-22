import type { SupportedLocale } from './messages';

export const getSmartReplaceCopy = (locale: SupportedLocale) => {
  const isRussian = locale === 'ru';

  return {
    title: isRussian ? 'Умная замена' : 'Smart Replace',
    description: isRussian
      ? 'Кандидаты берутся только из проверенных замен и фильтруются по вашим предпочтениям.'
      : 'Candidates come only from reviewed substitutions and are filtered by your preferences.',
    loading: isRussian ? 'Подбираем проверенные замены…' : 'Resolving reviewed replacements…',
    empty: isRussian
      ? 'Подходящих проверенных замен сейчас нет.'
      : 'No eligible reviewed replacements are available right now.',
    error: isRussian
      ? 'Не удалось проверить доступные замены.'
      : 'Available replacements could not be resolved.',
    open: (label: string) => (isRussian ? `Открыть: ${label}` : `Open: ${label}`),
    disclaimer: isRussian
      ? 'Открытие кандидата не изменяет программу или активную тренировку. Замена применяется только отдельным явным действием.'
      : 'Opening a candidate does not change your program or active workout. A replacement is applied only through a separate explicit action.',
  };
};
