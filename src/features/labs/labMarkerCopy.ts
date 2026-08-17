import type { LabHistoryWindow } from './labHistoryWindow';

export type LabHistoryWindowLabels = Readonly<Record<LabHistoryWindow, string>>;

export function getLabMarkerCopy(locale: string) {
  const russian = locale.toLowerCase().startsWith('ru');
  const historyWindowLabels: LabHistoryWindowLabels = russian
    ? { '3m': '3 мес', '6m': '6 мес', '1y': '1 год', all: 'Все' }
    : { '3m': '3M', '6m': '6M', '1y': '1Y', all: 'All' };

  return {
    historyWindowLabels,
    chartAccessibilityLabel: ({
      name,
      pointCount,
      windowLabel,
    }: {
      name: string;
      pointCount: number;
      windowLabel: string;
    }) =>
      russian
        ? `График ${name}. Подтверждённых точек: ${pointCount}. Период: ${windowLabel}.`
        : `${name} trend chart. Confirmed points: ${pointCount}. Window: ${windowLabel}.`,
  };
}
