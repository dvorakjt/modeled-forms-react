import { describe, test, expect, beforeEach, vi } from 'vitest';
import { MultiFieldAggregatorImpl } from '../../../model/aggregators/multi-field-aggregator-impl';
import { MockField } from '../../util/mocks/mock-field';
import { AggregatedStateChangesProxyProducer } from '../../../model/proxies/aggregated-state-changes-proxy-producer.interface';
import { FieldStateReducer } from '../../../model/reducers/field-state/field-state-reducer.interface';
import { OneTimeValueEmitter } from '../../../model/emitters/one-time-value-emitter.interface';
import { Validity } from '../../../model/state/validity.enum';
import { FormElementDictionary } from '../../../model/form-elements/form-element-dictionary.type';
import { AggregatedStateChanges } from '../../../model/aggregators/aggregated-state-changes.interface';
import { Visited } from '../../../model/state/visited.enum';
import { Modified } from '../../../model/state/modified.enum';
import { container } from '../../../model/container';

describe('MultiFieldAggregatorImpl', () => {
  const subjectFactory = container.services.SubjectFactory;
  const proxyProducerFactory = container.services.ProxyProducerFactory;
  const reducerFactory = container.services.ReducerFactory;
  const emitterFactory = container.services.EmitterFactory;
  let aggregatedStateChangesProxyProducer: AggregatedStateChangesProxyProducer;
  let fieldStateReducer: FieldStateReducer;
  let accessedFields: OneTimeValueEmitter<Set<string>>;

  beforeEach(() => {
    aggregatedStateChangesProxyProducer =
      proxyProducerFactory.createAggregatedStateChangesProxyProducer();
    fieldStateReducer = reducerFactory.createFieldStateReducer();
    accessedFields = emitterFactory.createOneTimeValueEmitter();
  });

  test('It emits an object containing the values of all fields as well as overallValidity and hasOmittedFields properties.', () => {
    const fields: FormElementDictionary = {
      errantField: new MockField('errant field', Validity.ERROR),
      invalidField: new MockField('invalid field', Validity.INVALID),
      pendingField: new MockField('pending field', Validity.PENDING),
      validUnfinalizableField: new MockField(
        'valid unfinalizable field',
        Validity.VALID_UNFINALIZABLE,
      ),
      validFinalizableField: new MockField(
        'valid finalizable field',
        Validity.VALID_FINALIZABLE,
      ),
    };
    fields.validFinalizableField.omit = true;
    const multiFieldAggregator = new MultiFieldAggregatorImpl(
      fields,
      aggregatedStateChangesProxyProducer,
      fieldStateReducer,
      accessedFields,
      subjectFactory,
    );
    multiFieldAggregator.aggregateChanges.subscribe(
      (next: AggregatedStateChanges) => {
        expect(next).toStrictEqual({
          errantField: {
            value: 'errant field',
            validity: Validity.ERROR,
            messages: [],
            visited : Visited.NO,
            modified : Modified.NO,
            omit: false,
          },
          invalidField: {
            value: 'invalid field',
            validity: Validity.INVALID,
            messages: [],
            visited : Visited.NO,
            modified : Modified.NO,
            omit: false,
          },
          pendingField: {
            value: 'pending field',
            validity: Validity.PENDING,
            visited : Visited.NO,
            modified : Modified.NO,
            messages: [],
            omit: false,
          },
          validUnfinalizableField: {
            value: 'valid unfinalizable field',
            validity: Validity.VALID_UNFINALIZABLE,
            visited : Visited.NO,
            modified : Modified.NO,
            messages: [],
            omit: false,
          },
          validFinalizableField: {
            value: 'valid finalizable field',
            validity: Validity.VALID_FINALIZABLE,
            visited : Visited.NO,
            modified : Modified.NO,
            messages: [],
            omit: true,
          },
        });
        expect(next.hasOmittedFields()).toBe(true);
        expect(next.overallValidity()).toBe(Validity.ERROR);
      },
    );
  });

  test('It subscribes to fields accessed on initial subscription.', () => {
    const fields: FormElementDictionary = {
      fieldA: new MockField('field a', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('field b', Validity.VALID_FINALIZABLE),
    };
    const multiFieldAggregator = new MultiFieldAggregatorImpl(
      fields,
      aggregatedStateChangesProxyProducer,
      fieldStateReducer,
      accessedFields,
      subjectFactory,
    );
    vi.spyOn(fields.fieldA.stateChanges, 'subscribe');
    vi.spyOn(fields.fieldB.stateChanges, 'subscribe');
    multiFieldAggregator.aggregateChanges.subscribe(
      ({ fieldA }: AggregatedStateChanges) => {
        expect(fieldA.value).toBe('field a');
      },
    );
    expect(fields.fieldA.stateChanges.subscribe).toHaveBeenCalledOnce();
    expect(fields.fieldB.stateChanges.subscribe).not.toHaveBeenCalled();
  });

  test("It sets overallValidity to Validity.VALID_FINALIZABLE if only a valid field is subscribed to.", () => {
    const fields : FormElementDictionary = {
      validFinalizableField : new MockField('', Validity.VALID_FINALIZABLE),
      validUnfinalizableField : new MockField('', Validity.VALID_UNFINALIZABLE),
      pendingField : new MockField('', Validity.PENDING),
      invalidField : new MockField('', Validity.INVALID),
      errantField : new MockField('', Validity.ERROR)
    }
    const multiFieldAggregator = new MultiFieldAggregatorImpl(
      fields,
      aggregatedStateChangesProxyProducer,
      fieldStateReducer,
      accessedFields,
      subjectFactory
    );
    multiFieldAggregator.aggregateChanges.subscribe(({ overallValidity, validFinalizableField }) => {
      expect(overallValidity()).toBe(Validity.VALID_FINALIZABLE);
      expect(validFinalizableField).toBeDefined();
    });
  });

  test("It sets overallValidity to Validity.VALID_UNFINALIZABLE if a VALID_FINALIZABLE and a VALID_UNFINALIZABLE field are subscribed to.", () => {
    const fields : FormElementDictionary = {
      validFinalizableField : new MockField('', Validity.VALID_FINALIZABLE),
      validUnfinalizableField : new MockField('', Validity.VALID_UNFINALIZABLE),
      pendingField : new MockField('', Validity.PENDING),
      invalidField : new MockField('', Validity.INVALID),
      errantField : new MockField('', Validity.ERROR)
    }
    const multiFieldAggregator = new MultiFieldAggregatorImpl(
      fields,
      aggregatedStateChangesProxyProducer,
      fieldStateReducer,
      accessedFields,
      subjectFactory
    );
    multiFieldAggregator.aggregateChanges.subscribe(({ overallValidity, validFinalizableField, validUnfinalizableField }) => {
      expect(overallValidity()).toBe(Validity.VALID_UNFINALIZABLE);
      expect(validFinalizableField).toBeDefined();
      expect(validUnfinalizableField).toBeDefined();
    });
  });

  test("It sets overallValidity to Validity.PENDING if that is the minimum validity of subscribed fields.", () => {
    const fields : FormElementDictionary = {
      validFinalizableField : new MockField('', Validity.VALID_FINALIZABLE),
      validUnfinalizableField : new MockField('', Validity.VALID_UNFINALIZABLE),
      pendingField : new MockField('', Validity.PENDING),
      invalidField : new MockField('', Validity.INVALID),
      errantField : new MockField('', Validity.ERROR)
    }
    const multiFieldAggregator = new MultiFieldAggregatorImpl(
      fields,
      aggregatedStateChangesProxyProducer,
      fieldStateReducer,
      accessedFields,
      subjectFactory
    );
    multiFieldAggregator.aggregateChanges.subscribe(({ overallValidity, validFinalizableField, validUnfinalizableField, pendingField }) => {
      expect(overallValidity()).toBe(Validity.PENDING);
      expect(validFinalizableField).toBeDefined();
      expect(validUnfinalizableField).toBeDefined();
      expect(pendingField).toBeDefined();
    });
  });

  test("It sets overallValidity to Validity.PENDING if that is the minimum validity of subscribed fields.", () => {
    const fields : FormElementDictionary = {
      validFinalizableField : new MockField('', Validity.VALID_FINALIZABLE),
      validUnfinalizableField : new MockField('', Validity.VALID_UNFINALIZABLE),
      pendingField : new MockField('', Validity.PENDING),
      invalidField : new MockField('', Validity.INVALID),
      errantField : new MockField('', Validity.ERROR)
    }
    const multiFieldAggregator = new MultiFieldAggregatorImpl(
      fields,
      aggregatedStateChangesProxyProducer,
      fieldStateReducer,
      accessedFields,
      subjectFactory
    );
    multiFieldAggregator.aggregateChanges.subscribe(({ overallValidity, validFinalizableField, validUnfinalizableField, pendingField }) => {
      expect(overallValidity()).toBe(Validity.PENDING);
      expect(validFinalizableField).toBeDefined();
      expect(validUnfinalizableField).toBeDefined();
      expect(pendingField).toBeDefined();
    });
  });

  test("It sets overallValidity to Validity.INVALID if that is the minimum validity of subscribed fields.", () => {
    const fields : FormElementDictionary = {
      validFinalizableField : new MockField('', Validity.VALID_FINALIZABLE),
      validUnfinalizableField : new MockField('', Validity.VALID_UNFINALIZABLE),
      pendingField : new MockField('', Validity.PENDING),
      invalidField : new MockField('', Validity.INVALID),
      errantField : new MockField('', Validity.ERROR)
    }
    const multiFieldAggregator = new MultiFieldAggregatorImpl(
      fields,
      aggregatedStateChangesProxyProducer,
      fieldStateReducer,
      accessedFields,
      subjectFactory
    );
    multiFieldAggregator.aggregateChanges.subscribe(({ overallValidity, validFinalizableField, validUnfinalizableField, pendingField, invalidField }) => {
      expect(overallValidity()).toBe(Validity.INVALID);
      expect(validFinalizableField).toBeDefined();
      expect(validUnfinalizableField).toBeDefined();
      expect(pendingField).toBeDefined();
      expect(invalidField).toBeDefined();
    });
  });

  test("It sets overallValidity to Validity.ERROR if that is the minimum validity of subscribed fields.", () => {
    const fields : FormElementDictionary = {
      validFinalizableField : new MockField('', Validity.VALID_FINALIZABLE),
      validUnfinalizableField : new MockField('', Validity.VALID_UNFINALIZABLE),
      pendingField : new MockField('', Validity.PENDING),
      invalidField : new MockField('', Validity.INVALID),
      errantField : new MockField('', Validity.ERROR)
    }
    const multiFieldAggregator = new MultiFieldAggregatorImpl(
      fields,
      aggregatedStateChangesProxyProducer,
      fieldStateReducer,
      accessedFields,
      subjectFactory
    );
    multiFieldAggregator.aggregateChanges.subscribe(({ overallValidity, validFinalizableField, validUnfinalizableField, pendingField, invalidField, errantField }) => {
      expect(overallValidity()).toBe(Validity.ERROR);
      expect(validFinalizableField).toBeDefined();
      expect(validUnfinalizableField).toBeDefined();
      expect(pendingField).toBeDefined();
      expect(invalidField).toBeDefined();
      expect(errantField).toBeDefined();
    });
  });

  test('When the validity of a field is modified, overallValidity is updated accordingly.', () => {
    const fields = {
      validFinalizableField : new MockField('', Validity.VALID_FINALIZABLE),
      validUnfinalizableField : new MockField('', Validity.VALID_UNFINALIZABLE),
      pendingField : new MockField('', Validity.PENDING),
      invalidField : new MockField('', Validity.INVALID),
      errantField : new MockField('', Validity.ERROR)
    }
    const multiFieldAggregator = new MultiFieldAggregatorImpl(
      fields,
      aggregatedStateChangesProxyProducer,
      fieldStateReducer,
      accessedFields,
      subjectFactory
    );
    let expectedValidity = 0;
    multiFieldAggregator.aggregateChanges.subscribe(({ overallValidity, validFinalizableField, validUnfinalizableField, pendingField, invalidField, errantField }) => {
      expect(overallValidity()).toBe(expectedValidity++);
      expect(validFinalizableField).toBeDefined();
      expect(validUnfinalizableField).toBeDefined();
      expect(pendingField).toBeDefined();
      expect(invalidField).toBeDefined();
      expect(errantField).toBeDefined();
    });
    fields.errantField.setState({
      ...fields.errantField.state,
      validity : Validity.VALID_FINALIZABLE
    });
    fields.invalidField.setState({
      ...fields.invalidField.state,
      validity : Validity.VALID_FINALIZABLE
    });
    fields.pendingField.setState({
      ...fields.pendingField.state,
      validity : Validity.VALID_FINALIZABLE
    });
    fields.validUnfinalizableField.setState({
      ...fields.validUnfinalizableField.state,
      validity : Validity.VALID_FINALIZABLE
    });
  });

  test('hasOmittedFields() returns false when no fields are omitted.', () => {
    const fields = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE),
      fieldB : new MockField('', Validity.VALID_FINALIZABLE)
    }
    const multiFieldAggregator = new MultiFieldAggregatorImpl(
      fields,
      aggregatedStateChangesProxyProducer,
      fieldStateReducer,
      accessedFields,
      subjectFactory
    );
    multiFieldAggregator.aggregateChanges.subscribe(({ hasOmittedFields, fieldA, fieldB }) => {
      expect(hasOmittedFields()).toBe(false);
      expect(fieldA.omit).toBe(false);
      expect(fieldB.omit).toBe(false);
    });
  });

  test('hasOmittedFields() returns true when at least one field is omitted.', () => {
    const fields = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE),
      fieldB : new MockField('', Validity.VALID_FINALIZABLE)
    }
    fields.fieldA.omit = true;
    const multiFieldAggregator = new MultiFieldAggregatorImpl(
      fields,
      aggregatedStateChangesProxyProducer,
      fieldStateReducer,
      accessedFields,
      subjectFactory
    );
    multiFieldAggregator.aggregateChanges.subscribe(({ hasOmittedFields, fieldA, fieldB }) => {
      expect(hasOmittedFields()).toBe(true);
      expect(fieldA.omit).toBe(true);
      expect(fieldB.omit).toBe(false);
    });
  });

  test('As fields\' omit property is changed, hasOmittedFields() is updated accordingly.', () => {
    const fields = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE),
      fieldB : new MockField('', Validity.VALID_FINALIZABLE)
    }
    fields.fieldA.omit = true;
    fields.fieldB.omit = true;
    const multiFieldAggregator = new MultiFieldAggregatorImpl(
      fields,
      aggregatedStateChangesProxyProducer,
      fieldStateReducer,
      accessedFields,
      subjectFactory
    );
    let expectedFieldAOmit = true;
    let expectedFieldBOmit = true;

    multiFieldAggregator.aggregateChanges.subscribe(({ hasOmittedFields, fieldA, fieldB }) => {
      expect(hasOmittedFields()).toBe(expectedFieldAOmit || expectedFieldBOmit);
      expect(fieldA.omit).toBe(expectedFieldAOmit);
      expect(fieldB.omit).toBe(expectedFieldBOmit);
    });

    fields.fieldA.omit = expectedFieldAOmit = false;
    fields.fieldB.omit = expectedFieldBOmit = false;
  });

  test('visited() returns Visited.NO if no fields have been visited.', () => {
    const fields : FormElementDictionary = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE),
      fieldB : new MockField('', Validity.VALID_FINALIZABLE)
    }
    const multiFieldAggregator = new MultiFieldAggregatorImpl(
      fields,
      aggregatedStateChangesProxyProducer,
      fieldStateReducer,
      accessedFields,
      subjectFactory
    );
    multiFieldAggregator.aggregateChanges.subscribe(({visited, fieldA, fieldB}) => {
      expect(visited()).toBe(Visited.NO);
      expect(fieldA).toBeDefined();
      expect(fieldB).toBeDefined();
    });
  });

  test('It returns Visited.PARTIALLY if there are both visited and unvisited fields.', () => {
    const fields = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE),
      fieldB : new MockField('', Validity.VALID_FINALIZABLE)
    }
    fields.fieldA.visit();
    const multiFieldAggregator = new MultiFieldAggregatorImpl(
      fields,
      aggregatedStateChangesProxyProducer,
      fieldStateReducer,
      accessedFields,
      subjectFactory
    )
    multiFieldAggregator.aggregateChanges.subscribe(({visited, fieldA, fieldB}) => {
      expect(visited()).toBe(Visited.PARTIALLY);
      expect(fieldA).toBeDefined();
      expect(fieldB).toBeDefined();
    });
  });

  test('It returns Visited.YES if all accessed fields have been visited.', () => {
    const fields = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE),
      fieldB : new MockField('', Validity.VALID_FINALIZABLE)
    }
    fields.fieldA.visit();
    fields.fieldB.visit();
    const multiFieldAggregator = new MultiFieldAggregatorImpl(
      fields,
      aggregatedStateChangesProxyProducer,
      fieldStateReducer,
      accessedFields,
      subjectFactory
    )
    multiFieldAggregator.aggregateChanges.subscribe(({visited, fieldA, fieldB}) => {
      expect(visited()).toBe(Visited.YES);
      expect(fieldA).toBeDefined();
      expect(fieldB).toBeDefined();
    });
  });

  test('As fields are visited, visited is updated accordingly.', () => {
    const fields = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE),
      fieldB : new MockField('', Validity.VALID_FINALIZABLE)
    }
    const multiFieldAggregator = new MultiFieldAggregatorImpl(
      fields,
      aggregatedStateChangesProxyProducer,
      fieldStateReducer,
      accessedFields,
      subjectFactory
    )
    let expectedVisitedValue = Visited.NO;
    multiFieldAggregator.aggregateChanges.subscribe(({visited, fieldA, fieldB}) => {
      expect(visited()).toBe(expectedVisitedValue);
      expect(fieldA).toBeDefined();
      expect(fieldB).toBeDefined();
    });

    expectedVisitedValue = Visited.PARTIALLY;
    fields.fieldA.visit();

    expectedVisitedValue = Visited.YES;
    fields.fieldB.visit();
  });

  //
  test('It returns Modified.NO if no fields have been modified.', () => {
    const fields : FormElementDictionary = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE),
      fieldB : new MockField('', Validity.VALID_FINALIZABLE)
    }
    const multiFieldAggregator = new MultiFieldAggregatorImpl(
      fields,
      aggregatedStateChangesProxyProducer,
      fieldStateReducer,
      accessedFields,
      subjectFactory
    );
    multiFieldAggregator.aggregateChanges.subscribe(({modified, fieldA, fieldB}) => {
      expect(modified()).toBe(Modified.NO);
      expect(fieldA).toBeDefined();
      expect(fieldB).toBeDefined();
    });
  });

  test('It returns Modified.PARTIALLY if there are both modified and unmodified fields.', () => {
    const fields = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE),
      fieldB : new MockField('', Validity.VALID_FINALIZABLE)
    }
    fields.fieldA.modify();
    const multiFieldAggregator = new MultiFieldAggregatorImpl(
      fields,
      aggregatedStateChangesProxyProducer,
      fieldStateReducer,
      accessedFields,
      subjectFactory
    )
    multiFieldAggregator.aggregateChanges.subscribe(({modified, fieldA, fieldB}) => {
      expect(modified()).toBe(Modified.PARTIALLY);
      expect(fieldA).toBeDefined();
      expect(fieldB).toBeDefined();
    });
  });

  test('It returns Modified.YES if all accessed fields have been modified.', () => {
    const fields = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE),
      fieldB : new MockField('', Validity.VALID_FINALIZABLE)
    }
    fields.fieldA.modify();
    fields.fieldB.modify();
    const multiFieldAggregator = new MultiFieldAggregatorImpl(
      fields,
      aggregatedStateChangesProxyProducer,
      fieldStateReducer,
      accessedFields,
      subjectFactory
    )
    multiFieldAggregator.aggregateChanges.subscribe(({modified, fieldA, fieldB}) => {
      expect(modified()).toBe(Modified.YES);
      expect(fieldA).toBeDefined();
      expect(fieldB).toBeDefined();
    });
  });

  test('As fields are modified, modified is updated accordingly.', () => {
    const fields = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE),
      fieldB : new MockField('', Validity.VALID_FINALIZABLE)
    }
    const multiFieldAggregator = new MultiFieldAggregatorImpl(
      fields,
      aggregatedStateChangesProxyProducer,
      fieldStateReducer,
      accessedFields,
      subjectFactory
    )
    let expectedModifiedValue = Modified.NO;
    multiFieldAggregator.aggregateChanges.subscribe(({modified, fieldA, fieldB}) => {
      expect(modified()).toBe(expectedModifiedValue);
      expect(fieldA).toBeDefined();
      expect(fieldB).toBeDefined();
    });
    
    expectedModifiedValue = Modified.PARTIALLY;
    fields.fieldA.modify();

    expectedModifiedValue = Modified.YES;
    fields.fieldB.modify();
  });
});
