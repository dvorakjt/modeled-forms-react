import { BehaviorSubject } from 'rxjs';
import { copyObject } from '../util/copy-object';
import { MessageType } from '../types/state/messages/message-type.enum';
import type { ManagedObservableFactory } from '../types/subscriptions/managed-observable-factory.interface';
import type { ManagedObservable } from '../types/subscriptions/managed-observable.interface';
import type { ManagedSubject } from '../types/subscriptions/managed-subject.interface';
import type { ManagedSubscription } from '../types/subscriptions/managed-subscription.interface';
import type { Field } from '../types/fields/field.interface';
import type { FieldState } from '../types/state/field-state.interface';
import type { SingleInputValidatorSuite } from '../types/validators/single-input/single-input-validator-suite.interface';
import type { ValidatorSuiteResult } from '../types/validators/validator-suite-result.interface';
import type { Message } from '../types/state/messages/message.interface';

export class FieldImpl implements Field {
  readonly stateChanges: ManagedSubject<FieldState>;
  readonly #validatorSuite: SingleInputValidatorSuite<string>;
  readonly #managedObservableFactory: ManagedObservableFactory;
  readonly #defaultValue: string;
  readonly #omitByDefault;
  #state: FieldState;
  #validatorSuiteSubscription?: ManagedSubscription;

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
    managedObservableFactory: ManagedObservableFactory,
    omitByDefault: boolean,
  ) {
    this.#validatorSuite = validatorSuite;
    this.#defaultValue = defaultValue;
    this.#omitByDefault = omitByDefault;
    this.#managedObservableFactory = managedObservableFactory;
    const initialState = this.#validatorSuite.evaluate(this.#defaultValue);
    this.#state = {
      ...initialState.syncResult,
      omit: this.#omitByDefault,
    };
    this.stateChanges = this.#managedObservableFactory.createManagedSubject(
      new BehaviorSubject(this.state),
    );
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
    observable: ManagedObservable<ValidatorSuiteResult<string>>,
  ) {
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
