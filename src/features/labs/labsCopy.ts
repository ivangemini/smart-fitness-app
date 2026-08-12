export function getLabsCopy(locale: string) {
  const russian = locale.toLowerCase().startsWith('ru');

  return russian
    ? {
        tabTitle: 'Анализы',
        subtitle: 'Документы, показатели и динамика в одном месте.',
        emptyTitle: 'Добавьте первый анализ',
        emptyBody:
          'Здесь появятся подтверждённые показатели, история документов, отклонения и графики. Распознанные данные будут сохраняться только после вашей проверки.',
        addResults: 'Добавить результаты',
        processingTitle: 'Импорт документов готовится',
        processingBody:
          'Фото и PDF будут обрабатываться через приватный backend-пайплайн с обязательной проверкой распознанных значений перед сохранением.',
        biomarkersTitle: 'Показатели',
        biomarkersBody: 'После подтверждения результатов здесь появится история по каждому маркеру.',
        trendsTitle: 'Динамика',
        trendsBody: 'Графики будут строиться только по подтверждённым значениям.',
      }
    : {
        tabTitle: 'Labs',
        subtitle: 'Documents, biomarkers, and trends in one place.',
        emptyTitle: 'Add your first lab result',
        emptyBody:
          'Confirmed biomarkers, documents, attention states, and trends will live here. Extracted values will only become history after you review them.',
        addResults: 'Add results',
        processingTitle: 'Document import is being connected',
        processingBody:
          'Photos and PDFs will use a private backend processing pipeline with mandatory review before extracted values are saved.',
        biomarkersTitle: 'Biomarkers',
        biomarkersBody: 'Confirmed results will build a longitudinal history for each marker.',
        trendsTitle: 'Trends',
        trendsBody: 'Charts will use confirmed values only.',
      };
}
