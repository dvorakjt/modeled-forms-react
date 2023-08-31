import { AsyncSingleInputValidatorSuite } from './async-single-input-validator-suite';
import { SyncSingleInputValidatorSuite } from './sync-single-input-validator-suite';
import { Validity } from '../../state/validity.enum';
import type { SingleInputValidatorSuite } from './single-input-validator-suite.interface';
import type { ValidatorSuiteResultsObject } from '../validator-suite-results-object.interface';

export class HybridSingleInputValidatorSuite<T>
  implements SingleInputValidatorSuite<T>
{
  readonly _syncValidatorSuite: SyncSingleInputValidatorSuite<T>;
  readonly _asyncValidatorSuite: AsyncSingleInputValidatorSuite<T>;
  constructor(
    syncValidatorSuite: SyncSingleInputValidatorSuite<T>,
    asyncValidatorSuite: AsyncSingleInputValidatorSuite<T>,
  ) {
    this._syncValidatorSuite = syncValidatorSuite;
    this._asyncValidatorSuite = asyncValidatorSuite;
  }

  evaluate(value: T) {
    const result: ValidatorSuiteResultsObject<T> =
      this._syncValidatorSuite.evaluate(value);

    if (result.syncResult.validity <= Validity.INVALID) return result;

    const asyncResult = this._asyncValidatorSuite.evaluate(value);

    return {
      syncResult: {
        value: asyncResult.syncResult.value,
        validity: asyncResult.syncResult.validity,
        messages: [
          ...result.syncResult.messages,
          ...asyncResult.syncResult.messages,
        ],
      },
      observable: asyncResult.observable,
    };
  }
}
