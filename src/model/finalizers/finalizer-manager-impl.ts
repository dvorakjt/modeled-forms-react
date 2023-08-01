import { BehaviorSubject } from "rxjs";
import { FinalizerManager } from "../types/finalizers/finalizer-manager.interface";
import { FinalizerMap } from "../types/finalizers/finalizer-map.type";
import { FinalizerValidityTranslator } from "../types/finalizers/finalizer-validity-to-validity-translator.interface";
import { FormValue } from "../types/forms/form-value.type";
import { FinalizerValidityReducer } from "../types/reducers/finalizer-validity-reducer.interface";
import { State } from "../types/state/state.interface";
import { ManagedObservableFactory } from "../types/subscriptions/managed-observable-factory.interface";
import { ManagedSubject } from "../types/subscriptions/managed-subject.interface";
import { copyObject } from "../util/copy-object";
import { Message } from "../types/state/messages/message.interface";
import { FinalizerValidity } from "../types/state/finalizer-validity.enum";
import { MessageType } from "../types/state/messages/message-type.enum";
import { GlobalMessages } from "../constants/global-messages.enum";

export class FinalizerManagerImpl implements FinalizerManager {
  stateChanges: ManagedSubject<State<any>>;
  #value : FormValue = {};
  #finalizerMap : FinalizerMap;
  #finalizerValidityReducer : FinalizerValidityReducer;
  #finalizerValidityTranslator : FinalizerValidityTranslator;

  get state() {
    return {
      value : copyObject(this.#value),
      validity : this.getValidity(),
      messages : this.getMessages()
    }
  }

  constructor(
    finalizerMap : FinalizerMap, 
    finalizerValidityReducer : FinalizerValidityReducer, 
    finalizerValidityTranslator : FinalizerValidityTranslator,
    managedObservableFactory : ManagedObservableFactory
  ) {
    this.#finalizerMap = finalizerMap;
    this.#finalizerValidityReducer = finalizerValidityReducer;
    this.#finalizerValidityTranslator = finalizerValidityTranslator;
    for(const finalizerName in this.#finalizerMap) {
      const finalizer = this.#finalizerMap[finalizerName];
      finalizer.stream.subscribe(finalizerStateChange => {
        this.#finalizerValidityReducer.updateTallies(finalizerName, finalizerStateChange.finalizerValidity);
        delete this.#value[finalizerName];
        if(finalizerStateChange.value) this.#value[finalizerName] = finalizerStateChange.value;
        if(this.stateChanges) this.stateChanges.next(this.state); 
      });
    }
    this.stateChanges = managedObservableFactory.createManagedSubject(new BehaviorSubject(this.state));
  }

  private getValidity() {
    const reducedFinalizerValidity = this.#finalizerValidityReducer.finalizerValidity;
    return this.#finalizerValidityTranslator.translateFinalizerValidityToValidity(reducedFinalizerValidity);
  }

  private getMessages() {
    const messages : Array<Message> = [];
    const reducedFinalizerValidity = this.#finalizerValidityReducer.finalizerValidity;
    if(reducedFinalizerValidity === FinalizerValidity.FINALIZER_ERROR) {
      messages.push({
        type: MessageType.ERROR,
        text : GlobalMessages.FINALIZER_ERROR
      });
    } else if(reducedFinalizerValidity === FinalizerValidity.VALID_FINALIZING) {
      messages.push({
        type : MessageType.PENDING,
        text : GlobalMessages.FINALIZER_PENDING
      });
    }
    return messages;
  } 
}