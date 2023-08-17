import { BehaviorSubject, type Subject } from 'rxjs';
import { FinalizerMap } from './finalizer-map.type';
import { FinalizerValidityTranslator } from './finalizer-validity-translator.interface';
import { FormValue } from '../forms/form-value.type';
import { FinalizerValidityReducer } from '../reducers/finalizer-validity/finalizer-validity-reducer.interface';
import { State } from '../state/state.interface';
import { copyObject } from '../util/copy-object';
import { Message } from '../state/messages/message.interface';
import { FinalizerValidity } from '../state/finalizer-validity.enum';
import { MessageType } from '../state/messages/message-type.enum';
import { GlobalMessages } from '../constants/global-messages.enum';
import { FinalizerManager } from './finalizer-manager.interface';

//need a factory
export class FinalizerManagerImpl implements FinalizerManager {
  stateChanges: Subject<State<any>>;
  #value: FormValue = {};
  #finalizerMap: FinalizerMap;
  #finalizerValidityReducer: FinalizerValidityReducer;
  #finalizerValidityTranslator: FinalizerValidityTranslator;

  get state() {
    return {
      value: copyObject(this.#value),
      validity: this.getValidity(),
      messages: this.getMessages(),
    };
  }

  constructor(
    finalizerMap: FinalizerMap,
    finalizerValidityReducer: FinalizerValidityReducer,
    finalizerValidityTranslator: FinalizerValidityTranslator,
  ) {
    this.#finalizerMap = finalizerMap;
    this.#finalizerValidityReducer = finalizerValidityReducer;
    this.#finalizerValidityTranslator = finalizerValidityTranslator;
    for (const finalizerName in this.#finalizerMap) {
      const finalizer = this.#finalizerMap[finalizerName];
      finalizer.stream.subscribe(finalizerStateChange => {
        this.#finalizerValidityReducer.updateTallies(
          finalizerName,
          finalizerStateChange.finalizerValidity,
        );
        delete this.#value[finalizerName];
        if (finalizerStateChange.value)
          this.#value[finalizerName] = finalizerStateChange.value;
        if (this.stateChanges) this.stateChanges.next(this.state);
      });
    }
    this.stateChanges = new BehaviorSubject(this.state);
  }

  private getValidity() {
    const reducedFinalizerValidity =
      this.#finalizerValidityReducer.finalizerValidity;
    return this.#finalizerValidityTranslator.translateFinalizerValidityToValidity(
      reducedFinalizerValidity,
    );
  }

  private getMessages() {
    const messages: Array<Message> = [];
    const reducedFinalizerValidity =
      this.#finalizerValidityReducer.finalizerValidity;
    if (reducedFinalizerValidity === FinalizerValidity.FINALIZER_ERROR) {
      messages.push({
        type: MessageType.ERROR,
        text: GlobalMessages.FINALIZER_ERROR,
      });
    } else if (
      reducedFinalizerValidity === FinalizerValidity.VALID_FINALIZING
    ) {
      messages.push({
        type: MessageType.PENDING,
        text: GlobalMessages.FINALIZER_PENDING,
      });
    }
    return messages;
  }
}
