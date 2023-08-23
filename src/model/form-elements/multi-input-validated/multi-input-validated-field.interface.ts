import type { MultiInputValidator } from '../../validators/multi-input/multi-input-validator.interface';

export interface MultiInputValidatedFormElement {
  addValidator(validator: MultiInputValidator): void;
}
