import { describe, test, expect, beforeEach } from 'vitest';
import { FirstNonValidFormElementTrackerImpl } from '../../../model/trackers/first-nonvalid-form-element-tracker-impl';
import { container } from '../../../model/container';
import { FirstNonValidFormElementTracker } from '../../../model/trackers/first-nonvalid-form-element-tracker.interface';
import { MockField } from '../../util/mocks/mock-field';
import { FieldState, Validity } from '../../../model';

describe('FirstNonValidFormElementTrackerImpl', () => {
  let firstNonValidFormElementTracker: FirstNonValidFormElementTracker;

  beforeEach(() => {
      firstNonValidFormElementTracker = new FirstNonValidFormElementTrackerImpl(
          container.services.InsertionOrderHeapFactory.createInsertionOrderHeap()
      );
  });

  test('When no items are added, firstNonValidFormElement returns undefined.', () => {
      expect(firstNonValidFormElementTracker.firstNonValidFormElement).toBe(undefined);
  });

  test('When a single non-valid item is added, that item is returned by firstNonValidFormElement.', () => {
      const someField = new MockField('', Validity.INVALID);
      firstNonValidFormElementTracker.trackFormElementValidity('someField', someField);
      expect(firstNonValidFormElementTracker.firstNonValidFormElement).toBe('someField');
  });

  test('When a single valid item is added, firstNonValidFormElement returns undefined.', () => {
      const someValidField = new MockField('', Validity.VALID_FINALIZABLE);
      firstNonValidFormElementTracker.trackFormElementValidity('someValidField', someValidField);
      expect(firstNonValidFormElementTracker.firstNonValidFormElement).toBe(undefined);
  });

  test('When tracked fields become valid, the next non-valid tracked field is returned by firstNonValidFormElement.', () => {
    const fieldA = new MockField('', Validity.INVALID);
    const fieldB = new MockField('', Validity.INVALID);
    const fieldC = new MockField('', Validity.INVALID);

    firstNonValidFormElementTracker.trackFormElementValidity('fieldA', fieldA);
    firstNonValidFormElementTracker.trackFormElementValidity('fieldB', fieldB);
    firstNonValidFormElementTracker.trackFormElementValidity('fieldC', fieldC);

    const expectedNonValidFields = ['fieldA', 'fieldB', 'fieldC', undefined];
    let expectedNonValidFieldIndex = 0;

    firstNonValidFormElementTracker.firstNonValidFormElementChanges.subscribe(firstNonValidField => {
        expect(firstNonValidField).toBe(expectedNonValidFields[expectedNonValidFieldIndex++]);
    });

    fieldA.setState({
        validity: Validity.VALID_FINALIZABLE
    } as FieldState);

    fieldB.setState({
        validity: Validity.VALID_FINALIZABLE
    } as FieldState);

    fieldC.setState({
      validity: Validity.VALID_FINALIZABLE
    } as FieldState);
  });

  test('When tracked fields become non-valid, firstNonValidFormElement is updated accordingly.', () => {
    const fieldA = new MockField('', Validity.VALID_FINALIZABLE);
    const fieldB = new MockField('', Validity.VALID_FINALIZABLE);
    const fieldC = new MockField('', Validity.VALID_FINALIZABLE);

    firstNonValidFormElementTracker.trackFormElementValidity('fieldA', fieldA);
    firstNonValidFormElementTracker.trackFormElementValidity('fieldB', fieldB);
    firstNonValidFormElementTracker.trackFormElementValidity('fieldC', fieldC);

    const expectedNonValidFields = [undefined, 'fieldC', 'fieldB', 'fieldA'];
    let expectedNonValidFieldIndex = 0;

    firstNonValidFormElementTracker.firstNonValidFormElementChanges.subscribe(firstNonValidField => {
      expect(firstNonValidField).toBe(expectedNonValidFields[expectedNonValidFieldIndex++]);
    });

    fieldC.setState({
      validity: Validity.INVALID
    } as FieldState);

    fieldB.setState({
      validity: Validity.INVALID
    } as FieldState);

    fieldA.setState({
        validity: Validity.INVALID
    } as FieldState);
  });
});