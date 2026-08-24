import type { NativeActivityFactsBridge } from './native-activity-source';

export type HealthKitActivityApi = {
  isAvailable(): boolean;
  authorizationRequestNeeded(): Promise<boolean>;
  requestReadAuthorization(): Promise<void>;
  readDailyActivity(input: {
    startDate: Date;
    endDate: Date;
  }): Promise<{
    steps: number | null;
    distanceMeters: number | null;
    activeEnergyKcal: number | null;
  } | null>;
};

export function createHealthKitActivityBridge(
  api: HealthKitActivityApi,
): NativeActivityFactsBridge {
  return {
    async isAvailable() {
      return api.isAvailable();
    },
    async getPermissionState() {
      if (!api.isAvailable()) return 'denied';
      return (await api.authorizationRequestNeeded()) ? 'not_determined' : 'granted';
    },
    async requestPermission() {
      if (!api.isAvailable()) return 'denied';
      try {
        await api.requestReadAuthorization();
        return 'granted';
      } catch {
        return 'denied';
      }
    },
    async readDailyActivity(input) {
      if (!api.isAvailable()) return null;
      const value = await api.readDailyActivity({
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
      });
      if (!value) return null;
      return {
        ...value,
        measuredAt: input.endDate,
      };
    },
  };
}
