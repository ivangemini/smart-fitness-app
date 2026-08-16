import type { NativeStepBridge } from './native-step-source';

export type HealthKitStepApi = {
  isAvailable(): boolean;
  authorizationRequestNeeded(): Promise<boolean>;
  requestReadAuthorization(): Promise<void>;
  readCumulativeSteps(input: {
    startDate: Date;
    endDate: Date;
  }): Promise<number | null>;
};

export function createHealthKitStepBridge(api: HealthKitStepApi): NativeStepBridge {
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
    async readStepCount(input) {
      if (!api.isAvailable()) return null;
      const steps = await api.readCumulativeSteps({
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
      });
      if (steps === null) return null;
      return {
        steps: Math.max(0, Math.floor(steps)),
        measuredAt: input.endDate,
      };
    },
  };
}
