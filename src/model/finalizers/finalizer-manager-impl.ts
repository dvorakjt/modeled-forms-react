import { BehaviorSubject, type Subject } from 'rxjs';
import { FinalizerDictionary } from './finalizer-map.type';
import { FinalizerValidityTranslator } from './finalizer-validity-translator.interface';
import { FormValue } from '../forms/form-value.type';
import { FinalizerValidityReducer } from '../reducers/finalizer-validity/finalizer-validity-reducer.interface';
import { State } from '../state/state.interface';
import { copyObject } from '../util/copy-object';
import { Message } from '../state/messages/message.interface';
import { FinalizerValidity } from '../state/finalizer-validity.enum';
import { MessageType } from '../state/messages/message-type.enum';
import { FinalizerManager } from './finalizer-manager.interface';
import { ModificationReducer } from '../reducers/modification/modification-reducer.interface';
import { VisitationReducer } from '../reducers/visitation/visitation-reducer.interface';
import { Config } from '../config-loader/config.interface';
import { FocusReducer } from '../reducers/focus/focus-reducer.interface';

export class FinalizerManagerImpl implements FinalizerManager {
  stateChanges: Subject<State<any>>;
  _value: FormValue = {};
  _finalizerMap: FinalizerDictionary;
  _finalizerValidityReducer: FinalizerValidityReducer;
  _finalizerValidityTranslator: FinalizerValidityTranslator;
  _visitationReducer: VisitationReducer;
  _modificationReducer: ModificationReducer;
  _focusReducer : FocusReducer;
  _config : Config

  get state() {
    return {
      value: copyObject(this._value),
      validity: this._getValidity(),
      messages: this._getMessages(),
      visited: this._visitationReducer.visited,
      modified: this._modificationReducer.modified,
      focused: this._focusReducer.focused
    };
  }

  constructor(
    finalizerMap: FinalizerDictionary,
    finalizerValidityReducer: FinalizerValidityReducer,
    finalizerValidityTranslator: FinalizerValidityTranslator,
    visitationReducer: VisitationReducer,
    modificationReducer: ModificationReducer,
    focusReducer : FocusReducer,
    config: Config
  ) {
    this._finalizerMap = finalizerMap;
    this._finalizerValidityReducer = finalizerValidityReducer;
    this._finalizerValidityTranslator = finalizerValidityTranslator;
    this._visitationReducer = visitationReducer;
    this._modificationReducer = modificationReducer;
    this._focusReducer = focusReducer;
    this._config = config;

    for (const finalizerName in this._finalizerMap) {
      const finalizer = this._finalizerMap[finalizerName];
      finalizer.stream.subscribe(finalizerStateChange => {
        this._finalizerValidityReducer.updateTallies(
          finalizerName,
          finalizerStateChange.finalizerValidity,
        );
        this._visitationReducer.updateTallies(
          finalizerName,
          finalizerStateChange.visited,
        );
        this._modificationReducer.updateTallies(
          finalizerName,
          finalizerStateChange.modified,
        );
        this._focusReducer.updateTallies(
          finalizerName,
          finalizerStateChange.focused
        );
        delete this._value[finalizerName];
        if (finalizerStateChange.value !== undefined)
          this._value[finalizerName] = finalizerStateChange.value;
        if (this.stateChanges) this.stateChanges.next(this.state);
      });
    }
    this.stateChanges = new BehaviorSubject(this.state);
  }

  _getValidity() {
    const reducedFinalizerValidity =
      this._finalizerValidityReducer.finalizerValidity;
    return this._finalizerValidityTranslator.translateFinalizerValidityToValidity(
      reducedFinalizerValidity,
    );
  }

  _getMessages() {
    const messages: Array<Message> = [];
    const reducedFinalizerValidity =
      this._finalizerValidityReducer.finalizerValidity;
    if (reducedFinalizerValidity === FinalizerValidity.FINALIZER_ERROR) {
      messages.push({
        type: MessageType.ERROR,
        text: this._config.globalMessages.finalizerError,
      });
    } else if (
      reducedFinalizerValidity === FinalizerValidity.VALID_FINALIZING
    ) {
      messages.push({
        type: MessageType.PENDING,
        text: this._config.globalMessages.finalizerPending,
      });
    }
    return messages;
  }
}
