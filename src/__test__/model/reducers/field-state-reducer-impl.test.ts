import { describe, test, expect } from 'vitest';
import { getTestContainer, Services } from '../test-container';
import { FieldStateReducerImpl } from '../../../model/reducers/field-state/field-state-reducer-impl';
import { Validity } from '../../../model/state/validity.enum';
import { ValidityReducer } from '../../../model/reducers/validity/validity-reducer.interface';

describe('FieldStateReducerImpl', () => {
  const container = getTestContainer();
  const validityReducer = container.get<ValidityReducer>(Services.ValidityReducer);
  const fieldValidityReducer = new FieldStateReducerImpl(validityReducer);
  fieldValidityReducer.updateTallies('a', createState(Validity.ERROR));
  fieldValidityReducer.updateTallies('b', createState(Validity.INVALID));
  fieldValidityReducer.updateTallies('c', createState(Validity.PENDING));
  fieldValidityReducer.updateTallies(
    'd',
    createState(Validity.VALID_UNFINALIZABLE),
  );
  fieldValidityReducer.updateTallies(
    'e',
    createState(Validity.VALID_FINALIZABLE),
  );

  test('If there is at least one errant field, validity = Validity.ERROR.', () => {
    expect(fieldValidityReducer.validity).toBe(Validity.ERROR);
  });

  test('If there is at least one invalid field and no errant fields, validity = Validity.INVALID.', () => {
    fieldValidityReducer.updateTallies(
      'a',
      createState(Validity.VALID_FINALIZABLE),
    );
    expect(fieldValidityReducer.validity).toBe(Validity.INVALID);
  });

  test('If there is at least one pending field and no errant or invalid fields, validity = Validity.PENDING.', () => {
    fieldValidityReducer.updateTallies(
      'b',
      createState(Validity.VALID_FINALIZABLE),
    );
    expect(fieldValidityReducer.validity).toBe(Validity.PENDING);
  });

  test('If there is at least one valid unfinalizable field and no errant, invalid, or pending fields, validity = Validity.VALID_UNFINALIZABLE.', () => {
    fieldValidityReducer.updateTallies(
      'c',
      createState(Validity.VALID_FINALIZABLE),
    );
    expect(fieldValidityReducer.validity).toBe(Validity.VALID_UNFINALIZABLE);
  });

  test('If no errant, invalid, pending, or valid_unfinalizable fields, validity is Validity.VALID_FINALIZABLE.', () => {
    fieldValidityReducer.updateTallies(
      'd',
      createState(Validity.VALID_FINALIZABLE),
    );
    expect(fieldValidityReducer.validity).toBe(Validity.VALID_FINALIZABLE);
  });

  test('If one field has an omit property of true, omit is true.', () => {
    fieldValidityReducer.updateTallies(
      'a',
      createState(Validity.VALID_FINALIZABLE, true),
    );
    expect(fieldValidityReducer.omit).toBe(true);
  });
});

function createState(validity: Validity, omit: boolean = false) {
  return {
    value: '',
    validity,
    messages: [],
    omit,
  };
}
