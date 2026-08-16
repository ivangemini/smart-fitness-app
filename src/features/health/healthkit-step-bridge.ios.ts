import {
  AuthorizationRequestStatus,
  getRequestStatusForAuthorization,
  isHealthDataAvailable,
  queryStatisticsForQuantity,
  requestAuthorization,
} from '@kingstinct/react-native-healthkit';

import { createHealthKitStepBridge } from './healthkit-step-adapter';

const STEP_COUNT = 'HKQuantityTypeIdentifierStepCount' as const;

export const healthKitStepBridge = createHealthKitStepBridge({
  isAvailable: () => isHealthDataAvailable(),
  async authorizationRequestNeeded() {
    const status = await getRequestStatusForAuthorization({
      toRead: [STEP_COUNT],
    });
    return status !== AuthorizationRequestStatus.unnecessary;
  },
  async requestReadAuthorization() {
    await requestAuthorization({ toRead: [STEP_COUNT] });
  },
  async readCumulativeSteps({ startDate, endDate }) {
    const result = await queryStatisticsForQuantity(STEP_COUNT, ['cumulativeSum'], {
      filter: {
        date: {
          startDate,
          endDate,
          strictStartDate: true,
          strictEndDate: true,
        },
      },
      unit: 'count',
    });
    return result.sumQuantity?.quantity ?? null;
  },
});
