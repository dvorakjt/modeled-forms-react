import { Observable } from "rxjs";
import { AggregatedStateChanges } from "../aggregators/aggregated-state-changes.interface";
import { FormElementMap } from "../form-elements/form-element-map.type";

export type AsyncAdapterFn<Fields extends FormElementMap, V> = (valueToAdapt : AggregatedStateChanges<Fields>) => Promise<V> | Observable<V>;