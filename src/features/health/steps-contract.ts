export type HealthActivityAvailability =
  | 'available'
  | 'unsupported'
  | 'permission_required'
  | 'denied'
  | 'unavailable';

export type DailyStepAggregate = {
  localDate: string;
  steps: number;
  source: 'healthkit' | 'health_connect';
  measuredAt: string;
};

export interface StepActivitySource {
  getAvailability(): Promise<HealthActivityAvailability>;
  requestReadPermission(): Promise<HealthActivityAvailability>;
  readDailySteps(localDate: string): Promise<DailyStepAggregate | null>;
}

const LOCAL_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function normalizeDailyStepAggregate(
  value: DailyStepAggregate,
): DailyStepAggregate {
  if (!LOCAL_DATE_PATTERN.test(value.localDate)) {
    throw new Error('invalid_local_date');
  }

  if (!Number.isFinite(value.steps) || value.steps < 0) {
    throw new Error('invalid_step_count');
  }

  const measuredAt = new Date(value.measuredAt);
  if (Number.isNaN(measuredAt.getTime())) {
    throw new Error('invalid_measured_at');
  }

  return {
    ...value,
    steps: Math.floor(value.steps),
    measuredAt: measuredAt.toISOString(),
  };
}

export function unavailableStepActivitySource(
  availability: Exclude<HealthActivityAvailability, 'available'> = 'unsupported',
): StepActivitySource {
  return {
    async getAvailability() {
      return availability;
    },
    async requestReadPermission() {
      return availability;
    },
    async readDailySteps() {
      return null;
    },
  };
}
