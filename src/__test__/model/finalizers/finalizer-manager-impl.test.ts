import { describe, test, expect, beforeEach } from 'vitest';
import { FinalizerManagerImpl } from '../../../model/finalizers/finalizer-manager-impl';
import { container } from '../../../model/container';
import { MockFinalizer } from '../../util/mocks/mock-finalizer';
import { FinalizerManager } from '../../../model/finalizers/finalizer-manager.interface';
import { FinalizerDictionary } from '../../../model/finalizers/finalizer-map.type';
import { FinalizerValidity } from '../../../model/state/finalizer-validity.enum';
import { Visited } from '../../../model/state/visited.enum';
import { Modified } from '../../../model/state/modified-enum';
import { Validity } from '../../../model';

describe('FinalizerManagerImpl', () => {
  let finalizerManager : FinalizerManager;
  let finalizerDictionary : FinalizerDictionary;

  beforeEach(() => {
    finalizerDictionary = {
      fieldA : MockFinalizer.createUnvisitedUnmodifiedInvalidFinalizer(),
      fieldB : MockFinalizer.createUnvisitedUnmodifiedInvalidFinalizer(),
      fieldC : MockFinalizer.createUnvisitedUnmodifiedInvalidFinalizer()
    }

    const reducerFactory = container.services.ReducerFactory;
    const finalizerValidityReducer = reducerFactory.createFinalizerValidityReducer();
    const finalizerValidityTranslator = container.services.FinalizerValidityTranslator;
    const visitationReducer = reducerFactory.createVisitationReducer();
    const modificationReducer = reducerFactory.createModificationReducer();

    finalizerManager = new FinalizerManagerImpl(
      finalizerDictionary,
      finalizerValidityReducer,
      finalizerValidityTranslator,
      visitationReducer,
      modificationReducer
    );
  });

  test('When a finalizer emits a FinalizerState with a defined value, the FinalizerManager\'s value property is updated.', () => {
    expect(finalizerManager.state.value).toStrictEqual({});

    finalizerDictionary.fieldA.stream.next({ value : 'new value', finalizerValidity : FinalizerValidity.VALID_FINALIZED, visited : Visited.YES, modified : Modified.YES });
    
    expect(finalizerManager.state.value).toStrictEqual({ fieldA : 'new value' });
  });

  test('When a finalizer with a previously defined value property emits an undefined value property, that finalizer is removed from the FinalizerManagerImpl\'s value.', () => {
    finalizerDictionary.fieldA.stream.next({ value : 'new value', finalizerValidity : FinalizerValidity.VALID_FINALIZED, visited : Visited.YES, modified : Modified.YES });

    expect(finalizerManager.state.value).toStrictEqual({ fieldA : 'new value' });

    finalizerDictionary.fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.YES, modified : Modified.YES });
    
    expect(finalizerManager.state.value).toStrictEqual({});
  });

  test('When all finalizers emit a FinalizerState with a visited property set to Visited.NO, the FinalizerMangager\'s state.visited is also Visited.NO.', () => {
    expect(finalizerManager.state.visited).toBe(Visited.NO);
  });

  test('When all finalizers emit a FinalizerState with a visited property set to Visited.YES, the FinalizerMangager\'s state.visited is also Visited.YES.', () => {
    const { fieldA, fieldB, fieldC } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.YES, modified : Modified.NO });
    fieldB.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.YES, modified : Modified.NO });
    fieldC.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.YES, modified : Modified.NO });
    expect(finalizerManager.state.visited).toBe(Visited.YES);
  });

  test('When all finalizers emit a FinalizerState with a visited property set to Visited.PARTIALLY, the FinalizerMangager\'s state.visited is also Visited.PARTIALLY.', () => {
    const { fieldA, fieldB, fieldC } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.PARTIALLY, modified : Modified.NO });
    fieldB.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.PARTIALLY, modified : Modified.NO });
    fieldC.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.PARTIALLY, modified : Modified.NO });
    expect(finalizerManager.state.visited).toBe(Visited.PARTIALLY);
  });
  
  test('When all finalizers emit a FinalizerState with a visited property set to Visited.NO, except one which is set to Visited.YES, the FinalizerManager\'s state is Visited.PARTIALLY.', () => {
    const { fieldA } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.YES, modified : Modified.NO });
    expect(finalizerManager.state.visited).toBe(Visited.PARTIALLY);
  });

  test('When all finalizers emit a FinalizerState with a visited property set to Visited.NO, except one which is set to Visited.PARTIALLY, the FinalizerManager\'s state is Visited.PARTIALLY.', () => {
    const { fieldA } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.PARTIALLY, modified : Modified.NO });
    expect(finalizerManager.state.visited).toBe(Visited.PARTIALLY);
  });

  test('When all finalizers emit a FinalizerState with a visited property set to Visited.YES, except one which is set to Visited.NO, the FinalizerManager\'s state is Visited.PARTIALLY.', () => {
    const { fieldA, fieldB } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.YES, modified : Modified.NO });
    fieldB.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.YES, modified : Modified.NO });
    expect(finalizerManager.state.visited).toBe(Visited.PARTIALLY);
  });

  test('When all finalizers emit a FinalizerState with a visited property set to Visited.YES, except one which is set to Visited.PARTIALLY, the FinalizerManager\'s state is Visited.PARTIALLY.', () => {
    const { fieldA, fieldB, fieldC } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.YES, modified : Modified.NO });
    fieldB.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.YES, modified : Modified.NO });
    fieldC.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.PARTIALLY, modified : Modified.NO });
    expect(finalizerManager.state.visited).toBe(Visited.PARTIALLY);
  });

  test('When all finalizers emit a FinalizerState with a visited property set to Visited.PARTIALLY, except one which is set to Visited.NO, the FinalizerManager\'s state is Visited.PARTIALLY.', () => {
    const { fieldA, fieldB } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.PARTIALLY, modified : Modified.NO });
    fieldB.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.PARTIALLY, modified : Modified.NO });
    expect(finalizerManager.state.visited).toBe(Visited.PARTIALLY);
  });

  test('When all finalizers emit a FinalizerState with a visited property set to Visited.PARTIALLY, except one which is set to Visited.YES, the FinalizerManager\'s state is Visited.PARTIALLY.', () => {
    const { fieldA, fieldB, fieldC } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.PARTIALLY, modified : Modified.NO });
    fieldB.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.PARTIALLY, modified : Modified.NO });
    fieldC.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.YES, modified : Modified.NO });
    expect(finalizerManager.state.visited).toBe(Visited.PARTIALLY);
  });

  test('When finalizers emit FinalizerStates included Visited.NO, Visited.YES, and Visited.PARTIALLY, the FinalizerManager\'s state.visited property is Visited.PARTIALLY.', () => {
    const { fieldA, fieldB } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.YES, modified : Modified.NO });
    fieldB.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.PARTIALLY, modified : Modified.NO });
    expect(finalizerManager.state.visited).toBe(Visited.PARTIALLY);
  });
  
  test('When all finalizers emit a FinalizerState with a modified property set to Modified.NO, the FinalizerMangager\'s state.modified is also Modified.NO.', () => {
    expect(finalizerManager.state.modified).toBe(Modified.NO);
  });

  test('When all finalizers emit a FinalizerState with a modified property set to Modified.YES, the FinalizerMangager\'s state.modified is also Modified.YES.', () => {
    const { fieldA, fieldB, fieldC } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.YES, modified : Modified.YES });
    fieldB.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.YES, modified : Modified.YES });
    fieldC.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.YES, modified : Modified.YES });
    expect(finalizerManager.state.modified).toBe(Modified.YES);
  });

  test('When all finalizers emit a FinalizerState with a modified property set to Modified.PARTIALLY, the FinalizerMangager\'s state.modified is also Modified.PARTIALLY.', () => {
    const { fieldA, fieldB, fieldC } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.PARTIALLY, modified : Modified.PARTIALLY });
    fieldB.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.PARTIALLY, modified : Modified.PARTIALLY });
    fieldC.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.PARTIALLY, modified : Modified.PARTIALLY });
    expect(finalizerManager.state.modified).toBe(Modified.PARTIALLY);
  });
  
  test('When all finalizers emit a FinalizerState with a modified property set to Modified.NO, except one which is set to Modified.YES, the FinalizerManager\'s state is Modified.PARTIALLY.', () => {
    const { fieldA } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.YES, modified : Modified.YES });
    expect(finalizerManager.state.modified).toBe(Modified.PARTIALLY);
  });

  test('When all finalizers emit a FinalizerState with a modified property set to Modified.NO, except one which is set to Modified.PARTIALLY, the FinalizerManager\'s state is Modified.PARTIALLY.', () => {
    const { fieldA } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.PARTIALLY, modified : Modified.PARTIALLY });
    expect(finalizerManager.state.modified).toBe(Modified.PARTIALLY);
  });

  test('When all finalizers emit a FinalizerState with a modified property set to Modified.YES, except one which is set to Modified.NO, the FinalizerManager\'s state is Modified.PARTIALLY.', () => {
    const { fieldA, fieldB } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.YES, modified : Modified.YES });
    fieldB.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.YES, modified : Modified.YES });
    expect(finalizerManager.state.modified).toBe(Modified.PARTIALLY);
  });

  test('When all finalizers emit a FinalizerState with a modified property set to Modified.YES, except one which is set to Modified.PARTIALLY, the FinalizerManager\'s state is Modified.PARTIALLY.', () => {
    const { fieldA, fieldB, fieldC } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.YES, modified : Modified.YES });
    fieldB.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.YES, modified : Modified.YES });
    fieldC.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.PARTIALLY, modified : Modified.PARTIALLY });
    expect(finalizerManager.state.modified).toBe(Modified.PARTIALLY);
  });

  test('When all finalizers emit a FinalizerState with a modified property set to Modified.PARTIALLY, except one which is set to Modified.NO, the FinalizerManager\'s state is Modified.PARTIALLY.', () => {
    const { fieldA, fieldB } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.PARTIALLY, modified : Modified.PARTIALLY });
    fieldB.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.PARTIALLY, modified : Modified.PARTIALLY });
    expect(finalizerManager.state.modified).toBe(Modified.PARTIALLY);
  });

  test('When all finalizers emit a FinalizerState with a modified property set to Modified.PARTIALLY, except one which is set to Modified.YES, the FinalizerManager\'s state is Modified.PARTIALLY.', () => {
    const { fieldA, fieldB, fieldC } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.PARTIALLY, modified : Modified.PARTIALLY });
    fieldB.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.PARTIALLY, modified : Modified.PARTIALLY });
    fieldC.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.YES, modified : Modified.YES });
    expect(finalizerManager.state.modified).toBe(Modified.PARTIALLY);
  });

  test('When finalizers emit FinalizerStates included Modified.NO, Modified.YES, and Modified.PARTIALLY, the FinalizerManager\'s state.modified property is Modified.PARTIALLY.', () => {
    const { fieldA, fieldB } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.YES, modified : Modified.YES });
    fieldB.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.PARTIALLY, modified : Modified.PARTIALLY });
    expect(finalizerManager.state.modified).toBe(Modified.PARTIALLY);
  });

  test('When at least one finalizer emits a FinalizerState with a finalizerValidity property of FinalizerValidity.FINALIZER_ERROR, the FinalizerManager\'s state.validity is Validity.ERROR.', () => {
    const { fieldA } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FINALIZER_ERROR, visited: Visited.YES, modified: Modified.YES });
    expect(finalizerManager.state.validity).toBe(Validity.ERROR);
  });

  test('When at least one finalizer emits a FinalizerState with a finalizerValidity property of FinalizerValidity.FIELD_ERROR, the FinalizerManager\'s state.validity is Validity.ERROR.', () => {
    const { fieldA } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_ERROR, visited: Visited.YES, modified: Modified.YES });
    expect(finalizerManager.state.validity).toBe(Validity.ERROR);
  });

  test('When at least one finalizer emits a FinalizerState with a finalizerValidity property of FinalizerValidity.FIELD_INVALID, and the other finalizer\'s have a greater validity, the FinalizerManager\'s state.validity is Validity.INVALID.', () => {
    const { fieldA, fieldB, fieldC } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited: Visited.YES, modified: Modified.YES });
    fieldB.stream.next({ value : '', finalizerValidity : FinalizerValidity.FIELD_PENDING, visited: Visited.YES, modified: Modified.YES });
    fieldC.stream.next({ value: '', finalizerValidity : FinalizerValidity.FIELD_VALID_UNFINALIZABLE, visited: Visited.YES, modified: Modified.YES });
    expect(finalizerManager.state.validity).toBe(Validity.INVALID);
  });

  test('When at least one finalizer emits a FinalizerState with a finalizerValidity property of FinalizerValidity.FIELD_PENDING, and the other finalizer\'s have a greater validity, the FinalizerManager\'s state.validity is Validity.PENDING.', () => {
    const { fieldA, fieldB, fieldC } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_PENDING, visited: Visited.YES, modified: Modified.YES });
    fieldB.stream.next({ value : '', finalizerValidity : FinalizerValidity.FIELD_VALID_UNFINALIZABLE, visited: Visited.YES, modified: Modified.YES });
    fieldC.stream.next({ value: '', finalizerValidity : FinalizerValidity.VALID_FINALIZING, visited: Visited.YES, modified: Modified.YES });
    expect(finalizerManager.state.validity).toBe(Validity.PENDING);
  });

  test('When at least one finalizer emits a FinalizerState with a finalizerValidity property of FinalizerValidity.FIELD_VALID_UNFINALIZABLE, and the other finalizer\'s have a greater validity, the FinalizerManager\'s state.validity is Validity.VALID_UNFINALIZABLE.', () => {
    const { fieldA, fieldB, fieldC } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.FIELD_VALID_UNFINALIZABLE, visited: Visited.YES, modified: Modified.YES });
    fieldB.stream.next({ value : '', finalizerValidity : FinalizerValidity.VALID_FINALIZING, visited: Visited.YES, modified: Modified.YES });
    fieldC.stream.next({ value: '', finalizerValidity : FinalizerValidity.VALID_FINALIZED, visited: Visited.YES, modified: Modified.YES });
    expect(finalizerManager.state.validity).toBe(Validity.VALID_UNFINALIZABLE);
  });

  test('When at least one finalizer emits a FinalizerState with a finalizerValidity property of FinalizerValidity.VALID_FINALIZING, and the other finalizer\'s have a greater validity, the FinalizerManager\'s state.validity is Validity.VALID_UNFINALIZABLE.', () => {
    const { fieldA, fieldB, fieldC } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.VALID_FINALIZING, visited: Visited.YES, modified: Modified.YES });
    fieldB.stream.next({ value : '', finalizerValidity : FinalizerValidity.VALID_FINALIZED, visited: Visited.YES, modified: Modified.YES });
    fieldC.stream.next({ value: '', finalizerValidity : FinalizerValidity.VALID_FINALIZED, visited: Visited.YES, modified: Modified.YES });
    expect(finalizerManager.state.validity).toBe(Validity.VALID_UNFINALIZABLE);
  });

  test('When all finalizers emit FinalizerStates with a finalizerValidity property of FinalizerValidity.VALID_FINALIZED, the FinalizerManager\'s state.validity property is Validity.VALID_FINALIZABLE.', () => {
    const { fieldA, fieldB, fieldC } = finalizerDictionary;
    fieldA.stream.next({ finalizerValidity : FinalizerValidity.VALID_FINALIZED, visited: Visited.YES, modified: Modified.YES });
    fieldB.stream.next({ value : '', finalizerValidity : FinalizerValidity.VALID_FINALIZED, visited: Visited.YES, modified: Modified.YES });
    fieldC.stream.next({ value: '', finalizerValidity : FinalizerValidity.VALID_FINALIZED, visited: Visited.YES, modified: Modified.YES });
    expect(finalizerManager.state.validity).toBe(Validity.VALID_FINALIZABLE);
  });
});