import {
  aggregateRecord,
  getGrantedPermissions,
  getSdkStatus,
  initialize,
  requestPermission,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';

import { createHealthConnectStepBridge } from './health-connect-step-adapter';

const STEPS_READ_PERMISSION = {
  accessType: 'read',
  recordType: 'Steps',
} as const;

let initialization: Promise<boolean> | null = null;

const ensureAvailable = async (): Promise<boolean> => {
  if ((await getSdkStatus()) !== SdkAvailabilityStatus.SDK_AVAILABLE) return false;
  initialization ??= initialize();
  return initialization;
};

const isGrantedStepsReadPermission = (permission: unknown): boolean =>
  typeof permission === 'object' &&
  permission !== null &&
  'accessType' in permission &&
  'recordType' in permission &&
  permission.accessType === 'read' &&
  permission.recordType === 'Steps';

export const healthConnectStepBridge = createHealthConnectStepBridge({
  isAvailable: ensureAvailable,
  async hasReadPermission() {
    if (!(await ensureAvailable())) return false;
    return (await getGrantedPermissions()).some(isGrantedStepsReadPermission);
  },
  async requestReadPermission() {
    if (!(await ensureAvailable())) return false;
    return (await requestPermission([STEPS_READ_PERMISSION])).some(
      isGrantedStepsReadPermission,
    );
  },
  async readCumulativeSteps({ startDate, endDate }) {
    if (!(await ensureAvailable())) return null;
    const result = await aggregateRecord({
      recordType: 'Steps',
      timeRangeFilter: {
        operator: 'between',
        startTime: startDate,
        endTime: endDate,
      },
    });
    return Number.isFinite(result.COUNT_TOTAL) ? result.COUNT_TOTAL : null;
  },
});
