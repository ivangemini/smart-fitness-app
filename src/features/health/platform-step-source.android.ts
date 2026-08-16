import { healthConnectStepBridge } from './health-connect-step-bridge.android';
import { createNativeStepActivitySource } from './native-step-source';
import type { StepActivitySource } from './steps-contract';

export const createPlatformStepActivitySource = (): StepActivitySource =>
  createNativeStepActivitySource(healthConnectStepBridge, 'health_connect');
