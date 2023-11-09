import { describe, test, expect } from 'vitest';
import { container } from '../../../../model/container';
import { ControlledFieldFactoryImpl } from '../../../../model/fields/controlled/controlled-field-factory-impl';
import { FormElementDictionary } from '../../../../model/form-elements/form-element-dictionary.type';
import { SyncFieldStateControlFn } from '../../../../model/fields/controlled/control-functions/fields/sync-field-state-control-fn.type';
import { AsyncFieldStateControlFn } from '../../../../model/fields/controlled/control-functions/fields/async-field-state-control-fn.type';
import { MessageType, Validity } from '../../../../model';
import { StateControlledField } from '../../../../model/fields/controlled/state-controlled-field';
import { StateControlledDualField } from '../../../../model/fields/controlled/state-controlled-dual-field';
import { Observable } from 'rxjs';
import { SyncFieldValueControlFn } from '../../../../model/fields/controlled/control-functions/fields/sync-field-value-control-fn.type';
import { ValueControlledField } from '../../../../model/fields/controlled/value-controlled-field';
import { ValueControlledDualField } from '../../../../model/fields/controlled/value-controlled-dual-field';
import { AsyncFieldValueControlFn } from '../../../../model/fields/controlled/control-functions/fields/async-field-value-control-fn.type';

