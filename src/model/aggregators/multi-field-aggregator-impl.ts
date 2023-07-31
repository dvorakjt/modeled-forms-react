import { BehaviorSubject } from 'rxjs';
import type { AggregatedStateChanges } from '../types/aggregators/aggregated-state-changes.interface';
import type { MultiFieldAggregator } from '../types/aggregators/multi-field-aggregator.interface';
import type { FormElementMap } from '../types/form-elements/form-element-map.type';
import type { FieldStateReducer } from '../types/reducers/field-state-reducer.interface';
import type { ManagedObservableFactory } from '../types/subscriptions/managed-observable-factory.interface';
import type { AnyState } from '../types/state/any-state.type';
import type { OnInitialSubscriptionHandlingBehaviorSubject } from '../types/subscriptions/on-initial-subscription-handling-behavior-subject.interface';
import type { AggregatedStateChangesProxyProducer } from '../types/proxies/aggregated-state-changes-proxy-producer.interface';
import type { OneTimeValueEmitter } from '../types/subscriptions/one-time-value-emitter.interface';

export class MultiFieldAggregatorImpl<Fields extends FormElementMap>
  implements MultiFieldAggregator<Fields>
{
  readonly aggregateChanges: OnInitialSubscriptionHandlingBehaviorSubject<
    AggregatedStateChanges<Fields>
  >;
  readonly accessedFields : OneTimeValueEmitter<Set<string>>;
  readonly #fields: Fields;
  readonly #fieldStateReducer: FieldStateReducer;
  readonly #aggregatedFieldState: {
    [key: string]: AnyState;
  } = {};
  #aggregatedStateChangesProxyProducer: AggregatedStateChangesProxyProducer | null;
  #accessedFieldsSubscriptionProcessCompleted = false;

  get aggregatedStateChanges() {
    return {
      ...this.#aggregatedFieldState,
      overallValidity: this.#fieldStateReducer.validity,
      hasOmittedFields: this.#fieldStateReducer.omit,
    } as AggregatedStateChanges<Fields>;
  }

  constructor(
    fields: Fields,
    aggregatedStateChangesProxyProducer: AggregatedStateChangesProxyProducer,
    fieldStateReducer: FieldStateReducer,
    managedObservableFactory: ManagedObservableFactory,
    accessedFields : OneTimeValueEmitter<Set<string>>
  ) {
    this.#fields = fields;
    this.#aggregatedStateChangesProxyProducer =
      aggregatedStateChangesProxyProducer;
    this.#fieldStateReducer = fieldStateReducer;
    this.aggregateChanges =
      managedObservableFactory.createOnInitialSubscriptionHandlingBehaviorSubject(
        new BehaviorSubject(
          this.#aggregatedStateChangesProxyProducer.getProxy(this.#fields),
        ),
      );
    this.accessedFields = accessedFields;
    this.aggregateChanges.onInitialSubscription(this.subscribeToAccessedFields);
  }

  private subscribeToAccessedFields = () => {
    if(this.#accessedFieldsSubscriptionProcessCompleted || !this.#aggregatedStateChangesProxyProducer) return;

    const accessedFieldNames =
      this.#aggregatedStateChangesProxyProducer.accessedFieldNames;

    for (const fieldName of accessedFieldNames) {
      this.#fields[fieldName].stateChanges.subscribe(
        (stateChange: AnyState) => {
          this.#aggregatedFieldState[fieldName] = stateChange;
          this.#fieldStateReducer.updateTallies(fieldName, stateChange);
          if (this.#accessedFieldsSubscriptionProcessCompleted) {
            this.aggregateChanges.next(this.aggregatedStateChanges);
          }
        },
      );
    }

    this.accessedFields.setValue(accessedFieldNames);
    this.#aggregatedStateChangesProxyProducer = null;
    this.#accessedFieldsSubscriptionProcessCompleted = true;
  };
}
