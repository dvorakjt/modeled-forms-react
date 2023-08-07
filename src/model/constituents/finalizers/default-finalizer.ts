import { BehaviorSubject, type Subject } from "rxjs";
import { FinalizerValidity } from "../../types/constituents/state/finalizer-validity.enum";
import { Validity } from "../../types/constituents/state/validity.enum";
import type { Field } from "../../types/constituents/fields/field.interface";
import type { FinalizerValidityTranslator } from "../../types/constituents/finalizers/finalizer-validity-to-validity-translator.interface";
import type { Finalizer } from "../../types/constituents/finalizers/finalizer.interface";
import type { FinalizerState } from "../../types/constituents/state/finalizer-state.interface";
import type { State } from "../../types/constituents/state/state.interface";

export class DefaultFinalizer implements Finalizer {
  stream: Subject<FinalizerState>;
  #field : Field;
  #finalizerValidityTranslator : FinalizerValidityTranslator;
  
  constructor(field : Field, finalizerValidityTranslator : FinalizerValidityTranslator) {
    this.#field = field;
    this.#finalizerValidityTranslator = finalizerValidityTranslator;
    this.#field.stateChanges.subscribe((stateChange) => {
      this.stream?.next(this.getFinalizerState(stateChange));
    });
    this.stream = new BehaviorSubject(this.getFinalizerState(this.#field.state));
  }

  private getFinalizerState(fieldState : State<any>) {
    if(fieldState.validity < Validity.VALID_FINALIZABLE) return {
      finalizerValidity : this.#finalizerValidityTranslator.translateValidityToFinalizerValidity(fieldState.validity)
    }

    return {
      finalizerValidity : FinalizerValidity.VALID_FINALIZED,
      value : fieldState.value
    }
  }
}