export function getLabComparisonCopy(locale: string) {
  const russian = locale.toLowerCase().startsWith('ru');
  return russian
    ? {
        entryTitle: 'Сравнить анализы',
        entryBody:
          'Сопоставьте подтверждённые анализы по изменениям относительно одинаковых лабораторных референсов.',
        entryButton: 'Сравнить последние',
        chooseButton: 'Выбрать анализы',
        selectTitle: 'Выберите анализы',
        selectSubtitle:
          'Сначала выберите более ранний анализ, затем более поздний. Сравниваются только подтверждённые результаты.',
        selectPrevious: 'Как предыдущий',
        selectCurrent: 'Как текущий',
        selectedPrevious: 'Выбран как предыдущий',
        selectedCurrent: 'Выбран как текущий',
        compareSelected: 'Сравнить выбранные',
        invalidSelection:
          'Нужны два разных анализа, и дата предыдущего должна быть раньше даты текущего.',
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
        entryTitle: 'Compare panels',
        entryBody:
          'Compare confirmed panels by movement relative to matching laboratory reference classifications.',
        entryButton: 'Compare latest',
        chooseButton: 'Choose panels',
        selectTitle: 'Choose panels',
        selectSubtitle:
          'Choose an earlier panel first and a later panel second. Only confirmed results are compared.',
        selectPrevious: 'Use as previous',
        selectCurrent: 'Use as current',
        selectedPrevious: 'Selected as previous',
        selectedCurrent: 'Selected as current',
        compareSelected: 'Compare selected',
        invalidSelection:
          'Choose two different panels, with the previous collection date earlier than the current one.',
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
