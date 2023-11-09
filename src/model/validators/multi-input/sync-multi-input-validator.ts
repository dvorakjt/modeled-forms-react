import { ReplaySubject, Subject } from 'rxjs';
import { AggregatedStateChanges } from '../../aggregators/aggregated-state-changes.interface';
import { MultiFieldAggregator } from '../../aggregators/multi-field-aggregator.interface';
import { OneTimeValueEmitter } from '../../emitters/one-time-value-emitter.interface';
import { MultiInputValidator } from './multi-input-validator.interface';
import { SyncValidator } from '../sync-validator.type';
import { Validity } from '../../state/validity.enum';
import { MessageType } from '../../state/messages/message-type.enum';
import { config } from '../../../config';
import { logErrorInDevMode } from '../../util/log-error-in-dev-mode';
import { Message } from '../../state/messages/message.interface';

export class SyncMultiInputValidator implements MultiInputValidator {
  //messages, calculatedValidity, and overallValidityChanges all go to different destinations
  readonly calculatedValidityChanges: Subject<Validity>;
  readonly overallValidityChanges: Subject<Validity>;
  readonly messageChanges: Subject<Message | null>;
  readonly accessedFields: OneTimeValueEmitter<Set<string>>;
  readonly _multiFieldAggregator: MultiFieldAggregator;
  readonly _validator: SyncValidator<AggregatedStateChanges>;
  _completedFirstRun = false;

  constructor(
    multiFieldAggregator: MultiFieldAggregator,
    validator: SyncValidator<AggregatedStateChanges>,
  ) {
    this._validator = validator;
    this._multiFieldAggregator = multiFieldAggregator;
    this.accessedFields = multiFieldAggregator.accessedFields;
    this.calculatedValidityChanges = new ReplaySubject<Validity>(1);
    this.overallValidityChanges = new ReplaySubject<Validity>(1);
    this.messageChanges = new ReplaySubject<Message | null>(1);
    this._multiFieldAggregator.aggregateChanges.subscribe(
      (aggregateChange: AggregatedStateChanges) => {
        //first, run the validator so hasOmittedFields and overallValidity are accurate
        let result;
        if (!this._completedFirstRun) {
          result = this._runValidator(aggregateChange);
          this._completedFirstRun = true;
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
        } else if (result) {
          this.calculatedValidityChanges.next(result.validity);
          this.overallValidityChanges.next(result.validity);
          this.messageChanges.next(result.message);
        } else {
          result = this._runValidator(aggregateChange);
          this.calculatedValidityChanges.next(result.validity);
          this.overallValidityChanges.next(result.validity);
          this.messageChanges.next(result.message);
        }
      },
    );
  }

  _runValidator(aggregateChange: AggregatedStateChanges): {
    validity: Validity;
    message: Message | null;
  } {
    try {
      let message: Message | null;
      const result = this._validator(aggregateChange);
      const validity = result.isValid
        ? Validity.VALID_FINALIZABLE
        : Validity.INVALID;
      if (result.message) {
        message = {
          type: result.isValid ? MessageType.VALID : MessageType.INVALID,
          text: result.message,
        };
      } else message = null;
      return {
        validity,
        message,
      };
    } catch (e) {
      logErrorInDevMode(e);
      return {
        validity: Validity.ERROR,
        message: {
          type: MessageType.ERROR,
          text: config.globalMessages.multiFieldValidationError,
        },
      };
    }
  }
}
