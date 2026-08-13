const ENGLISH_BIOMARKER_NAMES: Readonly<Record<string, string>> = {
  alanine_aminotransferase: 'ALT',
  aspartate_aminotransferase: 'AST',
  glucose: 'Glucose',
  hemoglobin_a1c: 'HbA1c',
  testosterone_total: 'Total testosterone',
  estradiol: 'Estradiol',
  sex_hormone_binding_globulin: 'SHBG',
  thyroid_stimulating_hormone: 'TSH',
  ferritin: 'Ferritin',
  ldl_cholesterol: 'LDL cholesterol',
  hdl_cholesterol: 'HDL cholesterol',
  triglycerides: 'Triglycerides',
};

const RUSSIAN_BIOMARKER_NAMES: Readonly<Record<string, string>> = {
  alanine_aminotransferase: 'АЛТ',
  aspartate_aminotransferase: 'АСТ',
  glucose: 'Глюкоза',
  hemoglobin_a1c: 'HbA1c',
  testosterone_total: 'Тестостерон общий',
  estradiol: 'Эстрадиол',
  sex_hormone_binding_globulin: 'ГСПГ',
  thyroid_stimulating_hormone: 'ТТГ',
  ferritin: 'Ферритин',
  ldl_cholesterol: 'Холестерин ЛПНП',
  hdl_cholesterol: 'Холестерин ЛПВП',
  triglycerides: 'Триглицериды',
};

export function getBiomarkerDisplayName(markerId: string, locale: string): string {
  const names = locale.toLowerCase().startsWith('ru')
    ? RUSSIAN_BIOMARKER_NAMES
    : ENGLISH_BIOMARKER_NAMES;
  return names[markerId] ?? markerId.replaceAll('_', ' ');
}
