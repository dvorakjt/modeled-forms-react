import type { AsyncValidator } from '../../../../../../model/types/constituents/validators/async-validator.type';

export const untriggerableAsyncValidator = (() =>
  new Promise(() => {})) as AsyncValidator<any>;
