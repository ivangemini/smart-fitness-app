export function getLabMultiTrendCopy(locale: string) {
  const russian = locale.toLowerCase().startsWith('ru');
  return russian
    ? {
        entryTitle: 'Сравнить динамику показателей',
        entryBody:
          'Выберите до трёх показателей с общей осью или сравните их положение относительно собственных лабораторных референсов.',
        entryButton: 'Открыть график',
        title: 'Динамика показателей',
        subtitle:
          'График использует только подтверждённые результаты. Relative-режим нормализует каждое значение по указанному в том анализе двухстороннему референсу.',
        absolute: 'Абсолютные',
        relative: 'К референсу',
        choose: 'Выберите 2–3 показателя',
        selected: 'Выбрано',
        incompatible: 'Несовместимая ось',
        maxSelected: 'Можно выбрать не больше трёх показателей.',
        selectionHint:
          'В абсолютном режиме единицы должны совпадать. Для relative-режима нужен двухсторонний референс в той же единице.',
        show: 'Построить график',
        loading: 'Загружаем историю…',
        failed: 'Не удалось загрузить историю выбранных показателей.',
        noPoints: 'Для выбранного режима недостаточно совместимых исторических точек.',
        relativeAxis:
          '0% — нижняя граница референса, 100% — верхняя. Значения вне диапазона могут быть ниже 0% или выше 100%.',
      }
    : {
        entryTitle: 'Compare biomarker trends',
        entryBody:
          'Select up to three biomarkers on one compatible axis, or compare their position relative to their own laboratory references.',
        entryButton: 'Open chart',
        title: 'Biomarker trends',
        subtitle:
          'The chart uses confirmed results only. Relative mode normalizes each value against the two-sided reference supplied with that result.',
        absolute: 'Absolute',
        relative: 'To reference',
        choose: 'Choose 2–3 biomarkers',
        selected: 'Selected',
        incompatible: 'Incompatible axis',
        maxSelected: 'You can select up to three biomarkers.',
        selectionHint:
          'Absolute mode requires matching units. Relative mode requires a two-sided reference in the same unit.',
        show: 'Build chart',
        loading: 'Loading history…',
        failed: 'Unable to load the selected biomarker histories.',
        noPoints: 'There are not enough compatible historical points for this mode.',
        relativeAxis:
          '0% is the lower reference bound and 100% is the upper bound. Values outside the range may fall below 0% or above 100%.',
      };
}
