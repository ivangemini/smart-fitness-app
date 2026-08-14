export function getLabInterpretationCopy(locale: string) {
  const russian = locale.toLowerCase().startsWith('ru');

  return russian
    ? {
        title: 'Контекст по результатам',
        body:
          'Разбор использует только подтверждённые показатели этого анализа. Это информационный контекст, а не диагноз или назначение лечения.',
        unavailable: 'Разбор сейчас недоступен. Подтверждённые результаты остаются сохранены без изменений.',
        run: 'Разобрать подтверждённые результаты',
        rerun: 'Обновить разбор',
        running: 'Анализируем подтверждённые данные…',
        failed: 'Не удалось получить разбор. Подтверждённые результаты не изменены.',
        retry: 'Повторить',
        noFindings: 'Дополнительного контекста по этим данным не найдено.',
        providerContext: 'Источник разбора',
        kinds: {
          reference_context: 'Референсный контекст',
          trend_context: 'Контекст динамики',
          data_quality_context: 'Качество данных',
        },
      }
    : {
        title: 'Results context',
        body:
          'This review uses only confirmed biomarkers from this lab document. It is informational context, not a diagnosis or treatment instruction.',
        unavailable: 'Interpretation is unavailable right now. Confirmed results remain unchanged.',
        run: 'Review confirmed results',
        rerun: 'Refresh review',
        running: 'Reviewing confirmed data…',
        failed: 'The review could not be completed. Confirmed results were not changed.',
        retry: 'Try again',
        noFindings: 'No additional context was returned for these confirmed data.',
        providerContext: 'Review source',
        kinds: {
          reference_context: 'Reference context',
          trend_context: 'Trend context',
          data_quality_context: 'Data quality',
        },
      };
}
