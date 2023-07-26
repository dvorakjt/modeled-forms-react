import { FieldValidityReducerImpl } from "../reducers/field-validity-reducer-impl";
import { AggregatedStateChanges } from "../types/aggregators/aggregated-state-changes.interface";
import { FormElementMap } from "../types/form-elements/form-element-map.type";
import { AnyState } from "../types/state/any-state.type";

export class AggregatedStateChangesProxyFactory {
  static fromFields<Fields extends FormElementMap>(fields : Fields, accessedFields : Set<string>) {
    const aggregatedState : {
      [key : string] : AnyState
    } = {};
    for(const key in fields) {
      aggregatedState[key as keyof typeof aggregatedState] = fields[key].state
    }

    const fieldValidityReducer = new FieldValidityReducerImpl();
    const omittedFields = new Set<string>();

    return new Proxy(aggregatedState, {
      get(target, prop) {
        if(prop === 'overallValidity') return fieldValidityReducer.validity;
        else if(prop === 'hasOmittedFields') return omittedFields.size > 0;
        else {
          const propName = prop.toString();
          if(!(prop in fields)) throw new Error(`Property ${propName} does not exist in AggregateStateChanges object.`);

          accessedFields.add(propName);
          const field = target[propName];
          fieldValidityReducer.updateTallies(propName, field.validity);
          field.omit && omittedFields.add(propName);

          return target[propName];
        }
      }
    }) as AggregatedStateChanges<Fields>;
  }
}