import { FirstNonValidFormElementTracker } from './first-nonvalid-form-element-tracker.interface';

interface TrackerFactory {
  createFirstNonValidFormElementTracker(): FirstNonValidFormElementTracker;
}
const TrackerFactoryKey = 'TrackerFactory';
type TrackerFactoryKeyType = typeof TrackerFactoryKey;

export { TrackerFactoryKey, type TrackerFactory, type TrackerFactoryKeyType };
