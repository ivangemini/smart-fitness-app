import {
  normalizeDailyStepAggregate,
  type DailyStepAggregate,
  type HealthActivityAvailability,
  type StepActivitySource,
} from './steps-contract';

export type NativeStepBridge = {
  isAvailable(): Promise<boolean>;
  getPermissionState(): Promise<'not_determined' | 'granted' | 'denied'>;
  requestPermission(): Promise<'granted' | 'denied'>;
  readStepCount(input: {
    startDate: string;
    endDate: string;
  }): Promise<{ steps: number; measuredAt: string } | null>;
};

const LOCAL_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export type LocalDayStepWindow = {
  localDate: string;
  startDate: string;
  endDate: string;
};

export const createLocalDayStepWindow = (localDate: string): LocalDayStepWindow => {
  if (!LOCAL_DATE_PATTERN.test(localDate)) {
    throw new Error('invalid_local_date');
  }

  const [year, month, day] = localDate.split('-').map(Number);
  const start = new Date(year, month - 1, day);
  if (
    start.getFullYear() !== year ||
    start.getMonth() !== month - 1 ||
    start.getDate() !== day
  ) {
    throw new Error('invalid_local_date');
  }

  // Native health stores are queried over the device's local calendar day.
  // Use a half-open [local midnight, next local midnight) interval so DST
  // transitions naturally produce 23/24/25-hour windows without overlap.
  const end = new Date(year, month - 1, day + 1);

  return {
    localDate,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
};

export function createNativeStepActivitySource(
  bridge: NativeStepBridge,
  source: DailyStepAggregate['source'],
): StepActivitySource {
  const getAvailability = async (): Promise<HealthActivityAvailability> => {
    if (!(await bridge.isAvailable())) return 'unsupported';
    const permission = await bridge.getPermissionState();
    if (permission === 'granted') return 'available';
    if (permission === 'denied') return 'denied';
    return 'permission_required';
  };

  return {
    getAvailability,
    async requestReadPermission() {
      if (!(await bridge.isAvailable())) return 'unsupported';
      const permission = await bridge.requestPermission();
      return permission === 'granted' ? 'available' : 'denied';
    },
    async readDailySteps(localDate) {
      if ((await getAvailability()) !== 'available') return null;
      const window = createLocalDayStepWindow(localDate);
      const value = await bridge.readStepCount({
        startDate: window.startDate,
        endDate: window.endDate,
      });
      if (!value) return null;
      return normalizeDailyStepAggregate({
        localDate: window.localDate,
        steps: value.steps,
        source,
        measuredAt: value.measuredAt,
      });
    },
  };
}
