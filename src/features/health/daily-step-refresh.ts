const LOCAL_DAY_REFRESH_SLOP_MS = 1000;

export const getNextLocalDayRefreshDelay = (now: Date): number => {
  const nextLocalMidnight = new Date(now);
  nextLocalMidnight.setHours(24, 0, 0, 0);

  return Math.max(
    0,
    nextLocalMidnight.getTime() - now.getTime() + LOCAL_DAY_REFRESH_SLOP_MS,
  );
};
