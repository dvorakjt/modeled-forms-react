import { BehaviorSubject, Subject } from 'rxjs';
import { StatefulFormElement } from '../form-elements/stateful-form-element.interface';
import { FirstNonValidFormElementTracker } from './first-nonvalid-form-element-tracker.interface';
import { InsertionOrderHeap } from '../insertion-order-heap/insertion-order-heap.interface';
import { Validity } from '../state/validity.enum';

export class FirstNonValidFormElementTrackerImpl
  implements FirstNonValidFormElementTracker
{
  firstNonValidFormElementChanges: Subject<string | undefined>;
  _nonValidFormElementHeap: InsertionOrderHeap;

  constructor(nonValidFormElementHeap: InsertionOrderHeap) {
    this._nonValidFormElementHeap = nonValidFormElementHeap;
    this.firstNonValidFormElementChanges = new BehaviorSubject(
      this.firstNonValidFormElement,
    );
  }

  get firstNonValidFormElement(): string | undefined {
    return this._nonValidFormElementHeap.topValue;
  }

  trackFormElementValidity(
    formElementKey: string,
    formElement: StatefulFormElement<any>,
  ): void {
    //first add it as a key to the dictionary
    this._nonValidFormElementHeap.addValue(formElementKey);
    //then subscribe to its state--remove it when valid, and add it when not valid
    formElement.stateChanges.subscribe(({ validity }) => {
      if (validity < Validity.VALID_FINALIZABLE) {
        this._nonValidFormElementHeap.addValue(formElementKey);
      } else this._nonValidFormElementHeap.removeValue(formElementKey);
      this.firstNonValidFormElementChanges.next(this.firstNonValidFormElement);
    });
  }
}
