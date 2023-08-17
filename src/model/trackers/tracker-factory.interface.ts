import { FirstNonValidFormElementTracker } from "./first-nonvalid-form-element-tracker.interface";

export interface TrackerFactory {
  createFirstNonValidFormElementTracker() : FirstNonValidFormElementTracker;
}

export const TrackerFactoryKey = 'TrackerFactory';
export type TrackerFactoryKeyType = typeof TrackerFactoryKey;