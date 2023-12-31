import { Validity } from '../../state/validity.enum';
import { MessageType } from '../../state/messages/message-type.enum';
import { logErrorInDevMode } from '../../util/log-error-in-dev-mode';
import type { SingleInputValidatorSuite } from './single-input-validator-suite.interface';
import type { SyncValidator } from '../sync-validator.type';
import type { ValidatorSuiteResult } from '../validator-suite-result.interface';
import { Config } from '../../config-loader/config.interface';

export class SyncSingleInputValidatorSuite<T>
  implements SingleInputValidatorSuite<T>
{
  readonly _validators: Array<SyncValidator<T>>;
  readonly _config : Config;

  constructor(validators: Array<SyncValidator<T>>, config : Config) {
    this._validators = validators;
    this._config = config;
  }

  evaluate(value: T) {
    return {
      syncResult: this._evaluateSync(value),
    };
  }

  _evaluateSync(value: T) {
    const result: ValidatorSuiteResult<T> = {
      value,
      validity: Validity.VALID_FINALIZABLE,
      messages: [],
    };
    try {
      for (const validator of this._validators) {
        const { isValid, message: messageTxt } = validator(value);
        if (!isValid) result.validity = Validity.INVALID;
        if (messageTxt) {
          result.messages.push({
            type: isValid ? MessageType.VALID : MessageType.INVALID,
            text: messageTxt,
          });
        }
      }
    } catch (e) {
      logErrorInDevMode(e);
      result.validity = Validity.ERROR;
      result.messages.push({
        type: MessageType.ERROR,
        text: this._config.globalMessages.singleFieldValidationError,
      });
    }
    return result;
  }
}
