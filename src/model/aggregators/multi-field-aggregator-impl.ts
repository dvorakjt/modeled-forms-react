import { BehaviorSubject } from "rxjs";
import { AggregatedStateChangesProxyFactory } from "../proxies/aggregated-state-changes-proxy-factory";
import { ManagedSubject } from "../subscriptions/managed-subject";
import { AggregatedStateChanges } from "../types/aggregators/aggregated-state-changes.interface";
import { MultiFieldAggregator } from "../types/aggregators/multi-field-aggregator.interface";
import { FormElementMap } from "../types/form-elements/form-element-map.type";
import { FieldValidityReducer } from "../types/reducers/field-validity-reducer.interface";
import { SubscriptionManager } from "../types/subscriptions/subscription-manager.interface";
import { AnyState } from "../types/state/any-state.type";

export class MultiFieldAggregatorImpl<Fields extends FormElementMap> implements MultiFieldAggregator<Fields> {
  aggregateChanges: ManagedSubject<AggregatedStateChanges<Fields>>;
  accessedFieldsSubscriptionProcessCompleted = false;
  fields : Fields;
  accessedFields = new Set<string>();
  fieldValidityReducer : FieldValidityReducer;
  omittedFields = new Set();
  aggregatedFieldState : { 
    [key : string] : AnyState
  }= {};

  get aggregatedFieldStateAndTallies() {
    return {
      ...this.aggregatedFieldState,
      overallValidity: this.fieldValidityReducer.validity,
      hasOmittedFields: this.omittedFields.size > 0
    } as AggregatedStateChanges<Fields>
  }

  constructor(fields : Fields, fieldValidityReducer : FieldValidityReducer, subscriptionManager : SubscriptionManager) {
    this.fields = fields;
    this.fieldValidityReducer = fieldValidityReducer;
    const aggregatedStateProxy = AggregatedStateChangesProxyFactory.fromFields<Fields>(this.fields, this.accessedFields);
    this.aggregateChanges = subscriptionManager.registerSubject(new BehaviorSubject(aggregatedStateProxy), this.subscribeToAccessedFields);
  }

  subscribeToAccessedFields = () => {
    if(this.accessedFieldsSubscriptionProcessCompleted === true) return;

    for(const fieldName of this.accessedFields) {
      this.fields[fieldName].stateChanges.subscribe(stateChange => {
        this.aggregatedFieldState[fieldName] = stateChange;
        this.fieldValidityReducer.updateTallies(fieldName, stateChange.validity);
        if(stateChange.omit) this.omittedFields.add(fieldName);
        else this.omittedFields.delete(fieldName);
        if(this.accessedFieldsSubscriptionProcessCompleted) {
          this.aggregateChanges.next(this.aggregatedFieldStateAndTallies);
        }
      });
    }

    this.accessedFields.clear();
    this.accessedFieldsSubscriptionProcessCompleted = true;
  }
}