describe('ControlledFieldFactory', () => {
  const controlledFieldFactory = new ControlledFieldFactoryImpl(
    container.services.AdapterFactory,
    container.services.ConfigLoader,
  );
  const baseFieldFactory = container.services.BaseFieldFactory;

  test('createStateControlledFieldWithSyncAdapter() returns a StateControlledField when a Field is passed in as an argument.', () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createField('', false, [], []);
    const fields: FormElementDictionary = { fieldA, fieldB };
    const stateControlFn: SyncFieldStateControlFn = ({ fieldA }) => ({
      value: fieldA.value.repeat(3),
      validity:
        fieldA.value.length > 0 ? Validity.VALID_FINALIZABLE : Validity.INVALID,
    });
    const controlledField =
      controlledFieldFactory.createStateControlledFieldWithSyncAdapter(
        fieldB,
        stateControlFn,
        fields,
      );
    expect(controlledField).toBeInstanceOf(StateControlledField);
  });

  test('createStateControlledFieldWithSyncAdapter() returns a StateControlledDualField when a DualField is passed in as an argument.', () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField('', '', false, [], []);
    const fields: FormElementDictionary = { fieldA, fieldB };
    const stateControlFn: SyncFieldStateControlFn = ({ fieldA }) => ({
      value: fieldA.value.repeat(3),
      validity:
        fieldA.value.length > 0 ? Validity.VALID_FINALIZABLE : Validity.INVALID,
    });
    const controlledField =
      controlledFieldFactory.createStateControlledFieldWithSyncAdapter(
        fieldB,
        stateControlFn,
        fields,
      );
    expect(controlledField).toBeInstanceOf(StateControlledDualField);
  });

  test('createStateControlledFieldWithAsyncAdapter() returns a StateControlledField when a Field is passed in as an argument.', () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createField('', false, [], []);
    const fields: FormElementDictionary = { fieldA, fieldB };
    const stateControlFn: AsyncFieldStateControlFn = ({ fieldA }) => {
      return new Observable(subscriber => {
        subscriber.next({
          value: '',
          validity: Validity.PENDING,
          messages: [
            {
              type: MessageType.PENDING,
              text: 'the field is pending',
            },
          ],
        });
        setTimeout(() => {
          subscriber.next({
            value: fieldA.value.toUpperCase(),
            validity: Validity.VALID_FINALIZABLE,
            messages: [
              {
                type: MessageType.VALID,
                text: 'mock asynchronous transformation complete',
              },
            ],
          });
        }, 500);
      });
    };
    const controlledField =
      controlledFieldFactory.createStateControlledFieldWithAsyncAdapter(
        fieldB,
        stateControlFn,
        fields,
      );
    expect(controlledField).toBeInstanceOf(StateControlledField);
  });

  test('createStateControlledFieldWithAsyncAdapter() returns a StateControlledDualField when a DualField is passed in as an argument.', () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField('', '', false, [], []);
    const fields: FormElementDictionary = { fieldA, fieldB };
    const stateControlFn: AsyncFieldStateControlFn = ({ fieldA }) => {
      return new Observable(subscriber => {
        subscriber.next({
          value: '',
          validity: Validity.PENDING,
          messages: [
            {
              type: MessageType.PENDING,
              text: 'the field is pending',
            },
          ],
        });
        setTimeout(() => {
          subscriber.next({
            value: fieldA.value.toUpperCase(),
            validity: Validity.VALID_FINALIZABLE,
            messages: [
              {
                type: MessageType.VALID,
                text: 'mock asynchronous transformation complete',
              },
            ],
          });
        }, 500);
      });
    };
    const controlledField =
      controlledFieldFactory.createStateControlledFieldWithAsyncAdapter(
        fieldB,
        stateControlFn,
        fields,
      );
    expect(controlledField).toBeInstanceOf(StateControlledDualField);
  });

  test('createValueControlledFieldWithSyncAdapter returns an instance of ValueControlledField when it is called with a Field.', () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createField('', false, [], []);
    const fields: FormElementDictionary = { fieldA, fieldB };
    const valueControlFn: SyncFieldValueControlFn = ({ fieldA }) =>
      fieldA.value[0].toUpperCase() + fieldA.value.slice(1).toLowerCase();
    const controlledField =
      controlledFieldFactory.createValueControlledFieldWithSyncAdapter(
        fieldB,
        valueControlFn,
        fields,
      );
    expect(controlledField).toBeInstanceOf(ValueControlledField);
  });

  test('createValueControlledFieldWithSyncAdapter returns an instance of ValueControlledDualField when it is called with a DualField.', () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField('', '', false, [], []);
    const fields: FormElementDictionary = { fieldA, fieldB };
    const valueControlFn: SyncFieldValueControlFn = ({ fieldA }) =>
      fieldA.value[0].toUpperCase() + fieldA.value.slice(1).toLowerCase();
    const controlledField =
      controlledFieldFactory.createValueControlledFieldWithSyncAdapter(
        fieldB,
        valueControlFn,
        fields,
      );
    expect(controlledField).toBeInstanceOf(ValueControlledDualField);
  });

  test('createValueControlledFieldWithAsyncAdapter returns an instance of ValueControlledField when it is called with a Field.', () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createField('', false, [], []);
    const fields: FormElementDictionary = { fieldA, fieldB };
    const valueControlFn: AsyncFieldValueControlFn = ({ fieldA }) => {
      return new Observable(subscriber => {
        subscriber.next('loading...');
        setTimeout(() => {
          subscriber.next(
            'some asynchronous transformation of ' + fieldA.value,
          );
        }, 500);
      });
    };
    const controlledField =
      controlledFieldFactory.createValueControlledFieldWithAsyncAdapter(
        fieldB,
        valueControlFn,
        fields,
      );
    expect(controlledField).toBeInstanceOf(ValueControlledField);
  });

  test('createValueControlledFieldWithAsyncAdapter returns an instance of ValueControlledDualField when it is called with a DualField.', () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField('', '', false, [], []);
    const fields: FormElementDictionary = { fieldA, fieldB };
    const valueControlFn: AsyncFieldValueControlFn = ({ fieldA }) => {
      return new Observable(subscriber => {
        subscriber.next('loading...');
        setTimeout(() => {
          subscriber.next(
            'some asynchronous transformation of ' + fieldA.value,
          );
        }, 500);
      });
    };
    const controlledField =
      controlledFieldFactory.createValueControlledFieldWithAsyncAdapter(
        fieldB,
        valueControlFn,
        fields,
      );
    expect(controlledField).toBeInstanceOf(ValueControlledDualField);
  });
});
