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

export class Field extends AbstractField {
  readonly stateChanges: Subject<FieldState>;
  readonly #validatorSuite: SingleInputValidatorSuite<string>;
  readonly #defaultValue: string;
  readonly #omitByDefault;
  #state: FieldState;
  #validatorSuiteSubscription?: Subscription;

  get state() {
    return copyObject(this.#state);
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

  constructor(
    validatorSuite: SingleInputValidatorSuite<string>,
    defaultValue: string,
    omitByDefault: boolean,
  ) {
    super();
    this.#validatorSuite = validatorSuite;
    this.#defaultValue = defaultValue;
    this.#omitByDefault = omitByDefault;
    const initialState = this.#validatorSuite.evaluate(this.#defaultValue);
    this.#state = {
      ...initialState.syncResult,
      omit: this.#omitByDefault,
    };
    this.stateChanges = new BehaviorSubject(this.state);
    if (initialState.observable)
      this.handleValidityObservable(initialState.observable);
  }

  setValue(value: string) {
    if (this.#validatorSuiteSubscription)
      this.#validatorSuiteSubscription.unsubscribe();
    const validityResult = this.#validatorSuite.evaluate(value);
    this.setState({
      ...validityResult.syncResult,
      omit: this.state.omit,
    });
    if (validityResult.observable)
      this.handleValidityObservable(validityResult.observable);
  }

  setState(state: FieldState) {
    this.#state = copyObject(state);
    this.stateChanges.next(this.state);
  }

  reset() {
    this.#state.omit = this.#omitByDefault;
    this.setValue(this.#defaultValue);
  }

  private handleValidityObservable(
    observable: Observable<ValidatorSuiteResult<string>>,
  ) {
    this.#validatorSuiteSubscription?.unsubscribe();
    this.#validatorSuiteSubscription = observable.subscribe(result => {
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
