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
  readonly _fields: FormElementDictionary;
  readonly _fieldStateReducer: FieldStateReducer;
  readonly _aggregatedFieldState: {
    [key: string]: AnyState;
  } = {};
  _aggregatedStateChangesProxyProducer: AggregatedStateChangesProxyProducer | null;
  _accessedFieldsSubscriptionProcessCompleted = false;

  get aggregatedStateChanges() {
    return {
      ...this._aggregatedFieldState,
      overallValidity: () => this._fieldStateReducer.validity,
      hasOmittedFields: () => this._fieldStateReducer.omit,
      visited: () => this._fieldStateReducer.visited,
      modified: () => this._fieldStateReducer.modified,
      focused: () => this._fieldStateReducer.focused
    } as AggregatedStateChanges;
  }

  constructor(
    fields: FormElementDictionary,
    aggregatedStateChangesProxyProducer: AggregatedStateChangesProxyProducer,
    fieldStateReducer: FieldStateReducer,
    accessedFields: OneTimeValueEmitter<Set<string>>,
    subjectFactory: SubjectFactory,
  ) {
    this._fields = fields;
    this._aggregatedStateChangesProxyProducer =
      aggregatedStateChangesProxyProducer;
    this._fieldStateReducer = fieldStateReducer;
    this.aggregateChanges =
      subjectFactory.createOnInitialSubscriptionHandlingBehaviorSubject(
        this._aggregatedStateChangesProxyProducer.getProxy(this._fields),
      );
    this.accessedFields = accessedFields;
    this.aggregateChanges.onInitialSubscription(
      this._subscribeToAccessedFields,
    );
  }

  _subscribeToAccessedFields = () => {
    if (
      !this._accessedFieldsSubscriptionProcessCompleted &&
      this._aggregatedStateChangesProxyProducer
    ) {
      const accessedFieldNames =
        this._aggregatedStateChangesProxyProducer.accessedFieldNames;

      for (const fieldName of accessedFieldNames) {
        this._fields[fieldName].stateChanges.subscribe(
          (stateChange: AnyState) => {
            this._aggregatedFieldState[fieldName] = stateChange;
            this._fieldStateReducer.updateTallies(fieldName, stateChange);
            if (this._accessedFieldsSubscriptionProcessCompleted) {
              this.aggregateChanges.next(this.aggregatedStateChanges);
            }
          },
        );
      }

      this.accessedFields.setValue(accessedFieldNames);
      this._aggregatedStateChangesProxyProducer = null;
      this._accessedFieldsSubscriptionProcessCompleted = true;
    }
  };
}
