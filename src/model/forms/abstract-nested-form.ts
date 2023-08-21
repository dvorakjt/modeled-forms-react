import { Subject } from 'rxjs';
import type { OmittableFormElement } from '../form-elements/omittable-form-element.interface';
import { State } from '../state/state.interface';
import { BaseForm } from './base-form.interface';
import { FormElementDictionary } from '../form-elements/form-element-dictionary.type';

export abstract class AbstractNestedForm implements BaseForm, OmittableFormElement {
  abstract userFacingFields : FormElementDictionary;
  abstract omit : boolean;
  abstract stateChanges: Subject<State<any>>;
  abstract firstNonValidFormElement: Subject<string | undefined>;
  abstract state: State<any>;
  abstract reset() : void;
}