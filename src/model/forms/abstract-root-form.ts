import type { SubmissionState } from '../submission/submission-state.interface';
import type { Subject } from 'rxjs';
import { State } from '../state/state.interface';
import { BaseForm } from './base-form.interface';
import { FormElementDictionary } from '../form-elements/form-element-dictionary.type';

export abstract class AbstractRootForm implements BaseForm {
  abstract userFacingFields: FormElementDictionary;
  abstract stateChanges: Subject<State<any>>;
  abstract firstNonValidFormElementChanges: Subject<string | undefined>;
  abstract firstNonValidFormElement: string | undefined;
  abstract state: State<any>;
  abstract reset(): void;
  abstract submissionState: SubmissionState;
  abstract submissionStateChanges: Subject<SubmissionState>;
  abstract submit() : Promise<any>;
}
