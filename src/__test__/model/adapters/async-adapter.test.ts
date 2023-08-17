import { describe, expect, test, vi } from "vitest";
import { getTestContainer } from "../test-container";
import { FormElementMap } from "../../../model/form-elements/form-element-map.type";
import { MockField } from "../../util/mocks/mock-field";
import { AggregatedStateChanges } from "../../../model/aggregators/aggregated-state-changes.interface";
import { AsyncAdapter } from "../../../model/adapters/async-adapter";
import { Observable, Subscription } from "rxjs";
import { AbstractField } from "../../../model/fields/base/abstract-field";

describe('AsyncAdapter', () => {
  const container = getTestContainer();
  const aggregatorFactory = container.services.AggregatorFactory;

  test('It emits adapted values through its stream property when the adapterFn resolves.', () => {
    const fields: FormElementMap = {
      fieldA: new MockField('a field'),
    };
    const adapterFn = ({ fieldA }: AggregatedStateChanges) => {
      return new Promise(resolve => {
        resolve(fieldA.value.toUpperCase());
      });
    };
    const syncAdapter = new AsyncAdapter(
      adapterFn,
      aggregatorFactory.createMultiFieldAggregatorFromFields(fields),
    );
    syncAdapter.stream.subscribe(value => expect(value).toBe('A FIELD'));
  });

  test('It emits errors through its stream property if they are thrown by the adapterFn outside of the Promise.', () => {
    const fields: FormElementMap = {
      fieldA: new MockField('a field'),
    };
    const expectedError = new Error();
    const adapterFn = () => {
      throw expectedError;
    };
    const syncAdapter = new AsyncAdapter(
      adapterFn,
      aggregatorFactory.createMultiFieldAggregatorFromFields(fields),
    );
    syncAdapter.stream.subscribe({
      error: err => {
        expect(err).toBe(expectedError);
      },
    });
  });

  test('It emits errors through its stream property if they are thrown by the adapterFn within the Promise.', () => {
    const fields: FormElementMap = {
      fieldA: new MockField('a field'),
    };
    const expectedError = new Error();
    const adapterFn = () => {
      return new Promise(() => {
        throw expectedError;
      });
    };
    const syncAdapter = new AsyncAdapter(
      adapterFn,
      aggregatorFactory.createMultiFieldAggregatorFromFields(fields),
    );
    syncAdapter.stream.subscribe({
      error: err => {
        expect(err).toBe(expectedError);
      },
    });
  });

  test('It emits errors through its stream property if the Promise is rejected.', () => {
    const fields: FormElementMap = {
      fieldA: new MockField('a field'),
    };
    const expectedError = new Error();
    const adapterFn = () => {
      return new Promise(() => {
        throw expectedError;
      });
    };
    const syncAdapter = new AsyncAdapter(
      adapterFn,
      aggregatorFactory.createMultiFieldAggregatorFromFields(fields),
    );
    syncAdapter.stream.subscribe({
      error: err => {
        expect(err).toBe(expectedError);
      },
    });
  });

  test('It emits adapted values through its stream property as they are emitted by the Observable returned by the adapterFn.', () => {
    const fields: FormElementMap = {
      fieldA: new MockField('test'),
    };
    const adapterFn = ({ fieldA }: AggregatedStateChanges) => {
      return new Observable(subscriber => {
        subscriber.next(fieldA.value.toUpperCase());
        subscriber.next(fieldA.value.split('').reverse().join(''));
        subscriber.complete();
      });
    };
    const syncAdapter = new AsyncAdapter(
      adapterFn,
      aggregatorFactory.createMultiFieldAggregatorFromFields(fields),
    );
    const expectedReturnValues = ['tset', 'A FIELD', 'dleif a'];
    let returnValueIndex = 0;
    syncAdapter.stream.subscribe(next => {
      expect(next).toBe(expectedReturnValues[returnValueIndex++]);
    });
    (fields.fieldA as AbstractField).setValue('a field');
  });

  test('It emits errors through its stream property as they are emitted by the Observable returned by the adapterFn.', () => {
    const fields: FormElementMap = {
      fieldA: new MockField('test'),
    };
    const expectedError = new Error();
    const adapterFn = () => {
      return new Observable(subscriber => {
        subscriber.error(expectedError);
        subscriber.complete();
      });
    };
    const syncAdapter = new AsyncAdapter(
      adapterFn,
      aggregatorFactory.createMultiFieldAggregatorFromFields(fields),
    );
    syncAdapter.stream.subscribe({
      error: err => {
        expect(err).toBe(expectedError);
      },
    });
  });

  test('It unsubscribes from a pending adapterFn when it receives a new value.', () => {
    const fields: FormElementMap = {
      fieldA: new MockField('test'),
    };
    vi.spyOn(Subscription.prototype, 'unsubscribe');
    const adapterFn = ({ fieldA } : AggregatedStateChanges) => new Promise((resolve) => {
      setTimeout(() => {
        resolve(fieldA.value.toUpperCase());
      }, 1000)
    });
    new AsyncAdapter(adapterFn, aggregatorFactory.createMultiFieldAggregatorFromFields(fields));
    (fields.fieldA as AbstractField).setValue('new value');
    expect(Subscription.prototype.unsubscribe).toHaveBeenCalledOnce();
  });
});
