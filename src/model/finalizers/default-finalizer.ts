import { BehaviorSubject, type Subject } from 'rxjs';
import { FinalizerValidity } from '../state/finalizer-validity.enum';
import { Validity } from '../state/validity.enum';
import { StatefulFormElement } from '../form-elements/stateful-form-element.interface';
import type { FinalizerValidityTranslator } from './finalizer-validity-translator.interface';
import type { Finalizer } from './finalizer.interface';
import type { FinalizerState } from '../state/finalizer-state.interface';
import type { State } from '../state/state.interface';

export class DefaultFinalizer implements Finalizer {
  stream: Subject<FinalizerState>;
  _field: StatefulFormElement<any>;
  _finalizerValidityTranslator: FinalizerValidityTranslator;

  constructor(
    field: StatefulFormElement<any>,
    finalizerValidityTranslator: FinalizerValidityTranslator,
  ) {
    this._field = field;
    this._finalizerValidityTranslator = finalizerValidityTranslator;
    this._field.stateChanges.subscribe(stateChange => {
      this.stream?.next(this._getFinalizerState(stateChange));
    });
    this.stream = new BehaviorSubject(
      this._getFinalizerState(this._field.state),
    );
  }

  _getFinalizerState(fieldState: State<any>) {
    if(fieldState.omit) {
      return {
        finalizerValidity: FinalizerValidity.VALID_FINALIZED,
        visited: fieldState.visited,
        modified: fieldState.modified,
        focused : fieldState.focused
      }
    }

    if (fieldState.validity < Validity.VALID_FINALIZABLE)
      return {
        finalizerValidity:
          this._finalizerValidityTranslator.translateValidityToFinalizerValidity(
            fieldState.validity,
          ),
        visited: fieldState.visited,
        modified: fieldState.modified,
        focused : fieldState.focused
      };

    return {
      finalizerValidity: FinalizerValidity.VALID_FINALIZED,
      value: fieldState.value,
      visited: fieldState.visited,
      modified: fieldState.modified,
      focused : fieldState.focused
    };
  }
}
