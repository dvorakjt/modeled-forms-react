import { describe, test, expect } from 'vitest';
import { FieldValidityReducerImpl } from '../../../model/reducers/field-validity-reducer-impl';
import { Validity } from '../../../model/types/state/validity.enum';

describe('FieldValidityReducerImpl', () => {
  const fieldValidityReducer = new FieldValidityReducerImpl();
  fieldValidityReducer.updateTallies('a', Validity.ERROR);
  fieldValidityReducer.updateTallies('b', Validity.INVALID);
  fieldValidityReducer.updateTallies('c', Validity.PENDING);
  fieldValidityReducer.updateTallies('d', Validity.VALID_UNFINALIZABLE);
  fieldValidityReducer.updateTallies('e', Validity.VALID_FINALIZABLE);

  test('if there is at least one errant field, validity = Validity.ERROR.', () => {
    expect(fieldValidityReducer.validity).toBe(Validity.ERROR);
  });

  test('if there is at least one invalid field and no errant fields, validity = Validity.INVALID.', () => {
    fieldValidityReducer.updateTallies('a', Validity.VALID_FINALIZABLE);
    expect(fieldValidityReducer.validity).toBe(Validity.INVALID);
  });

  test('if there is at least one pending field and no errant or invalid fields, validity = Validity.PENDING.', () => {
    fieldValidityReducer.updateTallies('b', Validity.VALID_FINALIZABLE);
    expect(fieldValidityReducer.validity).toBe(Validity.PENDING);
  });

  test('if there is at least one valid unfinalizable field and no errant, invalid, or pending fields, validity = Validity.VALID_UNFINALIZABLE.', () => {
    fieldValidityReducer.updateTallies('c', Validity.VALID_FINALIZABLE);
    expect(fieldValidityReducer.validity).toBe(Validity.VALID_UNFINALIZABLE);
  });

  test('if no errant, invalid, pending, or valid_unfinalizable fields, validity is Validity.VALID_FINALIZABLE.', () => {
    fieldValidityReducer.updateTallies('d', Validity.VALID_FINALIZABLE);
    expect(fieldValidityReducer.validity).toBe(Validity.VALID_FINALIZABLE);
  });
});
