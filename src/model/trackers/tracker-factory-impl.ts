import { TrackerFactory, TrackerFactoryKey, TrackerFactoryKeyType } from "./tracker-factory.interface";
import { type InsertionOrderHeapFactory, InsertionOrderHeapFactoryKey } from "../insertion-order-heap/insertion-order-heap-factory.interface";
import { FirstNonValidFormElementTracker } from "./first-nonvalid-form-element-tracker.interface";
import { FirstNonValidFormElementTrackerImpl } from "./first-nonvalid-form-element-tracker-impl";
import { autowire } from "undecorated-di";

export class TrackerFactoryImpl implements TrackerFactory {
  #insertionOrderHeapFactory : InsertionOrderHeapFactory;

  constructor(insertionOrderHeapFactory : InsertionOrderHeapFactory) {
    this.#insertionOrderHeapFactory = insertionOrderHeapFactory;
  }

  createFirstNonValidFormElementTracker(): FirstNonValidFormElementTracker {
    return new FirstNonValidFormElementTrackerImpl(this.#insertionOrderHeapFactory.createInsertionOrderHeap());
  }
}

export default autowire<TrackerFactoryKeyType, TrackerFactory, TrackerFactoryImpl>(
  TrackerFactoryImpl,
  TrackerFactoryKey,
  [
    InsertionOrderHeapFactoryKey
  ]
);