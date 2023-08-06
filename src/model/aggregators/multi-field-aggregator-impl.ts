import type { AggregatedStateChanges } from '../types/aggregators/aggregated-state-changes.interface';
import type { MultiFieldAggregator } from '../types/aggregators/multi-field-aggregator.interface';
import type { FormElementMap } from '../types/form-elements/form-element-map.type';
import type { FieldStateReducer } from '../types/reducers/field-state-reducer.interface';
import type { AnyState } from '../types/state/any-state.type';
import type { OnInitialSubscriptionHandlingBehaviorSubject } from '../types/subjects/on-initial-subscription-handling-behavior-subject.interface';
import type { AggregatedStateChangesProxyProducer } from '../types/proxies/aggregated-state-changes-proxy-producer.interface';
import type { OneTimeValueEmitter } from '../types/emitters/one-time-value-emitter.interface';
import type { SubjectFactory } from '../types/subjects/subject-factory.interface';

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
    accessedFields : OneTimeValueEmitter<Set<string>>,
    subjectFactory : SubjectFactory
  ) {
    this.#fields = fields;
    this.#aggregatedStateChangesProxyProducer =
      aggregatedStateChangesProxyProducer;
    this.#fieldStateReducer = fieldStateReducer;
    this.aggregateChanges = subjectFactory.createOnInitialSubscriptionHandlingBehaviorSubject(
      this.#aggregatedStateChangesProxyProducer.getProxy(this.#fields),
    );
    this.accessedFields = accessedFields;
    this.aggregateChanges.onInitialSubscription(this.subscribeToAccessedFields);
  }

  private subscribeToAccessedFields = () => {
    if(!this.#accessedFieldsSubscriptionProcessCompleted && this.#aggregatedStateChangesProxyProducer) {
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
    }
  };
}
