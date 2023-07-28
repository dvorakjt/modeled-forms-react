import { describe, test, expect, afterEach, vi } from 'vitest';
import { SubscriptionManager } from '../../../model/types/subscriptions/subscription-manager.interface';
import { FieldImpl } from '../../../model/fields/field-impl';
import { SyncSingleInputValidatorSuite } from '../../../model/validators/single-input/sync-single-input-validator-suite';
import { SubscriptionManagerImpl } from '../../../model/subscriptions/subscription-manager-impl';
import { MultiFieldAggregatorStub } from '../stub/multi-field-aggregator.stub';
import { SyncAdapterFn } from '../../../model/types/adapters/sync-adapter-fn.type';
import { Validity } from '../../../model/types/state/validity.enum';
import { copyObject } from '../../../model/util/copy-object';
import { FormElementMap } from '../../../model/types/form-elements/form-element-map.type';
import { AggregatedStateChanges } from '../../../model/types/aggregators/aggregated-state-changes.interface';
import { Subject } from 'rxjs';
import { AsyncAdapter } from '../../../model/adapters/async-adapter';
import { Message } from '../../../model/types/state/messages/message.interface';

describe('AsyncAdapter', () => {
  const subscriptionManager: SubscriptionManager =
    new SubscriptionManagerImpl();
  const fields = {
    testField: new FieldImpl(
      new SyncSingleInputValidatorSuite([]),
      'test',
      subscriptionManager,
      false,
    ),
  };
  const syncAdapterFn: SyncAdapterFn<typeof fields, string> = ({
    testField,
  }) => {
    return testField.value.toUpperCase();
  };

  afterEach(() => {
    subscriptionManager.unsubscribeAll();
  });

  test('stream emits a new value when the aggregator emits a new value and the adapterFn emits a new value.', () => {
    const multiFieldAggregator = new MultiFieldAggregatorStub<typeof fields>(
      subscriptionManager,
    );
    const trigger = new Subject<void>();
    const asyncAdapterFn = triggerableAsyncAdapter(trigger, syncAdapterFn);
    const adapter = new AsyncAdapter<typeof fields, string>(
      multiFieldAggregator,
      asyncAdapterFn,
      subscriptionManager,
    );
    multiFieldAggregator.aggregateChanges.next({
      testField: {
        value: 'new value',
        validity: Validity.VALID_FINALIZABLE,
        messages: [] as Array<Message>,
      },
      overallValidity: Validity.VALID_FINALIZABLE,
      hasOmittedFields: false,
    });
    trigger.next();
    adapter.stream.subscribe(next => {
      expect(next).toBe('NEW VALUE');
    });
  });

  test('stream emits an error when the aggregator emits a new value and the adapterFn emits an error.', () => {
    const multiFieldAggregator = new MultiFieldAggregatorStub<typeof fields>(
      subscriptionManager,
    );
    const trigger = new Subject<void>();
    const asyncAdapterFn = triggerableAsyncAdapter(trigger, syncAdapterFn);
    const adapter = new AsyncAdapter<typeof fields, string>(
      multiFieldAggregator,
      asyncAdapterFn,
      subscriptionManager,
    );
    multiFieldAggregator.aggregateChanges.next({
      testField: {
        value: 'new value',
        validity: Validity.VALID_FINALIZABLE,
        messages: [] as Array<Message>,
      },
      overallValidity: Validity.VALID_FINALIZABLE,
      hasOmittedFields: false,
    });
    const expectedError = new Error('expected error');
    trigger.error(expectedError);
    adapter.stream.subscribe({
      error: e => {
        expect(e).toBe(expectedError);
      },
    });
  });

  test('adapterSubscription should be unsubscribed from when a new run of the adapter is spawned.', () => {
    const multiFieldAggregator = new MultiFieldAggregatorStub<typeof fields>(
      subscriptionManager,
    );
    const trigger = new Subject<void>();
    const asyncAdapterFn = triggerableAsyncAdapter(trigger, syncAdapterFn);
    const adapter = new AsyncAdapter<typeof fields, string>(
      multiFieldAggregator,
      asyncAdapterFn,
      subscriptionManager,
    );
    multiFieldAggregator.aggregateChanges.next({
      testField: {
        value: 'new value 1',
        validity: Validity.VALID_FINALIZABLE,
        messages: [] as Array<Message>,
      },
      overallValidity: Validity.VALID_FINALIZABLE,
      hasOmittedFields: false,
    });
    const expectedSubscriptionCount = subscriptionManager.count;
    multiFieldAggregator.aggregateChanges.next({
      testField: {
        value: 'new value 2',
        validity: Validity.VALID_FINALIZABLE,
        messages: [] as Array<Message>,
      },
      overallValidity: Validity.VALID_FINALIZABLE,
      hasOmittedFields: false,
    });
    multiFieldAggregator.aggregateChanges.next({
      testField: {
        value: 'new value 3',
        validity: Validity.VALID_FINALIZABLE,
        messages: [] as Array<Message>,
      },
      overallValidity: Validity.VALID_FINALIZABLE,
      hasOmittedFields: false,
    });
    expect(subscriptionManager.count).toBe(expectedSubscriptionCount);
    trigger.next();
    adapter.stream.subscribe(next => {
      expect(next).toBe('NEW VALUE 3');
    });
  });

  test('it logs an error when an error is thrown in development mode.', () => {
    const originalProcess = copyObject(process.env);
    process.env = {
      ...process.env,
      NODE_ENV: 'development',
    };
    console.error = vi.fn();
    const multiFieldAggregator = new MultiFieldAggregatorStub<typeof fields>(
      subscriptionManager,
    );
    const trigger = new Subject<void>();
    const asyncAdapterFn = triggerableAsyncAdapter(trigger, syncAdapterFn);
    const adapter = new AsyncAdapter<typeof fields, string>(
      multiFieldAggregator,
      asyncAdapterFn,
      subscriptionManager,
    );
    multiFieldAggregator.aggregateChanges.next({
      testField: {
        value: 'new value',
        validity: Validity.VALID_FINALIZABLE,
        messages: [] as Array<Message>,
      },
      overallValidity: Validity.VALID_FINALIZABLE,
      hasOmittedFields: false,
    });
    trigger.error(new Error('error'));
    adapter.stream.subscribe({
      error: () => {
        expect(console.error).toHaveBeenCalled();
        process.env = originalProcess;
      },
    });
  });
});

function triggerableAsyncAdapter<Fields extends FormElementMap, V>(
  subject: Subject<void>,
  adapterFn: SyncAdapterFn<Fields, V>,
) {
  return (valueToAdapt: AggregatedStateChanges<Fields>) => {
    return new Promise<V>((resolve, reject) => {
      subject.subscribe({
        next: () => resolve(adapterFn(valueToAdapt)),
        error: e => reject(e),
      });
    });
  };
}
