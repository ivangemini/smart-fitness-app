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

const localDayBounds = (localDate: string) => {
  const start = new Date(`${localDate}T00:00:00`);
  const end = new Date(`${localDate}T23:59:59.999`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error('invalid_local_date');
  }
  return { startDate: start.toISOString(), endDate: end.toISOString() };
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
      const value = await bridge.readStepCount(localDayBounds(localDate));
      if (!value) return null;
      return normalizeDailyStepAggregate({
        localDate,
        steps: value.steps,
        source,
        measuredAt: value.measuredAt,
      });
    },
  };
}
