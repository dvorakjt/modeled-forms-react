import { ReplaySubject, Subject, Subscription, from } from 'rxjs';
import { AggregatedStateChanges } from '../../aggregators/aggregated-state-changes.interface';
import { MultiFieldAggregator } from '../../aggregators/multi-field-aggregator.interface';
import { OneTimeValueEmitter } from '../../emitters/one-time-value-emitter.interface';
import { MultiInputValidator } from './multi-input-validator.interface';
import { AsyncValidator } from '../async-validator.type';
import { Validity } from '../../state/validity.enum';
import { MultiInputValidatorMessage } from '../../state/messages/multi-input-validator-message.interface';
import { MessageType } from '../../state/messages/message-type.enum';
import { logErrorInDevMode } from '../../util/log-error-in-dev-mode';
import { config } from '../../../config';
import { Modified } from '../../state/modified-enum';
import { Visited } from '../../state/visited.enum';

export class AsyncMultiInputValidator implements MultiInputValidator {
  //messages, calculatedValidity, and overallValidityChanges all go to different destinations
  readonly calculatedValidityChanges: Subject<Validity>;
  readonly overallValidityChanges: Subject<Validity>;
  readonly messageChanges: Subject<MultiInputValidatorMessage | null>;
  readonly accessedFields: OneTimeValueEmitter<Set<string>>;
  readonly _pendingMessage: string;
  readonly _multiFieldAggregator: MultiFieldAggregator;
  readonly _validator: AsyncValidator<AggregatedStateChanges>;
  _validatorSubscription?: Subscription;
  _firstRunCompleted = false;

  constructor(
    multiFieldAggregator: MultiFieldAggregator,
    validator: AsyncValidator<AggregatedStateChanges>,
    pendingMessage: string,
  ) {
    this._validator = validator;
    this._multiFieldAggregator = multiFieldAggregator;
    this._pendingMessage = pendingMessage;
    this.accessedFields = multiFieldAggregator.accessedFields;
    this.calculatedValidityChanges = new ReplaySubject<Validity>(1);
    this.overallValidityChanges = new ReplaySubject<Validity>(1);
    this.messageChanges = new ReplaySubject<MultiInputValidatorMessage | null>(1);
    this._multiFieldAggregator.aggregateChanges.subscribe(
      (aggregateChange: AggregatedStateChanges) => {
        //unsubscribe from currently running validator
        this._validatorSubscription &&
          this._validatorSubscription.unsubscribe();
        let observableResult;
        let error;

        if (!this._firstRunCompleted) {
          try {
            observableResult = from(this._validator(aggregateChange));
          } catch (e) {
            logErrorInDevMode(e);
            error = e;
          } finally {
            this._firstRunCompleted = true;
          }
        }
        //if there are omitted fields, this validator is effectively not checked
        if (aggregateChange.hasOmittedFields()) {
          this.calculatedValidityChanges.next(Validity.VALID_FINALIZABLE);
          this.overallValidityChanges.next(Validity.VALID_FINALIZABLE);
          this.messageChanges.next(null);
        } else if (
          aggregateChange.overallValidity() < Validity.VALID_FINALIZABLE
        ) {
          //if there are no omitted fields, but the overall validity is less than valid,
          //calculatedValidity becomes effectively valid, meaning that for fields exposed to the end user, they will see
          //the validity of each individual field if that is less than Validity.VALID_FINALIZABLE
          this.calculatedValidityChanges.next(Validity.VALID_FINALIZABLE);
          //overallValidity, however, emits the overall validity, meaning that finalizers won't run until overallValidity === Validity.VALID_FINALIZABLE
          this.overallValidityChanges.next(aggregateChange.overallValidity());
          this.messageChanges.next(null);
        } else if (error) {
          this.calculatedValidityChanges.next(Validity.ERROR);
          this.overallValidityChanges.next(Validity.ERROR);
          this.messageChanges.next({
            type: MessageType.ERROR,
            text: config.globalMessages.multiFieldValidationError,
            hasUnvisitedOrUnmodifiedFields: this.hasUnvisitedOrUnmodifiedFields(aggregateChange)
          });
        } else {
          this.calculatedValidityChanges.next(Validity.PENDING);
          this.overallValidityChanges.next(Validity.PENDING);
          this.messageChanges.next({
            type: MessageType.PENDING, 
            text: this._pendingMessage,
            hasUnvisitedOrUnmodifiedFields: this.hasUnvisitedOrUnmodifiedFields(aggregateChange)
          });
          try {
            if (!observableResult)
              observableResult = from(this._validator(aggregateChange));
            this._validatorSubscription = observableResult.subscribe({
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
                    hasUnvisitedOrUnmodifiedFields: this.hasUnvisitedOrUnmodifiedFields(aggregateChange)
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
                  text: config.globalMessages.multiFieldValidationError,
                  hasUnvisitedOrUnmodifiedFields: this.hasUnvisitedOrUnmodifiedFields(aggregateChange)
                });
              },
            });
          } catch (e) {
            logErrorInDevMode(e);
            this.calculatedValidityChanges.next(Validity.ERROR);
            this.overallValidityChanges.next(Validity.ERROR);
            this.messageChanges.next({
              type: MessageType.ERROR,
              text: config.globalMessages.multiFieldValidationError,
              hasUnvisitedOrUnmodifiedFields: this.hasUnvisitedOrUnmodifiedFields(aggregateChange)
            });
          }
        }
      },
    );
  }

  hasUnvisitedOrUnmodifiedFields(aggregateChange : AggregatedStateChanges) {
    return aggregateChange.modified() < Modified.YES || aggregateChange.visited() < Visited.YES;
  }
}
