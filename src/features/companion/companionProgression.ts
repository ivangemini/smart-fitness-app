import type { WorkoutSession } from '@/types';

export type CompanionMood = 'starting' | 'steady' | 'active';

export type CompanionProgress = {
  activeDaysLast7: number;
  level: number;
  mood: CompanionMood;
  totalActiveDays: number;
  totalXp: number;
  xpIntoLevel: number;
  xpToNextLevel: number;
};

const XP_PER_ACTIVE_DAY = 100;
const XP_PER_LEVEL = 500;

const toLocalDayKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseFinishedAt = (finishedAt: string): Date | null => {
  const date = new Date(finishedAt);
  return Number.isFinite(date.getTime()) ? date : null;
};

export const deriveCompanionProgress = (
  workoutSessions: readonly Pick<WorkoutSession, 'finishedAt'>[],
  now = new Date(),
): CompanionProgress => {
  const activeDayKeys = new Set<string>();
  workoutSessions.forEach((session) => {
    const date = parseFinishedAt(session.finishedAt);
    if (date) activeDayKeys.add(toLocalDayKey(date));
  });

  let activeDaysLast7 = 0;
  for (let offset = 0; offset < 7; offset += 1) {
    const day = new Date(now);
    day.setHours(12, 0, 0, 0);
    day.setDate(day.getDate() - offset);
    if (activeDayKeys.has(toLocalDayKey(day))) activeDaysLast7 += 1;
  }

  const totalActiveDays = activeDayKeys.size;
  const totalXp = totalActiveDays * XP_PER_ACTIVE_DAY;
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = totalXp % XP_PER_LEVEL;
  const xpToNextLevel = XP_PER_LEVEL - xpIntoLevel;
  const mood: CompanionMood =
    totalActiveDays === 0 ? 'starting' : activeDaysLast7 >= 3 ? 'active' : 'steady';

  return {
    activeDaysLast7,
    level,
    mood,
    totalActiveDays,
    totalXp,
    xpIntoLevel,
    xpToNextLevel,
  };
};
