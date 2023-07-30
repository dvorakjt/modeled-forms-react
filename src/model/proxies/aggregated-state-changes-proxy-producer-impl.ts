import type { AggregatedStateChanges } from '../types/aggregators/aggregated-state-changes.interface';
import type { FormElementMap } from '../types/form-elements/form-element-map.type';
import type { AggregatedStateChangesProxyProducer } from '../types/proxies/aggregated-state-changes-proxy-producer.interface';
import type { FieldStateReducer } from '../types/reducers/field-state-reducer.interface';
import type { AnyState } from '../types/state/any-state.type';

export class AggregatedStateChangesProxyProducerImpl
  implements AggregatedStateChangesProxyProducer
{
  readonly accessedFieldNames = new Set<string>();
  readonly fieldStateReducer: FieldStateReducer;

  constructor(fieldStateReducer: FieldStateReducer) {
    this.fieldStateReducer = fieldStateReducer;
  }

  getProxy<Fields extends FormElementMap>(
    fields: Fields,
  ): AggregatedStateChanges<Fields> {
    const aggregatedState: {
      [key: string]: AnyState;
    } = {};
    for (const key in fields) {
      aggregatedState[key as keyof typeof aggregatedState] = fields[key].state;
    }

    const fieldStateReducer = this.fieldStateReducer;
    const accessedFieldNames = this.accessedFieldNames;

    return new Proxy(aggregatedState, {
      get(target, prop) {
        if (prop === 'overallValidity') return fieldStateReducer.validity;
        else if (prop === 'hasOmittedFields') return fieldStateReducer.omit;
        else {
          const propName = prop.toString();
          if (!(prop in fields))
            throw new Error(
              `Property ${propName} does not exist in AggregateStateChanges object.`,
            );

          accessedFieldNames.add(propName);
          const state = target[propName];
          fieldStateReducer.updateTallies(propName, state);

          return target[propName];
        }
      },
    }) as AggregatedStateChanges<Fields>;
  }

  clear() {
    this.accessedFieldNames.clear();
    this.fieldStateReducer.clear();
  }
}
