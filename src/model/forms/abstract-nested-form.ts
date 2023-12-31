import { Subject } from 'rxjs';
import type { OmittableFormElement } from '../form-elements/omittable-form-element.interface';
import { State } from '../state/state.interface';
import { BaseForm } from './base-form.interface';
import { FormElementDictionary } from '../form-elements/form-element-dictionary.type';
import { ExtractedValueDictionary } from '../extracted-values/extracted-value-dictionary.type';
import { TryConfirmArgsObject } from '../confirmation/confirmation-manager.interface';

export abstract class AbstractNestedForm
  implements BaseForm, OmittableFormElement
{
  abstract userFacingFields: FormElementDictionary;
  abstract extractedValues: ExtractedValueDictionary;
  abstract omit: boolean;
  abstract stateChanges: Subject<State<any>>;
  abstract firstNonValidFormElement: string | undefined;
  abstract firstNonValidFormElementChanges: Subject<string | undefined>;
  abstract state: State<any>;
  abstract confirmationAttempted: boolean;
  abstract confirmationAttemptedChanges: Subject<boolean>;
  abstract tryConfirm(argsObject: TryConfirmArgsObject): void;
  abstract reset(): void;
}
