import { BehaviorSubject, type Subject } from "rxjs";
import { FinalizerValidity } from "../state/finalizer-validity.enum";
import { Validity } from "../state/validity.enum";
import type { Field } from "../fields/base/field.interface";
import type { FinalizerValidityTranslator } from "./finalizer-validity-translator.interface";
import type { Finalizer } from "./finalizer.interface";
import type { FinalizerState } from "../state/finalizer-state.interface";
import type { State } from "../state/state.interface";

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