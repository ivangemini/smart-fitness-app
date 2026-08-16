import { healthKitStepBridge } from './healthkit-step-bridge.ios';
import { createNativeStepActivitySource } from './native-step-source';
import type { StepActivitySource } from './steps-contract';

export const createPlatformStepActivitySource = (): StepActivitySource =>
  createNativeStepActivitySource(healthKitStepBridge, 'healthkit');
