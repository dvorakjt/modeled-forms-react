import type { AsyncValidator } from '../../../../../../model/validators/async-validator.type';

export const untriggerableAsyncValidator = (() =>
  new Promise(() => {})) as AsyncValidator<any>;
