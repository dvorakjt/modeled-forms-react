import {
  TrackerFactory,
  TrackerFactoryKey,
  TrackerFactoryKeyType,
} from './tracker-factory.interface';
import {
  type InsertionOrderHeapFactory,
  InsertionOrderHeapFactoryKey,
} from '../insertion-order-heap/insertion-order-heap-factory.interface';
import { FirstNonValidFormElementTracker } from './first-nonvalid-form-element-tracker.interface';
import { FirstNonValidFormElementTrackerImpl } from './first-nonvalid-form-element-tracker-impl';
import { autowire } from 'undecorated-di';

class TrackerFactoryImpl implements TrackerFactory {
  _insertionOrderHeapFactory: InsertionOrderHeapFactory;

  constructor(insertionOrderHeapFactory: InsertionOrderHeapFactory) {
    this._insertionOrderHeapFactory = insertionOrderHeapFactory;
  }

  createFirstNonValidFormElementTracker(): FirstNonValidFormElementTracker {
    return new FirstNonValidFormElementTrackerImpl(
      this._insertionOrderHeapFactory.createInsertionOrderHeap(),
    );
  }
}

const TrackerFactoryService = autowire<
  TrackerFactoryKeyType,
  TrackerFactory,
  TrackerFactoryImpl
>(TrackerFactoryImpl, TrackerFactoryKey, [InsertionOrderHeapFactoryKey]);

export { TrackerFactoryImpl, TrackerFactoryService };
