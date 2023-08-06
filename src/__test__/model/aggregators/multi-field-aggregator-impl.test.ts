import { describe, test, expect, beforeEach, vi } from "vitest";
import { getTestContainer, Services } from "../test-container";
import { MultiFieldAggregatorImpl } from "../../../model/aggregators/multi-field-aggregator-impl";
import { MockField } from "../../util/mocks/mock-field";
import { AggregatedStateChangesProxyProducer } from "../../../model/types/proxies/aggregated-state-changes-proxy-producer.interface";
import { FieldStateReducer } from "../../../model/types/reducers/field-state-reducer.interface";
import { OneTimeValueEmitter } from "../../../model/types/emitters/one-time-value-emitter.interface";
import { SubjectFactory } from "../../../model/types/subjects/subject-factory.interface";
import { ProxyProducerFactory } from "../../../model/types/proxies/proxy-producer-factory.interface";
import { ReducerFactory } from "../../../model/types/reducers/reducer-factory.interface";
import { EmitterFactory } from "../../../model/types/emitters/emitter-factory.interface";
import { Validity } from "../../../model/types/state/validity.enum";
import { FormElementMap } from "../../../model/types/form-elements/form-element-map.type";

describe('MultiFieldAggregatorImpl', () => {
  const container = getTestContainer();
  const subjectFactory = container.get<SubjectFactory>(Services.SubjectFactory);
  const proxyProducerFactory = container.get<ProxyProducerFactory>(Services.ProxyProducerFactory);
  const reducerFactory = container.get<ReducerFactory>(Services.ReducerFactory);
  const emitterFactory = container.get<EmitterFactory>(Services.EmitterFactory);
  let aggregatedStateChangesProxyProducer : AggregatedStateChangesProxyProducer;
  let fieldStateReducer : FieldStateReducer;
  let accessedFields : OneTimeValueEmitter<Set<string>>;

  beforeEach(() => {
    aggregatedStateChangesProxyProducer = proxyProducerFactory.createAggregatedStateChangesProxyProducer();
    fieldStateReducer = reducerFactory.createFieldStateReducer();
    accessedFields = emitterFactory.createOneTimeValueEmitter();  
  });

  test('It emits an object containing the values of all fields as well as overallValidity and hasOmittedFields properties.', () => {
    const fields : FormElementMap = {
      errantField : new MockField('errant field', Validity.ERROR),
      invalidField : new MockField('invalid field', Validity.INVALID),
      pendingField : new MockField('pending field', Validity.PENDING),
      validUnfinalizableField : new MockField('valid unfinalizable field', Validity.VALID_UNFINALIZABLE),
      validFinalizableField : new MockField('valid finalizable field', Validity.VALID_FINALIZABLE)
    }
    fields.validFinalizableField.omit = true;
    const multiFieldAggregator = new MultiFieldAggregatorImpl<typeof fields>(
      fields,
      aggregatedStateChangesProxyProducer,
      fieldStateReducer,
      accessedFields,
      subjectFactory
    );
    multiFieldAggregator.aggregateChanges.subscribe(next => {
      expect(next).toStrictEqual({
        errantField : {
          value : 'errant field',
          validity : Validity.ERROR,
          messages : [],
          omit : false
        },
        invalidField : {
          value : 'invalid field',
          validity : Validity.INVALID,
          messages : [],
          omit : false
        },
        pendingField : {
          value : 'pending field',
          validity : Validity.PENDING,
          messages : [],
          omit : false
        },
        validUnfinalizableField : {
          value : 'valid unfinalizable field',
          validity : Validity.VALID_UNFINALIZABLE,
          messages : [],
          omit : false
        },
        validFinalizableField : {
          value : 'valid finalizable field',
          validity : Validity.VALID_FINALIZABLE,
          messages : [],
          omit : true
        }
      });
      expect(next.hasOmittedFields).toBe(true);
      expect(next.overallValidity).toBe(Validity.ERROR);
    });
  });

  test('It subscribes to fields accessed on initial subscription.', () => {
    const fields : FormElementMap = {
      fieldA : new MockField('field a', Validity.VALID_FINALIZABLE),
      fieldB : new MockField('field b', Validity.VALID_FINALIZABLE)
    }
    const multiFieldAggregator = new MultiFieldAggregatorImpl<typeof fields>(
      fields,
      aggregatedStateChangesProxyProducer,
      fieldStateReducer,
      accessedFields,
      subjectFactory
    );
    vi.spyOn(fields.fieldA.stateChanges, 'subscribe');
    vi.spyOn(fields.fieldB.stateChanges, 'subscribe');
    multiFieldAggregator.aggregateChanges.subscribe(({ fieldA }) => {
      expect(fieldA.value).toBe('field a');
    });
    expect(fields.fieldA.stateChanges.subscribe).toHaveBeenCalledOnce();
    expect(fields.fieldB.stateChanges.subscribe).not.toHaveBeenCalled();
  });
});