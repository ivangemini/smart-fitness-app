import { unavailableStepActivitySource, type StepActivitySource } from './steps-contract';

export const createPlatformStepActivitySource = (): StepActivitySource =>
  unavailableStepActivitySource('unavailable');
