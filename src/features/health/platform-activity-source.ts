import {
  unavailableActivityFactSource,
  type ActivityFactSource,
} from './activity-contract';

export const createPlatformActivityFactSource = (): ActivityFactSource =>
  unavailableActivityFactSource('unsupported');
