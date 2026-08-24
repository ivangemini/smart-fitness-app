import type { ActivityFactSource } from './activity-contract';
import { healthKitActivityBridge } from './healthkit-activity-bridge.ios';
import { createNativeActivityFactSource } from './native-activity-source';

export const createPlatformActivityFactSource = (): ActivityFactSource =>
  createNativeActivityFactSource(healthKitActivityBridge, 'healthkit');
