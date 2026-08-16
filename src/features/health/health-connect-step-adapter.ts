import type { NativeStepBridge } from './native-step-source';

export type HealthConnectStepApi = {
  isAvailable(): Promise<boolean>;
  hasReadPermission(): Promise<boolean>;
  requestReadPermission(): Promise<boolean>;
  readCumulativeSteps(input: {
    startDate: string;
    endDate: string;
  }): Promise<number | null>;
};

export function createHealthConnectStepBridge(
  api: HealthConnectStepApi,
): NativeStepBridge {
  let deniedInCurrentProcess = false;
  return {
    isAvailable: () => api.isAvailable(),
    async getPermissionState() {
      if (!(await api.isAvailable())) return 'denied';
      if (await api.hasReadPermission()) return 'granted';
      return deniedInCurrentProcess ? 'denied' : 'not_determined';
    },
    async requestPermission() {
      if (!(await api.isAvailable())) return 'denied';
      const granted = await api.requestReadPermission();
      deniedInCurrentProcess = !granted;
      return granted ? 'granted' : 'denied';
    },
    async readStepCount(input) {
      if (!(await api.isAvailable()) || !(await api.hasReadPermission())) {
        return null;
      }
      const steps = await api.readCumulativeSteps(input);
      if (steps === null) return null;
      return {
        steps: Math.max(0, Math.floor(steps)),
        measuredAt: input.endDate,
      };
    },
  };
}
