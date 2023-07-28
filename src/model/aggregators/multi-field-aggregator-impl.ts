import { BehaviorSubject } from 'rxjs';
import { AggregatedStateChangesProxyFactory } from '../proxies/aggregated-state-changes-proxy-factory';
import type { AggregatedStateChanges } from '../types/aggregators/aggregated-state-changes.interface';
import type { MultiFieldAggregator } from '../types/aggregators/multi-field-aggregator.interface';
import type { FormElementMap } from '../types/form-elements/form-element-map.type';
import type { FieldValidityReducer } from '../types/reducers/field-validity-reducer.interface';
import type { ManagedObservableFactory } from '../types/subscriptions/managed-observable-factory.interface';
import type { AnyState } from '../types/state/any-state.type';
import type { OnInitialSubscriptionHandlingSubject } from '../types/subscriptions/on-initial-subscription-handling-subject.interface';

export class MultiFieldAggregatorImpl<Fields extends FormElementMap>
  implements MultiFieldAggregator<Fields>
{
  readonly aggregateChanges: OnInitialSubscriptionHandlingSubject<
    AggregatedStateChanges<Fields>
  >;
  accessedFieldsSubscriptionProcessCompleted = false;
  fields: Fields;
  accessedFields = new Set<string>();
  fieldValidityReducer: FieldValidityReducer;
  omittedFields = new Set();
  aggregatedFieldState: {
    [key: string]: AnyState;
  } = {};

  get aggregatedFieldStateAndTallies() {
    return {
      ...this.aggregatedFieldState,
      overallValidity: this.fieldValidityReducer.validity,
      hasOmittedFields: this.omittedFields.size > 0,
    } as AggregatedStateChanges<Fields>;
  }

  constructor(
    fields: Fields,
    fieldValidityReducer: FieldValidityReducer,
    managedObservableFactory: ManagedObservableFactory,
  ) {
    this.fields = fields;
    this.fieldValidityReducer = fieldValidityReducer;
    const aggregatedStateProxy =
      AggregatedStateChangesProxyFactory.fromFields<Fields>(
        this.fields,
        this.accessedFields,
      );
    this.aggregateChanges =
      managedObservableFactory.createOnInitialSubscriptionHandlingSubject(
        new BehaviorSubject(aggregatedStateProxy),
      );
    this.aggregateChanges.onInitialSubscription(this.subscribeToAccessedFields);
  }

  subscribeToAccessedFields = () => {
    if (this.accessedFieldsSubscriptionProcessCompleted === true) return;

    for (const fieldName of this.accessedFields) {
      this.fields[fieldName].stateChanges.subscribe((stateChange: AnyState) => {
        this.aggregatedFieldState[fieldName] = stateChange;
        this.fieldValidityReducer.updateTallies(
          fieldName,
          stateChange.validity,
        );
        if (stateChange.omit) this.omittedFields.add(fieldName);
        else this.omittedFields.delete(fieldName);
        if (this.accessedFieldsSubscriptionProcessCompleted) {
          this.aggregateChanges.next(this.aggregatedFieldStateAndTallies);
        }
      });
    }

    this.accessedFields.clear();
    this.accessedFieldsSubscriptionProcessCompleted = true;
  };
}
