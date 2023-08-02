import type { ManagedSubject } from '../subscriptions/managed-subject.interface';
import type { State } from '../state/state.interface';
import { SubmissionState } from './submission-state.interface';
import { ResettableFormElement } from '../form-elements/resettable-form-element.interface';

export interface SubmissionManager extends ResettableFormElement {
  submissionState : SubmissionState;
  submissionStateChanges : ManagedSubject<SubmissionState>;
  clearMessage: () => void;
  submit: (state: State<any>) => Promise<any>;
}
