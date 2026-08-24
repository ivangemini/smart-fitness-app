import type { ActivityFactSource } from './activity-contract';
import { createPlatformActivityFactSource } from './platform-activity-source';

let source: ActivityFactSource = createPlatformActivityFactSource();

export const getActivityFactSource = (): ActivityFactSource => source;

export const setActivityFactSource = (nextSource: ActivityFactSource): void => {
  source = nextSource;
};

export const resetActivityFactSource = (): void => {
  source = createPlatformActivityFactSource();
};
