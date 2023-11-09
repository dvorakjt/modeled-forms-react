import { describe, test, expect } from 'vitest';
import { FieldStateReducerImpl } from '../../../model/reducers/field-state/field-state-reducer-impl';
import { Validity } from '../../../model/state/validity.enum';
import { Visited } from '../../../model/state/visited.enum';
import { Modified } from '../../../model/state/modified.enum';
import { container } from '../../../model/container';

describe('FieldStateReducerImpl', () => {
  const validityReducer =
    container.services.ReducerFactory.createValidityReducer();
  const visitationReducer = container.services.ReducerFactory.createVisitationReducer();
  const modificationReducer = container.services.ReducerFactory.createModificationReducer();
  const fieldValidityReducer = new FieldStateReducerImpl(validityReducer, visitationReducer, modificationReducer);
  fieldValidityReducer.updateTallies('a', createState(Validity.ERROR, Visited.YES, Modified.YES));
  fieldValidityReducer.updateTallies('b', createState(Validity.INVALID, Visited.YES, Modified.YES));
  fieldValidityReducer.updateTallies('c', createState(Validity.PENDING, Visited.YES, Modified.YES));
  fieldValidityReducer.updateTallies(
    'd',
    createState(Validity.VALID_UNFINALIZABLE, Visited.YES, Modified.YES),
  );
  fieldValidityReducer.updateTallies(
    'e',
    createState(Validity.VALID_FINALIZABLE, Visited.YES, Modified.YES),
  );

  test('If there is at least one errant field, validity = Validity.ERROR.', () => {
    expect(fieldValidityReducer.validity).toBe(Validity.ERROR);
  });

  test('If there is at least one invalid field and no errant fields, validity = Validity.INVALID.', () => {
    fieldValidityReducer.updateTallies(
      'a',
      createState(Validity.VALID_FINALIZABLE, Visited.YES, Modified.YES),
    );
    expect(fieldValidityReducer.validity).toBe(Validity.INVALID);
  });

  test('If there is at least one pending field and no errant or invalid fields, validity = Validity.PENDING.', () => {
    fieldValidityReducer.updateTallies(
      'b',
      createState(Validity.VALID_FINALIZABLE, Visited.YES, Modified.YES),
    );
    expect(fieldValidityReducer.validity).toBe(Validity.PENDING);
  });

  test('If there is at least one valid unfinalizable field and no errant, invalid, or pending fields, validity = Validity.VALID_UNFINALIZABLE.', () => {
    fieldValidityReducer.updateTallies(
      'c',
      createState(Validity.VALID_FINALIZABLE, Visited.YES, Modified.YES),
    );
    expect(fieldValidityReducer.validity).toBe(Validity.VALID_UNFINALIZABLE);
  });

  test('If no errant, invalid, pending, or valid_unfinalizable fields, validity is Validity.VALID_FINALIZABLE.', () => {
    fieldValidityReducer.updateTallies(
      'd',
      createState(Validity.VALID_FINALIZABLE, Visited.YES, Modified.YES),
    );
    expect(fieldValidityReducer.validity).toBe(Validity.VALID_FINALIZABLE);
  });

  test('If one field has an omit property of true, omit is true.', () => {
    fieldValidityReducer.updateTallies(
      'a',
      createState(Validity.VALID_FINALIZABLE, Visited.YES, Modified.YES, true),
    );
    expect(fieldValidityReducer.omit).toBe(true);
  });
});

function createState(validity: Validity, visited : Visited, modified : Modified, omit: boolean = false) {
  return {
    value: '',
    validity,
    messages: [],
    visited,
    modified,
    omit,
  };
}
