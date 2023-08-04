import type { ResettableFormElement } from '../form-elements/resettable-form-element.interface';
import type { StatefulFormElement } from '../form-elements/stateful-form-element.interface';
import type { SubmissionState } from '../submission/submission-state.interface';
import type { Subject } from 'rxjs';

export interface RootForm extends StatefulFormElement<any>, ResettableFormElement {
  submissionState: SubmissionState;
  submissionStateChanges: Subject<SubmissionState>;
  submit: () => Promise<any>;
}
