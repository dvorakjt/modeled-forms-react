import { BehaviorSubject, type Subject } from 'rxjs';
import { MultiInputValidatorValidityReducer } from './multi-input-validator-validity-reducer.interface';
import { Validity } from '../../state/validity.enum';
import { MultiInputValidator } from '../../validators/multi-input/multi-input-validator.interface';
import { ValidityReducer } from '../validity/validity-reducer.interface';

export class UserFacingMultiInputValidatorReducer
  implements MultiInputValidatorValidityReducer
{
  validityChanges: Subject<Validity>;
  _validityReducer: ValidityReducer;
  _multiInputValidators: Array<MultiInputValidator> = [];

  get validity() {
    return this._validityReducer.validity;
  }

  constructor(validityReducer: ValidityReducer) {
    this._validityReducer = validityReducer;
    this.validityChanges = new BehaviorSubject<Validity>(
      this._validityReducer.validity,
    );
  }

  addValidator(multiFieldValidator: MultiInputValidator): void {
    const validatorId = String(this._multiInputValidators.length);
    this._multiInputValidators.push(multiFieldValidator);
    multiFieldValidator.calculatedValidityChanges.subscribe(
      (validityChange: Validity) => {
        this._validityReducer.updateTallies(validatorId, validityChange);
        this.validityChanges.next(this._validityReducer.validity);
      },
    );
  }
}
