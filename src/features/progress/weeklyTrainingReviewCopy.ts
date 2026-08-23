import type { SupportedLocale } from '@/localization/messages';

import type { RecoveryModifierState } from './adaptiveProgramEngine';

export const getWeeklyTrainingReviewCopy = (locale: SupportedLocale) => {
  const ru = locale === 'ru';
  const recoveryLabel = (state: RecoveryModifierState) => {
    switch (state) {
      case 'neutral':
        return ru ? 'Без предупреждающих сигналов' : 'No caution signals';
      case 'caution':
        return ru ? 'Есть сигналы осторожности' : 'Caution signals present';
      case 'strong_caution':
        return ru ? 'Есть сильные сигналы осторожности' : 'Strong caution signals present';
      default:
        return ru ? 'Недостаточно свежих данных' : 'No fresh recovery evidence';
    }
  };

  return {
    title: ru ? 'Обзор недели' : 'Weekly review',
    subtitle: ru
      ? 'Последние 7 дней из уже рассчитанных данных тренировок и восстановления.'
      : 'The last 7 days composed from existing training and recovery evidence.',
    loading: ru ? 'Собираем обзор…' : 'Building review…',
    unavailable: ru ? 'Обзор недели сейчас недоступен.' : 'Weekly review is unavailable right now.',
    plan: ru ? 'План' : 'Plan',
    planUnavailable: ru ? 'Активная программа не выбрана.' : 'No active training program.',
    completedPlanned: ru ? 'Выполнено по плану' : 'Completed as planned',
    otherSessions: ru ? 'Другие тренировки' : 'Other workouts',
    unresolvedSlots: ru ? 'Неопределённые слоты плана' : 'Unresolved plan slots',
    coverage: ru ? 'Тренировочная нагрузка' : 'Training coverage',
    workingSets: ru ? 'рабочих подходов' : 'working sets',
    activeMuscles: ru ? 'активных мышц' : 'active muscles',
    movementPatterns: ru ? 'паттернов движений' : 'movement patterns',
    recovery: ru ? 'Контекст восстановления' : 'Recovery context',
    recoveryLabel,
    recoverySignals: (count: string) =>
      ru ? `Сигналы: ${count}` : `Signals: ${count}`,
    adaptive: ru ? 'Предложения по программе' : 'Program proposals',
    adaptiveUnavailable: ru
      ? 'Без активной программы адаптивные предложения не рассчитываются.'
      : 'Adaptive proposals require an active program.',
    progress: ru ? 'прогресс' : 'progress',
    maintain: ru ? 'сохранить' : 'maintain',
    review: ru ? 'проверить' : 'review',
    recoveryAdjusted: ru ? 'изменено восстановлением' : 'adjusted by recovery',
    keySignals: ru ? 'Ключевые сигналы' : 'Key signals',
    noSignals: ru ? 'Значимых сигналов за окно нет.' : 'No material signals in this window.',
    openDetails: ru ? 'Открыть детали за 7 дней' : 'Open 7-day details',
    deterministicHint: ru
      ? 'Обзор ничего не меняет в программе автоматически.'
      : 'This review does not change your program automatically.',
  };
};
