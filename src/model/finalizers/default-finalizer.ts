import { BehaviorSubject } from "rxjs";
import { Field } from "../types/fields/field.interface";
import { FinalizerValidityTranslator } from "../types/finalizers/finalizer-validity-to-validity-translator.interface";
import { Finalizer } from "../types/finalizers/finalizer.interface";
import { FinalizerState } from "../types/state/finalizer-state.interface";
import { FinalizerValidity } from "../types/state/finalizer-validity.enum";
import { State } from "../types/state/state.interface";
import { Validity } from "../types/state/validity.enum";
import { ManagedObservableFactory } from "../types/subscriptions/managed-observable-factory.interface";
import { ManagedSubject } from "../types/subscriptions/managed-subject.interface";

export class DefaultFinalizer implements Finalizer {
  stream: ManagedSubject<FinalizerState>;
  #field : Field;
  #finalizerValidityTranslator : FinalizerValidityTranslator;
  
  constructor(field : Field, finalizerValidityTranslator : FinalizerValidityTranslator, managedObservableFactory : ManagedObservableFactory) {
    this.#field = field;
    this.#finalizerValidityTranslator = finalizerValidityTranslator;
    this.#field.stateChanges.subscribe((stateChange) => {
      this.stream?.next(this.getFinalizerState(stateChange));
    });
    this.stream = managedObservableFactory.createManagedSubject(new BehaviorSubject(this.getFinalizerState(this.#field.state)));
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