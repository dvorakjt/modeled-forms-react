import { describe, test, expect } from 'vitest';
import { FinalizerManagerFactoryImpl } from '../../../model/finalizers/finalizer-manager-factory-impl';
import { container } from '../../../model/container';
import { MockField } from '../../util/mocks/mock-field';
import { Validity } from '../../../model';
import { FinalizerManagerImpl } from '../../../model/finalizers/finalizer-manager-impl';

describe('FinalizerManagerFactoryImpl', () => {
  test('createFinalizerManager() returns a FinalizerManagerImpl when called with a finalizerDictionary.', () => {
    const finalizerManagerFactory = new FinalizerManagerFactoryImpl(
      container.services.ReducerFactory,
      container.services.FinalizerValidityTranslator,
      container.services.ConfigLoader
    );
    const finalizerFactory = container.services.FinalizerFactory;
    const fieldA = new MockField('', Validity.VALID_FINALIZABLE);
    const fieldB = new MockField('', Validity.VALID_FINALIZABLE);
    const finalizerA = finalizerFactory.createDefaultFinalizer(fieldA);
    const finalizerB = finalizerFactory.createDefaultFinalizer(fieldB);
    const finalizerDictionary = {
      fieldA: finalizerA,
      fieldB: finalizerB,
    };
    const finalizerManager =
      finalizerManagerFactory.createFinalizerManager(finalizerDictionary);
    expect(finalizerManager).toBeInstanceOf(FinalizerManagerImpl);
  });
});
