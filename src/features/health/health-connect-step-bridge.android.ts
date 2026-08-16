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

export const healthConnectStepBridge = createHealthConnectStepBridge({
  isAvailable: ensureAvailable,
  async hasReadPermission() {
    if (!(await ensureAvailable())) return false;
    const permissions = await getGrantedPermissions();
    return permissions.some(
      (permission) =>
        'accessType' in permission &&
        'recordType' in permission &&
        permission.accessType === 'read' &&
        permission.recordType === 'Steps',
    );
  },
  async requestReadPermission() {
    if (!(await ensureAvailable())) return false;
    const permissions = await requestPermission([STEPS_READ_PERMISSION]);
    return permissions.some(
      (permission) =>
        'accessType' in permission &&
        'recordType' in permission &&
        permission.accessType === 'read' &&
        permission.recordType === 'Steps',
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
    return result.COUNT_TOTAL;
  },
});
