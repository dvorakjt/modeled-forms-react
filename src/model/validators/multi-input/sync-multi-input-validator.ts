import { ReplaySubject } from "rxjs";
import { AggregatedStateChanges } from "../../types/aggregators/aggregated-state-changes.interface";
import { MultiFieldAggregator } from "../../types/aggregators/multi-field-aggregator.interface";
import { FormElementMap } from "../../types/form-elements/form-element-map.type";
import { ManagedObservableFactory } from "../../types/subscriptions/managed-observable-factory.interface";
import { ManagedSubject } from "../../types/subscriptions/managed-subject.interface";
import { OneTimeValueEmitter } from "../../types/subscriptions/one-time-value-emitter.interface";
import { MultiInputValidator } from "../../types/validators/multi-input/multi-input-validator.interface";
import { SyncValidator } from "../../types/validators/sync-validator.type";
import { Validity } from "../../types/state/validity.enum";
import { Message } from "../../types/state/messages/message.interface";
import { MessageType } from "../../types/state/messages/message-type.enum";
import { ErrorMessages } from "../../constants/error-messages.enum";

export class SyncMultiInputValidator<Fields extends FormElementMap> implements MultiInputValidator {
  //messages, calculatedValidity, and overallValidityChanges all go to different destinations
  calculatedValidityChanges: ManagedSubject<Validity>; 
  overallValidityChanges: ManagedSubject<Validity>;
  messageChanges : ManagedSubject<Message | null>;
  accessedFields : OneTimeValueEmitter<Set<string>>;
  #multiFieldAggregator : MultiFieldAggregator<Fields>;
  #validator : SyncValidator<AggregatedStateChanges<Fields>>;

  constructor(
    managedObservableFactory : ManagedObservableFactory,
    multiFieldAggregator : MultiFieldAggregator<Fields>, 
    validator : SyncValidator<AggregatedStateChanges<Fields>>
  ) {
    this.#validator = validator;
    this.#multiFieldAggregator = multiFieldAggregator;
    this.accessedFields = multiFieldAggregator.accessedFields;
    this.calculatedValidityChanges = managedObservableFactory.createManagedSubject(new ReplaySubject<Validity>());
    this.overallValidityChanges = managedObservableFactory.createManagedSubject(new ReplaySubject<Validity>());
    this.messageChanges = managedObservableFactory.createManagedSubject(new ReplaySubject<Message | null>());
    this.#multiFieldAggregator.aggregateChanges.subscribe((aggregateChange : AggregatedStateChanges<Fields>) => {
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
        //otherwise, run the validator, and return the result
        try {
          const result = this.#validator(aggregateChange);
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
        } catch (e) {
          process.env.NODE_ENV === 'development' && console.error(e);
          this.calculatedValidityChanges.next(Validity.ERROR);
          this.overallValidityChanges.next(Validity.ERROR);
          this.messageChanges.next({
            type: MessageType.ERROR,
            text: ErrorMessages.MULTI_INPUT_VALIDATION_ERROR
          });
        }
      }
    });
  }
}