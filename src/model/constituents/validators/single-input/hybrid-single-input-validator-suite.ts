import { AsyncSingleInputValidatorSuite } from './async-single-input-validator-suite';
import { SyncSingleInputValidatorSuite } from './sync-single-input-validator-suite';
import { Validity } from '../../../types/constituents/state/validity.enum';
import type { SingleInputValidatorSuite } from '../../../types/constituents/validators/single-input/single-input-validator-suite.interface';
import type { ValidatorSuiteResultsObject } from '../../../types/constituents/validators/validator-suite-results-object.interface';

export class HybridSingleInputValidatorSuite<T>
  implements SingleInputValidatorSuite<T>
{
  readonly #syncValidatorSuite: SyncSingleInputValidatorSuite<T>;
  readonly #asyncValidatorSuite: AsyncSingleInputValidatorSuite<T>;
  constructor(
    syncValidatorSuite: SyncSingleInputValidatorSuite<T>,
    asyncValidatorSuite: AsyncSingleInputValidatorSuite<T>,
  ) {
    this.#syncValidatorSuite = syncValidatorSuite;
    this.#asyncValidatorSuite = asyncValidatorSuite;
  }

  evaluate(value: T) {
    const result: ValidatorSuiteResultsObject<T> =
      this.#syncValidatorSuite.evaluate(value);

    if (result.syncResult.validity <= Validity.INVALID) return result;

    const asyncResult = this.#asyncValidatorSuite.evaluate(value);

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
