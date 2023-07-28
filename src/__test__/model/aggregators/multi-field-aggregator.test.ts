import { describe, test, expect, afterEach, vi, beforeEach } from 'vitest';
import { MultiFieldAggregator } from '../../../model/types/aggregators/multi-field-aggregator.interface';
import { FormElementMap } from '../../../model/types/form-elements/form-element-map.type';
import { SubscriptionManagerImpl } from '../../../model/subscriptions/subscription-manager-impl';
import { FieldImpl } from '../../../model/fields/field-impl';
import { SyncSingleInputValidatorSuite } from '../../../model/validators/single-input/sync-single-input-validator-suite';
import { SubscriptionManager } from '../../../model/types/subscriptions/subscription-manager.interface';
import { MultiFieldAggregatorImpl } from '../../../model/aggregators/multi-field-aggregator-impl';
import { FieldValidityReducerImpl } from '../../../model/reducers/field-validity-reducer-impl';
import { AggregatedStateChanges } from '../../../model/types/aggregators/aggregated-state-changes.interface';
import { Field } from '../../../model/types/fields/field.interface';
import { Validity } from '../../../model/types/state/validity.enum';

describe('MultiFieldAggregator', () => {
  let multiFieldAggregator: any;
  let subscriptionManager: SubscriptionManager;
  let fields: FormElementMap;

  beforeEach(() => {
    subscriptionManager = new SubscriptionManagerImpl();
    fields = {
      fieldA: getSimpleField(subscriptionManager),
      fieldB: getSimpleField(subscriptionManager),
      fieldC: getSimpleField(subscriptionManager),
    };
    multiFieldAggregator = new MultiFieldAggregatorImpl<typeof fields>(
      fields,
      new FieldValidityReducerImpl(),
      subscriptionManager,
    ) as MultiFieldAggregator<typeof fields>;
  });

  afterEach(() => {
    subscriptionManager.unsubscribeAll();
  });

  test('It subscribes to changes in accessed fields and emits new values only when those fields change.', () => {
    const receivedValues: Array<Array<string>> = [];
    const adapter = ({ fieldA, fieldB }: AggregatedStateChanges<any>) => {
      receivedValues.push([fieldA.value, fieldB.value]);
    };
    multiFieldAggregator.aggregateChanges.subscribe(adapter);
    (fields.fieldA as Field).setValue('a');
    (fields.fieldB as Field).setValue('b');
    (fields.fieldC as Field).setValue('c');
    (fields.fieldC as Field).setValue('cc');
    (fields.fieldC as Field).setValue('ccc');
    expect(receivedValues).toStrictEqual([
      ['', ''],
      ['a', ''],
      ['a', 'b'],
    ]);
  });

  test('It only subscribes to each field once, even if it is subscribed to more than once.', () => {
    vi.spyOn(fields.fieldA.stateChanges, 'subscribe');
    vi.spyOn(fields.fieldB.stateChanges, 'subscribe');
    const adapter = ({ fieldA, fieldB }: AggregatedStateChanges<any>) => {
      return [fieldA, fieldB];
    };
    multiFieldAggregator.aggregateChanges.subscribe(adapter);
    multiFieldAggregator.aggregateChanges.subscribe(adapter);
    multiFieldAggregator.aggregateChanges.subscribe(adapter);
    expect(fields.fieldA.stateChanges.subscribe).toHaveBeenCalledOnce();
    expect(fields.fieldB.stateChanges.subscribe).toHaveBeenCalledOnce();
  });

  test('It updates hasOmittedFields when field.omit is true.', () => {
    let updateCount = 0;
    const adapter = ({
      fieldA,
      hasOmittedFields,
    }: AggregatedStateChanges<any>) => {
      if (++updateCount === 2) {
        expect(fieldA.omit).toBe(true);
        expect(hasOmittedFields).toBe(true);
      }
    };
    multiFieldAggregator.aggregateChanges.subscribe(adapter);
    fields.fieldA.omit = true;
  });

  test('It receives the correct overallValidity and hasOmittedFields at the time of subscription', () => {
    fields = {
      fieldA: getSimpleField(subscriptionManager),
      fieldB: getSimpleField(subscriptionManager),
      fieldC: getSimpleField(subscriptionManager),
      fieldD: getSimpleField(subscriptionManager),
    };
    (fields.fieldB as Field).setState({
      value: '',
      validity: Validity.INVALID,
      messages: [],
    });
    (fields.fieldC as Field).setState({
      value: '',
      validity: Validity.ERROR,
      messages: [],
    });
    fields.fieldD.omit = true;
    multiFieldAggregator = new MultiFieldAggregatorImpl<typeof fields>(
      fields,
      new FieldValidityReducerImpl(),
      subscriptionManager,
    ) as MultiFieldAggregator<typeof fields>;
    const adapter = ({
      fieldA,
      fieldB,
      hasOmittedFields,
      overallValidity,
    }: AggregatedStateChanges<any>) => {
      expect(fieldA.validity).toBe(Validity.VALID_FINALIZABLE);
      expect(fieldB.validity).toBe(Validity.INVALID);
      expect(hasOmittedFields).toBe(false);
      expect(overallValidity).toBe(Validity.INVALID);
    };
    multiFieldAggregator.aggregateChanges.subscribe(adapter);
  });
});

function getSimpleField(subscriptionManager: SubscriptionManager): Field {
  return new FieldImpl(
    new SyncSingleInputValidatorSuite([]),
    '',
    subscriptionManager,
    false,
  );
}
