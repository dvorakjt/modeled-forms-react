import { Subject } from 'rxjs';
import { StatefulFormElement } from '../form-elements/stateful-form-element.interface';

export interface FirstNonValidFormElementTracker {
  firstNonValidFormElement: string | undefined;
  firstNonValidFormElementChanges: Subject<string | undefined>;
  trackFormElementValidity(
    formElementKey: string,
    formElement: StatefulFormElement<any>,
  ): void;
}
