import {
  normalizeDailyActivityFacts,
  type ActivityFactSource,
  type DailyActivityFacts,
} from './activity-contract';
import { createLocalDayStepWindow } from './native-step-source';
import type { HealthActivityAvailability } from './steps-contract';

export type NativeActivityFactsBridge = {
  isAvailable(): Promise<boolean>;
  getPermissionState(): Promise<'not_determined' | 'granted' | 'denied'>;
  requestPermission(): Promise<'granted' | 'denied'>;
  readDailyActivity(input: {
    startDate: string;
    endDate: string;
  }): Promise<{
    steps: number | null;
    distanceMeters: number | null;
    activeEnergyKcal: number | null;
    measuredAt: string;
  } | null>;
};

export function createNativeActivityFactSource(
  bridge: NativeActivityFactsBridge,
  source: DailyActivityFacts['source'],
): ActivityFactSource {
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
    async readDailyActivity(localDate) {
      if ((await getAvailability()) !== 'available') return null;
      const window = createLocalDayStepWindow(localDate);
      const value = await bridge.readDailyActivity({
        startDate: window.startDate,
        endDate: window.endDate,
      });
      if (!value) return null;
      return normalizeDailyActivityFacts({
        localDate: window.localDate,
        steps: value.steps,
        distanceMeters: value.distanceMeters,
        activeEnergyKcal: value.activeEnergyKcal,
        source,
        measuredAt: value.measuredAt,
      });
    },
  };
}
