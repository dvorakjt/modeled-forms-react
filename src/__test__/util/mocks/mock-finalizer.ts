import { BehaviorSubject } from "rxjs";
import { Finalizer } from "../../../model/finalizers/finalizer.interface";
import { FinalizerState } from "../../../model/state/finalizer-state.interface";
import { FinalizerValidity } from "../../../model/state/finalizer-validity.enum";
import { Visited } from "../../../model/state/visited.enum";
import { Modified } from "../../../model/state/modified-enum";

export class MockFinalizer implements Finalizer {
  static createUnvisitedUnmodifiedInvalidFinalizer() {
    return new MockFinalizer({
      value : undefined,
      finalizerValidity : FinalizerValidity.FIELD_INVALID,
      visited : Visited.NO,
      modified : Modified.NO
    });
  }

  stream : BehaviorSubject<FinalizerState>;

  constructor(initialValue : FinalizerState) {
    this.stream = new BehaviorSubject<FinalizerState>(initialValue);
  }

  next(nextValue : FinalizerState) {
    this.stream.next(nextValue);
  }
}