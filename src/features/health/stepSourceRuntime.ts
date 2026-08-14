import { unavailableStepActivitySource, type StepActivitySource } from './steps-contract';

let source: StepActivitySource = unavailableStepActivitySource('unavailable');

export const getStepActivitySource = (): StepActivitySource => source;

export const setStepActivitySource = (nextSource: StepActivitySource): void => {
  source = nextSource;
};

export const resetStepActivitySource = (): void => {
  source = unavailableStepActivitySource('unavailable');
};
