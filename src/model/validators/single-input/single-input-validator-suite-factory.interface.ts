import { AsyncValidator } from '../async-validator.type';
import { SyncValidator } from '../sync-validator.type';
import { SingleInputValidatorSuite } from './single-input-validator-suite.interface';

interface SingleInputValidatorSuiteFactory {
  createSingleInputValidatorSuite<T>(
    syncValidators: SyncValidator<T>[],
    asyncValidators: AsyncValidator<T>[],
    pendingAsyncValidatorMessage?: string,
  ): SingleInputValidatorSuite<T>;
}
const SingleInputValidatorSuiteFactoryKey = 'SingleInputValidatorSuiteFactory';
type SingleInputValidatorSuiteFactoryKeyType =
  typeof SingleInputValidatorSuiteFactoryKey;

export {
  SingleInputValidatorSuiteFactoryKey,
  type SingleInputValidatorSuiteFactory,
  type SingleInputValidatorSuiteFactoryKeyType,
};
