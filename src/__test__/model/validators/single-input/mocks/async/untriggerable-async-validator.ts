import type { AsyncValidator } from '../../../../../../model/types/validators/async-validator.type';

export const untriggerableAsyncValidator = (() =>
  new Promise(() => {})) as AsyncValidator<any>;
