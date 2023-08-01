import { ReplaySubject, from } from "rxjs";
import { AggregatedStateChanges } from "../../types/aggregators/aggregated-state-changes.interface";
import { MultiFieldAggregator } from "../../types/aggregators/multi-field-aggregator.interface";
import { FormElementMap } from "../../types/form-elements/form-element-map.type";
import { ManagedObservableFactory } from "../../types/subscriptions/managed-observable-factory.interface";
import { ManagedSubject } from "../../types/subscriptions/managed-subject.interface";
import { OneTimeValueEmitter } from "../../types/subscriptions/one-time-value-emitter.interface";
import { MultiInputValidator } from "../../types/validators/multi-input/multi-input-validator.interface";
import { AsyncValidator } from "../../types/validators/async-validator.type";
import { Validity } from "../../types/state/validity.enum";
import { Message } from "../../types/state/messages/message.interface";
import { MessageType } from "../../types/state/messages/message-type.enum";
import { GlobalMessages } from "../../constants/global-messages.enum";
import { ManagedSubscription } from "../../types/subscriptions/managed-subscription.interface";
import { logErrorInDevMode } from "../../util/log-error-in-dev-mode";

export class AsyncMultiInputValidator<Fields extends FormElementMap> implements MultiInputValidator {
  //messages, calculatedValidity, and overallValidityChanges all go to different destinations
  readonly calculatedValidityChanges: ManagedSubject<Validity>; 
  readonly overallValidityChanges: ManagedSubject<Validity>;
  readonly messageChanges : ManagedSubject<Message | null>;
  readonly accessedFields : OneTimeValueEmitter<Set<string>>;
  readonly #pendingMessage : string;
  readonly #multiFieldAggregator : MultiFieldAggregator<Fields>;
  readonly #validator : AsyncValidator<AggregatedStateChanges<Fields>>;
  readonly #managedObservableFactory : ManagedObservableFactory;
  #validatorSubscription? : ManagedSubscription;

  constructor(
    managedObservableFactory : ManagedObservableFactory,
    multiFieldAggregator : MultiFieldAggregator<Fields>, 
    validator : AsyncValidator<AggregatedStateChanges<Fields>>,
    pendingMessage : string
  ) {
    this.#validator = validator;
    this.#multiFieldAggregator = multiFieldAggregator;
    this.#managedObservableFactory = managedObservableFactory;
    this.#pendingMessage = pendingMessage;
    this.accessedFields = multiFieldAggregator.accessedFields;
    this.calculatedValidityChanges = this.#managedObservableFactory.createManagedSubject(new ReplaySubject<Validity>(1));
    this.overallValidityChanges = this.#managedObservableFactory.createManagedSubject(new ReplaySubject<Validity>(1));
    this.messageChanges = this.#managedObservableFactory.createManagedSubject(new ReplaySubject<Message | null>(1));
    this.#multiFieldAggregator.aggregateChanges.subscribe((aggregateChange : AggregatedStateChanges<Fields>) => {
      //unsubscribe from currently running validator
      this.#validatorSubscription && this.#validatorSubscription.unsubscribe();
      //if there are omitted fields, this validator is effectively not checked
      if(aggregateChange.hasOmittedFields) {
        this.calculatedValidityChanges.next(Validity.VALID_FINALIZABLE);
        this.overallValidityChanges.next(Validity.VALID_FINALIZABLE);
        this.messageChanges.next(null);
      } else if(aggregateChange.overallValidity < Validity.VALID_FINALIZABLE) {
        //if there are no omitted fields, but the overall validity is less than valid,
        //calculatedValidity becomes effectively valid, meaning that for fields exposed to the end user, they will see
        //the validity of each individual field if that is less than Validity.VALID_FINALIZABLE
        this.calculatedValidityChanges.next(Validity.VALID_FINALIZABLE);
        //overallValidity, however, emits the overall validity, meaning that finalizers won't run until overallValidity === Validity.VALID_FINALIZABLE
        this.overallValidityChanges.next(aggregateChange.overallValidity);
        this.messageChanges.next(null);
      } else {
        this.calculatedValidityChanges.next(Validity.PENDING);
        this.overallValidityChanges.next(Validity.PENDING);
        this.messageChanges.next({
          type : MessageType.PENDING,
          text: this.#pendingMessage
        });
        try {
          const promise = this.#validator(aggregateChange);
          this.#validatorSubscription = this.#managedObservableFactory.createManagedObservable(from(promise)).subscribe({
            next: (result) => {
              const validity = result.isValid ? Validity.VALID_FINALIZABLE : Validity.INVALID;
              this.calculatedValidityChanges.next(validity);
              this.overallValidityChanges.next(validity);
              if(result.message) {
                const message = {
                type : result.isValid ? MessageType.VALID : MessageType.INVALID,
                text : result.message
              }
              this.messageChanges.next(message);
              } else this.messageChanges.next(null);
            },
            error: (e) => {
              logErrorInDevMode(e);
              this.calculatedValidityChanges.next(Validity.ERROR);
              this.overallValidityChanges.next(Validity.ERROR);
              this.messageChanges.next({
                type: MessageType.ERROR,
                text: GlobalMessages.MULTI_INPUT_VALIDATION_ERROR
              });
            }
          });
        } catch (e) {
          logErrorInDevMode(e);
          this.calculatedValidityChanges.next(Validity.ERROR);
          this.overallValidityChanges.next(Validity.ERROR);
          this.messageChanges.next({
            type: MessageType.ERROR,
            text: GlobalMessages.MULTI_INPUT_VALIDATION_ERROR
          });
        }
      }
    });
  }
}