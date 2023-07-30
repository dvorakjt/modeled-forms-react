import { AsyncValidator } from "../../../../../../model/types/validators/async-validator.type";

export function createImmediateErrorThrowingAsyncValidator (error : Error) : AsyncValidator<any> {
  return () => {
    throw error;
  }
}