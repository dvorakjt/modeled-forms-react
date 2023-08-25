import type { AggregatedStateChanges } from './aggregated-state-changes.interface';
import type { MultiFieldAggregator } from './multi-field-aggregator.interface';
import type { FormElementDictionary } from '../form-elements/form-element-dictionary.type';
import type { FieldStateReducer } from '../reducers/field-state/field-state-reducer.interface';
import type { AnyState } from '../state/any-state.type';
import type { OnInitialSubscriptionHandlingBehaviorSubject } from '../subjects/on-initial-subscription-handling-behavior-subject.interface';
import type { AggregatedStateChangesProxyProducer } from '../proxies/aggregated-state-changes-proxy-producer.interface';
import type { OneTimeValueEmitter } from '../emitters/one-time-value-emitter.interface';
import type { SubjectFactory } from '../subjects/subject-factory.interface';

export class MultiFieldAggregatorImpl implements MultiFieldAggregator {
  readonly aggregateChanges: OnInitialSubscriptionHandlingBehaviorSubject<AggregatedStateChanges>;
  readonly accessedFields: OneTimeValueEmitter<Set<string>>;
  readonly #fields: FormElementDictionary;
  readonly #fieldStateReducer: FieldStateReducer;
  readonly #aggregatedFieldState: {
    [key: string]: AnyState;
  } = {};
  #aggregatedStateChangesProxyProducer: AggregatedStateChangesProxyProducer | null;
  #accessedFieldsSubscriptionProcessCompleted = false;

  get aggregatedStateChanges() {
    return {
      ...this.#aggregatedFieldState,
      overallValidity: () => this.#fieldStateReducer.validity,
      hasOmittedFields: () => this.#fieldStateReducer.omit,
    } as AggregatedStateChanges;
  }

  constructor(
    fields: FormElementDictionary,
    aggregatedStateChangesProxyProducer: AggregatedStateChangesProxyProducer,
    fieldStateReducer: FieldStateReducer,
    accessedFields: OneTimeValueEmitter<Set<string>>,
    subjectFactory: SubjectFactory,
  ) {
    this.#fields = fields;
    this.#aggregatedStateChangesProxyProducer =
      aggregatedStateChangesProxyProducer;
    this.#fieldStateReducer = fieldStateReducer;
    this.aggregateChanges =
      subjectFactory.createOnInitialSubscriptionHandlingBehaviorSubject(
        this.#aggregatedStateChangesProxyProducer.getProxy(this.#fields),
      );
    this.accessedFields = accessedFields;
    this.aggregateChanges.onInitialSubscription(this.subscribeToAccessedFields);
  }

  private subscribeToAccessedFields = () => {
    if (
      !this.#accessedFieldsSubscriptionProcessCompleted &&
      this.#aggregatedStateChangesProxyProducer
    ) {
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
