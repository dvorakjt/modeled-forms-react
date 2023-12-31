import { Subject } from 'rxjs';
import { ResettableFormElement } from '../form-elements/resettable-form-element.interface';
import { StatefulFormElement } from '../form-elements/stateful-form-element.interface';
import { FormElementDictionary } from '../form-elements/form-element-dictionary.type';
import { ExtractedValueDictionary } from '../extracted-values/extracted-value-dictionary.type';
import { TryConfirmArgsObject } from '../confirmation/confirmation-manager.interface';

export interface BaseForm
  extends StatefulFormElement<any>,
    ResettableFormElement {
  userFacingFields: FormElementDictionary;
  firstNonValidFormElement: string | undefined;
  firstNonValidFormElementChanges: Subject<string | undefined>;
  extractedValues: ExtractedValueDictionary;
  confirmationAttempted: boolean;
  confirmationAttemptedChanges: Subject<boolean>;
  tryConfirm(argsObject: TryConfirmArgsObject): void;
}
