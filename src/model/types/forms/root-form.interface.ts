import type { ManagedSubject } from '../subscriptions/managed-subject.interface';
import type { ResettableFormElement } from '../form-elements/resettable-form-element.interface';
import type { StatefulFormElement } from '../form-elements/stateful-form-element.interface';
import { SubmissionState } from '../submission/submission-state.interface';

export interface RootForm extends StatefulFormElement<any>, ResettableFormElement {
  submissionState: SubmissionState;
  submissionStateChanges: ManagedSubject<SubmissionState>;
  submit: () => Promise<any>;
  unsubscribeAll: () => void;
}
