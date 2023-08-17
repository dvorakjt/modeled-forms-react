import { AsyncValidator } from '../../../../../../model/validators/async-validator.type';

export function createImmediateErrorThrowingAsyncValidator(
  error: Error,
): AsyncValidator<any> {
  return () => {
    throw error;
  };
}
