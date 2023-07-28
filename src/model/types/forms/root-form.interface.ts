import type { ManagedSubject } from '../subscriptions/managed-subject.interface';
import type { ResettableFormElement } from '../form-elements/resettable-form-element.interface';
import type { StatefulFormElement } from '../form-elements/stateful-form-element.interface';

export interface RootForm
  extends StatefulFormElement<any>,
    ResettableFormElement {
  hasSubmitted: boolean;
  submissionChanges: ManagedSubject<boolean>;
  submit: () => Promise<any>;
  unsubscribeAll: () => void;
}
