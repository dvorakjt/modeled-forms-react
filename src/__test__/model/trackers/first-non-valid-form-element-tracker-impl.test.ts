import { describe, test, expect, beforeEach } from 'vitest';
import { FirstNonValidFormElementTrackerImpl } from '../../../model/trackers/first-nonvalid-form-element-tracker-impl';
import { container } from '../../../model/container';
import { FirstNonValidFormElementTracker } from '../../../model/trackers/first-nonvalid-form-element-tracker.interface';
import { MockField } from '../../util/mocks/mock-field';
import { FieldState, Validity } from '../../../model';

describe('FirstNonValidFormElementTrackerImpl', () => {
    let firstNonValidFormElemenetTracker: FirstNonValidFormElementTracker;

    beforeEach(() => {
        firstNonValidFormElemenetTracker = new FirstNonValidFormElementTrackerImpl(
            container.services.InsertionOrderHeapFactory.createInsertionOrderHeap()
        );
    });

    test('When no items are added, firstNonValidFormElement returns undefined.', () => {
        expect(firstNonValidFormElemenetTracker.firstNonValidFormElement).toBe(undefined);
    });

    test('When a single non-valid item is added, that item is returned by firstNonValidFormElement.', () => {
        const someField = new MockField('', Validity.INVALID);
        firstNonValidFormElemenetTracker.trackFormElementValidity('someField', someField);
        expect(firstNonValidFormElemenetTracker.firstNonValidFormElement).toBe('someField');
    });

    test('When a single valid item is added, firstNonValidFormElement returns undefined.', () => {
        const someValidField = new MockField('', Validity.VALID_FINALIZABLE);
        firstNonValidFormElemenetTracker.trackFormElementValidity('someValidField', someValidField);
        expect(firstNonValidFormElemenetTracker.firstNonValidFormElement).toBe(undefined);
    });

    test('When tracked fields become valid, the next non-valid tracked field is returned by firstNonValidFormElement.', () => {
        const fieldA = new MockField('', Validity.INVALID);
        const fieldB = new MockField('', Validity.INVALID);
        const fieldC = new MockField('', Validity.INVALID);

        firstNonValidFormElemenetTracker.trackFormElementValidity('fieldA', fieldA);
        firstNonValidFormElemenetTracker.trackFormElementValidity('fieldB', fieldB);
        firstNonValidFormElemenetTracker.trackFormElementValidity('fieldC', fieldC);

        const expectedNonValidFields = ['fieldA', 'fieldB', 'fieldC', undefined];
        let expectedNonValidFieldIndex = 0;

        firstNonValidFormElemenetTracker.firstNonValidFormElementChanges.subscribe(firstNonValidField => {
            console.log(firstNonValidField);
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
});