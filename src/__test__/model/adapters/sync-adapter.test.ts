import { describe, test, expect, afterEach, vi, } from "vitest";
import { MultiFieldAggregator } from "../../../model/types/aggregators/multi-field-aggregator.interface";
import { Adapter } from "../../../model/types/adapters/adapter.interface";
import { SubscriptionManager } from "../../../model/types/subscriptions/subscription-manager.interface";
import { FieldImpl } from "../../../model/fields/field-impl";
import { SyncSingleInputValidatorSuite } from "../../../model/validators/single-input/sync-single-input-validator-suite";
import { SubscriptionManagerImpl } from "../../../model/subscriptions/subscription-manager-impl";
import { MultiFieldAggregatorStub } from "../stub/multi-field-aggregator.stub";
import { SyncAdapter } from "../../../model/adapters/sync-adapter";
import { SyncAdapterFn } from "../../../model/types/adapters/sync-adapter-fn.type";
import { Validity } from "../../../model/types/state/validity.enum";
import { AnyState } from "../../../model/types/state/any-state.type";
import { copyObject } from "../../../model/util/copy-object";

describe('SyncAdapter', () => {
  const subscriptionManager : SubscriptionManager = new SubscriptionManagerImpl();
  const fields = {
    testField : new FieldImpl(
      new SyncSingleInputValidatorSuite([]),
      'test',
      subscriptionManager,
      false
    )
  }
  const adapterFn : SyncAdapterFn<typeof fields, string> = ({testField}) => {
    return testField.value.toUpperCase();
  };
  const failingAdapterFn = (() => {
    throw new Error('failing adapter fn');
  }) as SyncAdapterFn<typeof fields, string>;
  let multiFieldAggregator : MultiFieldAggregator<typeof fields>;
  let adapter : Adapter<string>;

  afterEach(() => {
    subscriptionManager.unsubscribeAll();
  });

  test('it should produce a new value when it receives a new value from the aggregator.', () => {
    multiFieldAggregator = new MultiFieldAggregatorStub<typeof fields>(subscriptionManager);
    adapter = new SyncAdapter(
      adapterFn,
      multiFieldAggregator,
      subscriptionManager
    )
    const newValue : AnyState = {
      value : 'new value',
      validity : Validity.VALID_FINALIZABLE,
      messages: []
    }
    multiFieldAggregator.aggregateChanges.next({
      overallValidity : Validity.VALID_FINALIZABLE,
      hasOmittedFields : false,
      testField : newValue
    });
    adapter.stream.subscribe(next => {
      expect(next).toBe('NEW VALUE');
    });
  });

  test('it should emit an error when the adapterFn throws an error.', () => {
    multiFieldAggregator = new MultiFieldAggregatorStub<typeof fields>(subscriptionManager);
    adapter = new SyncAdapter(
      failingAdapterFn,
      multiFieldAggregator,
      subscriptionManager
    )
    const newValue : AnyState = {
      value : 'failing value',
      validity : Validity.VALID_FINALIZABLE,
      messages: []
    }
    multiFieldAggregator.aggregateChanges.next({
      overallValidity : Validity.VALID_FINALIZABLE,
      hasOmittedFields : false,
      testField : newValue
    });
    adapter.stream.subscribe({
      error : e => {
        expect(e.message).toBe('failing adapter fn')
      }
    });
  });

  test('it should log an error when the adapterFn throws an error in development mode.', () => {
    const originalProcess = copyObject(process.env);
    process.env = {
      ...process.env,
      NODE_ENV : 'development'
    }
    console.error = vi.fn();
    multiFieldAggregator = new MultiFieldAggregatorStub<typeof fields>(subscriptionManager);
    adapter = new SyncAdapter(
      failingAdapterFn,
      multiFieldAggregator,
      subscriptionManager
    );
    const newValue : AnyState = {
      value : 'failing value',
      validity : Validity.VALID_FINALIZABLE,
      messages: []
    }
    multiFieldAggregator.aggregateChanges.next({
      overallValidity : Validity.VALID_FINALIZABLE,
      hasOmittedFields : false,
      testField : newValue
    });
    expect(console.error).toHaveBeenCalled();
    process.env = originalProcess;
  });
});