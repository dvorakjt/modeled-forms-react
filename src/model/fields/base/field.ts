import {
  BehaviorSubject,
  Observable,
  type Subject,
  type Subscription,
} from 'rxjs';
import { copyObject } from '../../util/copy-object';
import { MessageType } from '../../state/messages/message-type.enum';
import { AbstractField } from './abstract-field';
import type { FieldState } from '../../state/field-state.interface';
import type { SingleInputValidatorSuite } from '../../validators/single-input/single-input-validator-suite.interface';
import type { ValidatorSuiteResult } from '../../validators/validator-suite-result.interface';
import type { Message } from '../../state/messages/message.interface';
import { Interactions } from '../../state/interactions.interface';

export class Field extends AbstractField {
  readonly stateChanges: Subject<FieldState>;
  readonly _validatorSuite: SingleInputValidatorSuite<string>;
  readonly _defaultValue: string;
  readonly _omitByDefault;
  readonly interactionsChanges: Subject<Interactions>;
  _state: FieldState;
  _validatorSuiteSubscription?: Subscription;
  _interactions : Interactions;
  
  get state() {
    return copyObject(this._state);
  }

  set omit(omit: boolean) {
    this.setState({
      ...this.state,
      omit,
    });
  }

  get omit() {
    return this.state.omit as boolean;
  }

  get interactions() {
    return copyObject(this._interactions);
  }

  set interactions(interactions : Interactions) {
    this._interactions = interactions;
    if(this.interactionsChanges) this.interactionsChanges.next(this.interactions);
  }

  constructor(
    validatorSuite: SingleInputValidatorSuite<string>,
    defaultValue: string,
    omitByDefault: boolean,
  ) {
    super();
    this._validatorSuite = validatorSuite;
    this._defaultValue = defaultValue;
    this._omitByDefault = omitByDefault;
    const initialState = this._validatorSuite.evaluate(this._defaultValue);
    this._state = {
      ...initialState.syncResult,
      omit: this._omitByDefault,
    };
    this.stateChanges = new BehaviorSubject(this.state);
    if (initialState.observable)
      this._handleValidityObservable(initialState.observable);
    this._interactions = {
      visited : false,
      modified : this._defaultValue.length > 0
    }
    this.interactionsChanges = new BehaviorSubject(this.interactions);
  }

  setValue(value: string) {
    if (this._validatorSuiteSubscription)
      this._validatorSuiteSubscription.unsubscribe();
    const validityResult = this._validatorSuite.evaluate(value);
    this.setState({
      ...validityResult.syncResult,
      omit: this.state.omit,
    });
    if (validityResult.observable)
      this._handleValidityObservable(validityResult.observable);
  }

  setState(state: FieldState) {
    this._state = copyObject(state);
    this.stateChanges.next(this.state);
    this.interactions = {
      ...this.interactions,
      modified : true
    }
  }

  reset() {
    this._state.omit = this._omitByDefault;
    this.setValue(this._defaultValue);
    this.interactions = {
      visited : false,
      modified : this._defaultValue.length > 0
    }
  }

  _handleValidityObservable(
    observable: Observable<ValidatorSuiteResult<string>>,
  ) {
    this._validatorSuiteSubscription?.unsubscribe();
    this._validatorSuiteSubscription = observable.subscribe(result => {
      this.setState({
        ...result,
        messages: [
          ...this.state.messages.filter(
            (message: Message) => message.type !== MessageType.PENDING,
          ),
          ...result.messages,
        ],
        omit: this.state.omit,
      });
    });
  }
}
