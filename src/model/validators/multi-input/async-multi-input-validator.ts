import { ReplaySubject, Subject, Subscription, from } from 'rxjs';
import { AggregatedStateChanges } from '../../aggregators/aggregated-state-changes.interface';
import { MultiFieldAggregator } from '../../aggregators/multi-field-aggregator.interface';
import { OneTimeValueEmitter } from '../../emitters/one-time-value-emitter.interface';
import { MultiInputValidator } from './multi-input-validator.interface';
import { AsyncValidator } from '../async-validator.type';
import { Validity } from '../../state/validity.enum';
import { Message } from '../../state/messages/message.interface';
import { MessageType } from '../../state/messages/message-type.enum';
import { GlobalMessages } from '../../constants/global-messages.enum';
import { logErrorInDevMode } from '../../util/log-error-in-dev-mode';

export class AsyncMultiInputValidator implements MultiInputValidator {
  //messages, calculatedValidity, and overallValidityChanges all go to different destinations
  readonly calculatedValidityChanges: Subject<Validity>;
  readonly overallValidityChanges: Subject<Validity>;
  readonly messageChanges: Subject<Message | null>;
  readonly accessedFields: OneTimeValueEmitter<Set<string>>;
  readonly #pendingMessage: string;
  readonly #multiFieldAggregator: MultiFieldAggregator;
  readonly #validator: AsyncValidator<AggregatedStateChanges>;
  #validatorSubscription?: Subscription;
  #firstRunCompleted = false;

  constructor(
    multiFieldAggregator: MultiFieldAggregator,
    validator: AsyncValidator<AggregatedStateChanges>,
    pendingMessage: string,
  ) {
    this.#validator = validator;
    this.#multiFieldAggregator = multiFieldAggregator;
    this.#pendingMessage = pendingMessage;
    this.accessedFields = multiFieldAggregator.accessedFields;
    this.calculatedValidityChanges = new ReplaySubject<Validity>(1);
    this.overallValidityChanges = new ReplaySubject<Validity>(1);
    this.messageChanges = new ReplaySubject<Message | null>(1);
    this.#multiFieldAggregator.aggregateChanges.subscribe(
      (aggregateChange: AggregatedStateChanges) => {
        //unsubscribe from currently running validator
        this.#validatorSubscription &&
          this.#validatorSubscription.unsubscribe();
        let observableResult;
        let error;

        if(!this.#firstRunCompleted) {
          try {
            observableResult = from(this.#validator(aggregateChange));
            this.#firstRunCompleted = true;
          } catch (e) {
            logErrorInDevMode(e);
            error = e;
          }
        }

        //if there are omitted fields, this validator is effectively not checked
        if (aggregateChange.hasOmittedFields) {
          this.calculatedValidityChanges.next(Validity.VALID_FINALIZABLE);
          this.overallValidityChanges.next(Validity.VALID_FINALIZABLE);
          this.messageChanges.next(null);
        } else if (
          aggregateChange.overallValidity < Validity.VALID_FINALIZABLE
        ) {
          //if there are no omitted fields, but the overall validity is less than valid,
          //calculatedValidity becomes effectively valid, meaning that for fields exposed to the end user, they will see
          //the validity of each individual field if that is less than Validity.VALID_FINALIZABLE
          this.calculatedValidityChanges.next(Validity.VALID_FINALIZABLE);
          //overallValidity, however, emits the overall validity, meaning that finalizers won't run until overallValidity === Validity.VALID_FINALIZABLE
          this.overallValidityChanges.next(aggregateChange.overallValidity);
          this.messageChanges.next(null);
        } else if(error) {
          this.calculatedValidityChanges.next(Validity.ERROR);
            this.overallValidityChanges.next(Validity.ERROR);
            this.messageChanges.next({
              type: MessageType.ERROR,
              text: GlobalMessages.MULTI_INPUT_VALIDATION_ERROR,
            });
        } else {
          this.calculatedValidityChanges.next(Validity.PENDING);
          this.overallValidityChanges.next(Validity.PENDING);
          this.messageChanges.next({
            type: MessageType.PENDING,
            text: this.#pendingMessage,
          });
          try {
            if(!observableResult) observableResult = from(this.#validator(aggregateChange));
            this.#validatorSubscription = observableResult.subscribe({
              next: result => {
                const validity = result.isValid
                  ? Validity.VALID_FINALIZABLE
                  : Validity.INVALID;
                this.calculatedValidityChanges.next(validity);
                this.overallValidityChanges.next(validity);
                if (result.message) {
                  const message = {
                    type: result.isValid
                      ? MessageType.VALID
                      : MessageType.INVALID,
                    text: result.message,
                  };
                  this.messageChanges.next(message);
                } else this.messageChanges.next(null);
              },
              error: e => {
                logErrorInDevMode(e);
                this.calculatedValidityChanges.next(Validity.ERROR);
                this.overallValidityChanges.next(Validity.ERROR);
                this.messageChanges.next({
                  type: MessageType.ERROR,
                  text: GlobalMessages.MULTI_INPUT_VALIDATION_ERROR,
                });
              },
            });
          } catch (e) {
            logErrorInDevMode(e);
            this.calculatedValidityChanges.next(Validity.ERROR);
            this.overallValidityChanges.next(Validity.ERROR);
            this.messageChanges.next({
              type: MessageType.ERROR,
              text: GlobalMessages.MULTI_INPUT_VALIDATION_ERROR,
            });
          }
        }
      },
    );
  }
}
