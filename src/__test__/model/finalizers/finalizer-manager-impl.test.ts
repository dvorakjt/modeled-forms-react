import { describe, test, expect, beforeEach } from 'vitest';
import { FinalizerManagerImpl } from '../../../model/finalizers/finalizer-manager-impl';
import { container } from '../../../model/container';
import { MockFinalizer } from '../../util/mocks/mock-finalizer';
import { FinalizerManager } from '../../../model/finalizers/finalizer-manager.interface';
import { FinalizerDictionary } from '../../../model/finalizers/finalizer-map.type';
import { FinalizerValidity } from '../../../model/state/finalizer-validity.enum';
import { Visited } from '../../../model/state/visited.enum';
import { Modified } from '../../../model/state/modified-enum';

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

    (finalizerDictionary.fieldA as MockFinalizer).next({ value : 'new value', finalizerValidity : FinalizerValidity.VALID_FINALIZED, visited : Visited.YES, modified : Modified.YES });
    
    expect(finalizerManager.state.value).toStrictEqual({ fieldA : 'new value' });
  });

  test('When a finalizer with a previously defined value property emits an undefined value property, that finalizer is removed from the FinalizerManagerImpl\'s value.', () => {
    (finalizerDictionary.fieldA as MockFinalizer).next({ value : 'new value', finalizerValidity : FinalizerValidity.VALID_FINALIZED, visited : Visited.YES, modified : Modified.YES });

    expect(finalizerManager.state.value).toStrictEqual({ fieldA : 'new value' });

    (finalizerDictionary.fieldA as MockFinalizer).next({ finalizerValidity : FinalizerValidity.FIELD_INVALID, visited : Visited.YES, modified : Modified.YES });
    
    expect(finalizerManager.state.value).toStrictEqual({});
  });
});