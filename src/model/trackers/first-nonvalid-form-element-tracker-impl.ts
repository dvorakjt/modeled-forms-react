import { BehaviorSubject, Subject } from 'rxjs';
import { StatefulFormElement } from '../form-elements/stateful-form-element.interface';
import { FirstNonValidFormElementTracker } from './first-nonvalid-form-element-tracker.interface';
import { InsertionOrderHeap } from '../insertion-order-heap/insertion-order-heap.interface';
import { Validity } from '../state/validity.enum';

export class FirstNonValidFormElementTrackerImpl
  implements FirstNonValidFormElementTracker
{
  firstNonValidFormElement: Subject<string | undefined>;
  #nonValidFormElementHeap: InsertionOrderHeap;

  constructor(nonValidFormElementHeap: InsertionOrderHeap) {
    this.#nonValidFormElementHeap = nonValidFormElementHeap;
    this.firstNonValidFormElement = new BehaviorSubject(
      this.#nonValidFormElementHeap.topValue,
    );
  }

  trackFormElementValidity(
    formElementKey: string,
    formElement: StatefulFormElement<any>,
  ): void {
    //first add it as a key to the dictionary
    this.#nonValidFormElementHeap.addValue(formElementKey);
    //then subscribe to its state--remove it when valid, and add it when not valid
    formElement.stateChanges.subscribe(({ validity }) => {
      if (validity < Validity.VALID_FINALIZABLE) {
        this.#nonValidFormElementHeap.addValue(formElementKey);
      } else this.#nonValidFormElementHeap.removeValue(formElementKey);
      this.firstNonValidFormElement.next(
        this.#nonValidFormElementHeap.topValue,
      );
    });
  }
}