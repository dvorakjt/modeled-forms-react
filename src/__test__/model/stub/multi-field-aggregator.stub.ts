import { ReplaySubject } from "rxjs";
import { ManagedSubject } from "../../../model/subscriptions/managed-subject";
import { AggregatedStateChanges } from "../../../model/types/aggregators/aggregated-state-changes.interface";
import { MultiFieldAggregator } from "../../../model/types/aggregators/multi-field-aggregator.interface";
import { FormElementMap } from "../../../model/types/form-elements/form-element-map.type";
import { SubscriptionManager } from "../../../model/types/subscriptions/subscription-manager.interface";

export class MultiFieldAggregatorStub<Fields extends FormElementMap> implements MultiFieldAggregator<Fields> {
  aggregateChanges: ManagedSubject<AggregatedStateChanges<Fields>>;

  constructor(subscriptionManager : SubscriptionManager) {
    this.aggregateChanges = subscriptionManager.registerSubject(new ReplaySubject<AggregatedStateChanges<Fields>>());
  }
}