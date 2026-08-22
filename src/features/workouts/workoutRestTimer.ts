export type WorkoutRestTimerState =
  | {
      exerciseId: string;
      durationSeconds: number;
      status: 'running';
      endsAtMs: number;
    }
  | {
      exerciseId: string;
      durationSeconds: number;
      status: 'paused';
      remainingSeconds: number;
    };

const MAX_REST_SECONDS = 60 * 60;

const normalizeSeconds = (value: unknown): number | null => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  const seconds = Math.floor(value);
  if (seconds <= 0) return null;
  return Math.min(seconds, MAX_REST_SECONDS);
};

export const startWorkoutRestTimer = ({
  exerciseId,
  restSeconds,
  nowMs,
}: {
  exerciseId: string;
  restSeconds?: number;
  nowMs: number;
}): WorkoutRestTimerState | null => {
  const durationSeconds = normalizeSeconds(restSeconds);
  if (!exerciseId || durationSeconds === null || !Number.isFinite(nowMs)) return null;

  return {
    exerciseId,
    durationSeconds,
    status: 'running',
    endsAtMs: nowMs + durationSeconds * 1000,
  };
};

export const getWorkoutRestTimerRemainingSeconds = (
  timer: WorkoutRestTimerState,
  nowMs: number,
): number => {
  if (timer.status === 'paused') return Math.max(0, timer.remainingSeconds);
  if (!Number.isFinite(nowMs)) return 0;
  return Math.max(0, Math.ceil((timer.endsAtMs - nowMs) / 1000));
};

export const pauseWorkoutRestTimer = (
  timer: WorkoutRestTimerState,
  nowMs: number,
): WorkoutRestTimerState | null => {
  const remainingSeconds = getWorkoutRestTimerRemainingSeconds(timer, nowMs);
  if (remainingSeconds <= 0) return null;
  if (timer.status === 'paused') return timer;

  return {
    exerciseId: timer.exerciseId,
    durationSeconds: timer.durationSeconds,
    status: 'paused',
    remainingSeconds,
  };
};

export const resumeWorkoutRestTimer = (
  timer: WorkoutRestTimerState,
  nowMs: number,
): WorkoutRestTimerState | null => {
  const remainingSeconds = getWorkoutRestTimerRemainingSeconds(timer, nowMs);
  if (remainingSeconds <= 0 || !Number.isFinite(nowMs)) return null;
  if (timer.status === 'running') return timer;

  return {
    exerciseId: timer.exerciseId,
    durationSeconds: timer.durationSeconds,
    status: 'running',
    endsAtMs: nowMs + remainingSeconds * 1000,
  };
};

export const adjustWorkoutRestTimer = (
  timer: WorkoutRestTimerState,
  deltaSeconds: number,
  nowMs: number,
): WorkoutRestTimerState | null => {
  if (!Number.isFinite(deltaSeconds)) return timer;
  const currentRemaining = getWorkoutRestTimerRemainingSeconds(timer, nowMs);
  const nextRemaining = Math.min(
    MAX_REST_SECONDS,
    Math.max(0, currentRemaining + Math.trunc(deltaSeconds)),
  );
  if (nextRemaining <= 0) return null;

  if (timer.status === 'paused') {
    return {
      ...timer,
      remainingSeconds: nextRemaining,
    };
  }

  return {
    ...timer,
    endsAtMs: nowMs + nextRemaining * 1000,
  };
};

export const formatWorkoutRestTimer = (seconds: number): string => {
  const safeSeconds = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
};
