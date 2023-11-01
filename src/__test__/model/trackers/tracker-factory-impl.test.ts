import { describe, test, expect } from 'vitest';
import { TrackerFactoryImpl } from '../../../model/trackers/tracker-factory-impl';
import { container } from '../../../model/container';
import { FirstNonValidFormElementTrackerImpl } from '../../../model/trackers/first-nonvalid-form-element-tracker-impl';

describe('TrackerFactoryImpl', () => {
    test('It returns an instance of FirstNonValidFormElementTracker when createFirstNonValidFormElementTracker() is called.', () => {
        const trackerFactory = new TrackerFactoryImpl(
            container.services.InsertionOrderHeapFactory
        );
        const firstNonValidFormElementTracker = trackerFactory.createFirstNonValidFormElementTracker();
        expect(firstNonValidFormElementTracker).toBeInstanceOf(FirstNonValidFormElementTrackerImpl);
    });
});