import { createPlatformStepActivitySource } from './platform-step-source';
import type { StepActivitySource } from './steps-contract';

let source: StepActivitySource = createPlatformStepActivitySource();

export const getStepActivitySource = (): StepActivitySource => source;

export const setStepActivitySource = (nextSource: StepActivitySource): void => {
  source = nextSource;
};

export const resetStepActivitySource = (): void => {
  source = createPlatformStepActivitySource();
};
