import type { OmittableFormElement } from '../../form-elements/omittable-form-element.interface';
import type { DualFieldSetStateArg } from '../../state/dual-field-set-state-arg.interface';
import type { ResettableFormElement } from '../../form-elements/resettable-form-element.interface';
import type { FieldState } from '../../state/field-state.interface';
import type { DualFieldSetValueArg } from '../../state/dual-field-set-value-arg.interface';
import { Subject } from 'rxjs';
import { StatefulFormElement } from '../../form-elements/stateful-form-element.interface';
import { InteractableFormElement } from '../../form-elements/interactable-form-element.interface';
import { Interactions } from '../../state/interactions.interface';

export abstract class AbstractField implements
    StatefulFormElement<string>,
    OmittableFormElement,
    ResettableFormElement,
    InteractableFormElement
{
  abstract state: FieldState;
  abstract stateChanges: Subject<FieldState>;
  abstract omit: boolean;
  abstract interactions: Interactions;
  abstract interactionsChanges: Subject<Interactions>;
  abstract setState(state: FieldState | DualFieldSetStateArg): void;
  abstract setValue(value: string | DualFieldSetValueArg): void;
  abstract reset(): void;
}
