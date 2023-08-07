import { AsyncValidator } from "../../../../../../model/types/constituents/validators/async-validator.type";

export function createImmediateErrorThrowingAsyncValidator (error : Error) : AsyncValidator<any> {
  return () => {
    throw error;
  }
}