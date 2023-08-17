import { AsyncValidator } from '../../../../../../model/validators/async-validator.type';

export function createIntraPromiseErrorThrowingAsyncValidator(
  error: Error,
): AsyncValidator<any> {
  return () => {
    return new Promise(() => {
      throw error;
    });
  };
}
