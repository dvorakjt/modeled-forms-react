import { describe, test, expect } from 'vitest';
import { container } from '../../../model/container';
import { MockField } from '../../testing-util/mocks/mock-field';
import { Focused, Validity } from '../../../model';
import { FinalizerValidity } from '../../../model/state/finalizer-validity.enum';
import { Visited } from '../../../model/state/visited.enum';
import { Modified } from '../../../model/state/modified.enum';

describe('DefaultFinalizer', () => {
  const finalizerFactory = container.services.FinalizerFactory;
  const finalizerValidityTranslator =
    container.services.FinalizerValidityTranslator;

  test('Subscribing to the stream returns finalizerState with undefined value if the field is not VALID_FINALIZABLE.', () => {
    const fieldA = new MockField('', Validity.INVALID);
    const expectedValidity =
      finalizerValidityTranslator.translateValidityToFinalizerValidity(
        fieldA.state.validity,
      );
    const expectedFinalizerState = {
      finalizerValidity: expectedValidity,
      visited: fieldA.state.visited,
      modified: fieldA.state.modified,
      focused: fieldA.state.focused
    };
    const defaultFinalizer = finalizerFactory.createDefaultFinalizer(fieldA);
    defaultFinalizer.stream.subscribe(finalizerState => {
      expect(finalizerState).toStrictEqual(expectedFinalizerState);
    });
  });

  test('Subscribing to the stream returns finalizerState with value if the field is VALID_FINALIZABLE.', () => {
    const fieldA = new MockField('test', Validity.VALID_FINALIZABLE);
    const expectedFinalizerState = {
      value: fieldA.state.value,
      finalizerValidity: FinalizerValidity.VALID_FINALIZED,
      visited: fieldA.state.visited,
      modified: fieldA.state.modified,
      focused: fieldA.state.focused
    };
    const defaultFinalizer = finalizerFactory.createDefaultFinalizer(fieldA);
    defaultFinalizer.stream.subscribe(finalizerState => {
      expect(finalizerState).toStrictEqual(expectedFinalizerState);
    });
  });

  test("It emits a new value when it receives a new value from its base field's stateChanges subject.", () => {
    const fieldA = new MockField('', Validity.INVALID);
    const defaultFinalizer = finalizerFactory.createDefaultFinalizer(fieldA);

    fieldA.setState({
      value: 'test',
      validity: Validity.VALID_FINALIZABLE,
      visited: Visited.YES,
      modified: Modified.YES,
      focused: Focused.YES,
      messages: [],
    });

    const expectedFinalizerState = {
      value: 'test',
      finalizerValidity: FinalizerValidity.VALID_FINALIZED,
      visited: Visited.YES,
      modified: Modified.YES,
      focused : Focused.YES
    };

    defaultFinalizer.stream.subscribe(finalizerState => {
      expect(finalizerState).toStrictEqual(expectedFinalizerState);
    });
  });
});
