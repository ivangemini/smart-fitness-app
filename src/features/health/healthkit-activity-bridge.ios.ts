import {
  AuthorizationRequestStatus,
  getRequestStatusForAuthorization,
  isHealthDataAvailable,
  queryStatisticsForQuantity,
  requestAuthorization,
} from '@kingstinct/react-native-healthkit';

import { createHealthKitActivityBridge } from './healthkit-activity-adapter';

const STEP_COUNT = 'HKQuantityTypeIdentifierStepCount' as const;
const WALKING_RUNNING_DISTANCE =
  'HKQuantityTypeIdentifierDistanceWalkingRunning' as const;
const ACTIVE_ENERGY = 'HKQuantityTypeIdentifierActiveEnergyBurned' as const;
const READ_TYPES = [STEP_COUNT, WALKING_RUNNING_DISTANCE, ACTIVE_ENERGY] as const;

export const healthKitActivityBridge = createHealthKitActivityBridge({
  isAvailable: () => isHealthDataAvailable(),
  async authorizationRequestNeeded() {
    const status = await getRequestStatusForAuthorization({
      toRead: [...READ_TYPES],
    });
    return status !== AuthorizationRequestStatus.unnecessary;
  },
  async requestReadAuthorization() {
    await requestAuthorization({ toRead: [...READ_TYPES] });
  },
  async readDailyActivity({ startDate, endDate }) {
    const filter = {
      date: {
        startDate,
        endDate,
        strictStartDate: true,
        strictEndDate: true,
      },
    };
    const [steps, distance, activeEnergy] = await Promise.all([
      queryStatisticsForQuantity(STEP_COUNT, ['cumulativeSum'], {
        filter,
        unit: 'count',
      }),
      queryStatisticsForQuantity(WALKING_RUNNING_DISTANCE, ['cumulativeSum'], {
        filter,
        unit: 'm',
      }),
      queryStatisticsForQuantity(ACTIVE_ENERGY, ['cumulativeSum'], {
        filter,
        unit: 'kcal',
      }),
    ]);

    const value = {
      steps: steps.sumQuantity?.quantity ?? null,
      distanceMeters: distance.sumQuantity?.quantity ?? null,
      activeEnergyKcal: activeEnergy.sumQuantity?.quantity ?? null,
    };

    return value.steps === null &&
      value.distanceMeters === null &&
      value.activeEnergyKcal === null
      ? null
      : value;
  },
});
