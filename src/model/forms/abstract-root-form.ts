import type { Subject } from 'rxjs';
import { State } from '../state/state.interface';
import { BaseForm } from './base-form.interface';
import { FormElementDictionary } from '../form-elements/form-element-dictionary.type';
import { ExtractedValueDictionary } from '../extracted-values/extracted-value-dictionary.type';
import { TryConfirmArgsObject } from '../confirmation/confirmation-manager.interface';
import { TrySubmitArgsObject } from '../submission/submission-manager.interface';

export abstract class AbstractRootForm implements BaseForm {
  abstract userFacingFields: FormElementDictionary;
  abstract extractedValues: ExtractedValueDictionary;
  abstract stateChanges: Subject<State<any>>;
  abstract firstNonValidFormElementChanges: Subject<string | undefined>;
  abstract firstNonValidFormElement: string | undefined;
  abstract state: State<any>;
  abstract confirmationAttempted: boolean;
  abstract confirmationAttemptedChanges: Subject<boolean>;
  abstract tryConfirm(argsObject: TryConfirmArgsObject): void;
  abstract trySubmit(argsObject: TrySubmitArgsObject): void;
  abstract reset(): void;
}
