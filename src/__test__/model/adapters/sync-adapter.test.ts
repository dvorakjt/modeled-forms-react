import { describe, expect, test } from "vitest";
import { getTestContainer, Services } from "../test-container";
import { AggregatorFactory } from "../../../model/types/constituents/aggregators/aggregator-factory.interface";
import { SyncAdapter } from "../../../model/constituents/adapters/sync-adapter";
import { FormElementMap } from "../../../model/types/constituents/form-elements/form-element-map.type";
import { MockField } from "../../util/mocks/mock-field";
import { AggregatedStateChanges } from "../../../model/types/constituents/aggregators/aggregated-state-changes.interface";

describe('SyncAdapter', () => {
  const container = getTestContainer();
  const aggregatorFactory = container.get<AggregatorFactory>(Services.AggregatorFactory);

  test('It emits adapted values through its stream property.', () => {
    const fields : FormElementMap = {
      fieldA : new MockField('a field')
    }
    const adapterFn = ({ fieldA } : AggregatedStateChanges<typeof fields>) => {
      return fieldA.value.toUpperCase();
    }
    const syncAdapter = new SyncAdapter(adapterFn, aggregatorFactory.createMultiFieldAggregatorFromFields(fields));
    syncAdapter.stream.subscribe(value => expect(value).toBe('A FIELD'));
  });

  test('It emits errors through its stream property if they are thrown by the adapterFn.', () => {
    const fields : FormElementMap = {
      fieldA : new MockField('a field')
    }
    const expectedError = new Error();
    const adapterFn = () => {
      throw expectedError;
    }
    const syncAdapter = new SyncAdapter(adapterFn, aggregatorFactory.createMultiFieldAggregatorFromFields(fields));
    syncAdapter.stream.subscribe({
      error : err => {
        expect(err).toBe(expectedError);
      }
    });
  });
});