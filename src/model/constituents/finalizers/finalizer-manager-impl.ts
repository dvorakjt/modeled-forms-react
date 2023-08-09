import { BehaviorSubject, type Subject } from "rxjs";
import { FinalizerManager } from "../../types/constituents/finalizers/finalizer-manager.interface";
import { FinalizerMap } from "../../types/constituents/finalizers/finalizer-map.type";
import { FinalizerValidityTranslator } from "../../types/constituents/finalizers/finalizer-validity-to-validity-translator.interface";
import { FormValue } from "../../types/constituents/forms/form-value.type";
import { FinalizerValidityReducer } from "../../types/constituents/reducers/finalizer-validity-reducer.interface";
import { State } from "../../types/constituents/state/state.interface";
import { copyObject } from "../util/copy-object";
import { Message } from "../../types/constituents/state/messages/message.interface";
import { FinalizerValidity } from "../../types/constituents/state/finalizer-validity.enum";
import { MessageType } from "../../types/constituents/state/messages/message-type.enum";
import { GlobalMessages } from "../constants/global-messages.enum";

export class FinalizerManagerImpl implements FinalizerManager {
  stateChanges: Subject<State<any>>;
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
    finalizerValidityTranslator : FinalizerValidityTranslator
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
    this.stateChanges = new BehaviorSubject(this.state);
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