import { ManagedSubject } from "../../subscriptions/managed-subject";
import { FormElementMap } from "../form-elements/form-element-map.type";
import { AggregatedStateChanges } from "./aggregated-state-changes.interface";

export interface MultiFieldAggregator<Fields extends FormElementMap> {
  aggregateChanges : ManagedSubject<AggregatedStateChanges<Fields>>;
}