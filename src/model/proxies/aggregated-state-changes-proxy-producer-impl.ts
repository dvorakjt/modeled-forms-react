import type { AggregatedStateChanges } from '../aggregators/aggregated-state-changes.interface';
import type { FormElementMap } from '../form-elements/form-element-map.type';
import type { AggregatedStateChangesProxyProducer } from './aggregated-state-changes-proxy-producer.interface';
import type { FieldStateReducer } from '../reducers/field-state/field-state-reducer.interface';
import type { AnyState } from '../state/any-state.type';

export class AggregatedStateChangesProxyProducerImpl
  implements AggregatedStateChangesProxyProducer
{
  readonly accessedFieldNames = new Set<string>();
  readonly fieldStateReducer: FieldStateReducer;

  constructor(fieldStateReducer: FieldStateReducer) {
    this.fieldStateReducer = fieldStateReducer;
  }

  getProxy(
    fields: FormElementMap,
  ): AggregatedStateChanges {
    const aggregatedState: {
      [key: string]: AnyState;
    } = {};
    for (const key in fields) {
      aggregatedState[key] = fields[key].state;
    }

    const fieldStateReducer = this.fieldStateReducer;
    const accessedFieldNames = this.accessedFieldNames;

    return new Proxy(aggregatedState, {
      get(target, prop) {
        if (prop === 'overallValidity') return fieldStateReducer.validity;
        else if (prop === 'hasOmittedFields') return fieldStateReducer.omit;
        else {
          const propName = prop.toString();
          if (!(prop in fields) || propName === 'constructor') return target[propName];

          accessedFieldNames.add(propName);
          const state = target[propName];
          fieldStateReducer.updateTallies(propName, state);

          return target[propName];
        }
      },
    }) as AggregatedStateChanges;
  }
}
