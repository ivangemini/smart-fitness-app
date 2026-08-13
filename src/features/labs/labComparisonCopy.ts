export function getLabComparisonCopy(locale: string) {
  const russian = locale.toLowerCase().startsWith('ru');
  return russian
    ? {
        entryTitle: 'Сравнить последние анализы',
        entryBody:
          'Сопоставьте два последних подтверждённых анализа по изменениям относительно референсов лаборатории.',
        entryButton: 'Сравнить',
        title: 'Сравнение анализов',
        subtitle:
          'Показано только изменение категории относительно лабораторных референсов. Это не оценка улучшения или ухудшения здоровья.',
        loading: 'Сравниваем подтверждённые результаты…',
        failed: 'Не удалось сравнить эти анализы.',
        retry: 'Повторить',
        previous: 'Предыдущий анализ',
        current: 'Текущий анализ',
        empty: 'В текущем анализе нет подтверждённых показателей для сравнения.',
        state: {
          new: 'Новый показатель',
          stable: 'Категория без изменений',
          classification_improved: 'Ближе к референсной категории',
          classification_worsened: 'Дальше от референсной категории',
          not_comparable: 'Нельзя корректно сравнить',
        },
        previousMissing: 'Ранее отсутствовал',
      }
    : {
        entryTitle: 'Compare latest panels',
        entryBody:
          'Compare the two latest confirmed panels by movement relative to the laboratory reference classifications.',
        entryButton: 'Compare',
        title: 'Panel comparison',
        subtitle:
          'This shows classification movement relative to laboratory reference ranges only. It is not a judgment that health improved or worsened.',
        loading: 'Comparing confirmed results…',
        failed: 'Unable to compare these panels.',
        retry: 'Retry',
        previous: 'Previous panel',
        current: 'Current panel',
        empty: 'The current panel has no confirmed biomarkers to compare.',
        state: {
          new: 'New biomarker',
          stable: 'Classification unchanged',
          classification_improved: 'Closer to reference classification',
          classification_worsened: 'Further from reference classification',
          not_comparable: 'Not safely comparable',
        },
        previousMissing: 'Not present previously',
      };
}
