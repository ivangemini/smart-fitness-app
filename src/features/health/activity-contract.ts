import type { HealthActivityAvailability } from './steps-contract';

export type DailyActivityFacts = {
  localDate: string;
  steps: number | null;
  distanceMeters: number | null;
  activeEnergyKcal: number | null;
  source: 'healthkit';
  measuredAt: string;
};

export interface ActivityFactSource {
  getAvailability(): Promise<HealthActivityAvailability>;
  requestReadPermission(): Promise<HealthActivityAvailability>;
  readDailyActivity(localDate: string): Promise<DailyActivityFacts | null>;
}

const LOCAL_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const normalizeOptionalMetric = (
  value: number | null,
  errorCode: string,
): number | null => {
  if (value === null) return null;
  if (!Number.isFinite(value) || value < 0) throw new Error(errorCode);
  return value;
};

export function normalizeDailyActivityFacts(
  value: DailyActivityFacts,
): DailyActivityFacts {
  if (!LOCAL_DATE_PATTERN.test(value.localDate)) {
    throw new Error('invalid_local_date');
  }

  const steps = normalizeOptionalMetric(value.steps, 'invalid_step_count');
  const distanceMeters = normalizeOptionalMetric(
    value.distanceMeters,
    'invalid_distance',
  );
  const activeEnergyKcal = normalizeOptionalMetric(
    value.activeEnergyKcal,
    'invalid_active_energy',
  );

  if (steps === null && distanceMeters === null && activeEnergyKcal === null) {
    throw new Error('empty_activity_facts');
  }

  const measuredAt = new Date(value.measuredAt);
  if (Number.isNaN(measuredAt.getTime())) {
    throw new Error('invalid_measured_at');
  }

  return {
    ...value,
    steps: steps === null ? null : Math.floor(steps),
    distanceMeters,
    activeEnergyKcal,
    measuredAt: measuredAt.toISOString(),
  };
}

export function unavailableActivityFactSource(
  availability: Exclude<HealthActivityAvailability, 'available'> = 'unsupported',
): ActivityFactSource {
  return {
    async getAvailability() {
      return availability;
    },
    async requestReadPermission() {
      return availability;
    },
    async readDailyActivity() {
      return null;
    },
  };
}
