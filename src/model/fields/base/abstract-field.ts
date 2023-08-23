import type { OmittableFormElement } from '../../form-elements/omittable-form-element.interface';
import type { StatefulFormElement } from '../../form-elements/stateful-form-element.interface';
import type { DualFieldSetStateArg } from '../../state/dual-field-set-state-arg.interface';
import type { ResettableFormElement } from '../../form-elements/resettable-form-element.interface';
import type { FieldState } from '../../state/field-state.interface';
import type { DualFieldSetValueArg } from '../../state/dual-field-set-value-arg.interface';
import { Subject } from 'rxjs';
import { State } from '../../state/state.interface';

export abstract class AbstractField
  implements
    StatefulFormElement<string>,
    OmittableFormElement,
    ResettableFormElement
{
  abstract state: FieldState;
  abstract stateChanges: Subject<State<string>>;
  abstract omit: boolean;

  abstract setState(state: FieldState | DualFieldSetStateArg): void;
  abstract setValue(value: string | DualFieldSetValueArg): void;
  abstract reset(): void;
}
