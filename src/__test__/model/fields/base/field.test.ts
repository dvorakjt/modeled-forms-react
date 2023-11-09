import { describe, test, expect, vi } from 'vitest';
import { Field } from '../../../../model/fields/base/field';
import { container } from '../../../../model/container';
import { SyncValidator } from '../../../../model/validators/sync-validator.type';
import { Message, MessageType, Validity } from '../../../../model';
import { Modified } from '../../../../model/state/modified.enum';
import { createTriggerableAsyncValidator } from '../../validators/single-input/mocks/async/create-triggerable-async-validator';
import { Subject, Subscription } from 'rxjs';
import { Visited } from '../../../../model/state/visited.enum';
import { required } from '../../../../model';

describe('Field', () => {
  const validatorSuiteFactory = container.services.SingleInputValidatorSuiteFactory;
  
  test('The value property of its initial state is equal to the default value passed into its constructor.', () => {
    const validatorSuite = validatorSuiteFactory.createSingleInputValidatorSuite<string>([], []);
    const field = new Field(validatorSuite, 'default value', false);
    expect(field.state.value).toBe('default value');
  });

  test('The validity property of its initial state is equal to the syncResult of the validator suite passed in.', () => {
    const mockSyncValidator : SyncValidator<string> = () => ({ isValid : false, message : 'test message'});
    const validatorSuite = validatorSuiteFactory.createSingleInputValidatorSuite([mockSyncValidator], []);
    const field = new Field(validatorSuite, '', false);
    expect(field.state.validity).toBe(Validity.INVALID);
  });

  test('The messages property of its initial state is equal to the aggregated messages of the syncResult property of its validator suite.', () => {
    const expectedMessages : Array<Message> = [
      {
        text : 'test message a',
        type : MessageType.VALID
      },
      {
        text : 'test message b',
        type : MessageType.INVALID
      }
    ]
    const mockValidatorA : SyncValidator<string> = () => ({isValid : true, message : expectedMessages[0].text});
    const mockValidatorB : SyncValidator<string> = () => ({ isValid : false, message : expectedMessages[1].text});
    const validatorSuite = validatorSuiteFactory.createSingleInputValidatorSuite([mockValidatorA, mockValidatorB], []);
    const field = new Field(validatorSuite, '', false);
    expect(field.state.messages).toStrictEqual(expectedMessages);
  });

  test('If omitByDefault is true, its omit property is initialized to true.', () => {
    const validatorSuite = validatorSuiteFactory.createSingleInputValidatorSuite<string>([], []);
    const field = new Field(validatorSuite, '', true);
    expect(field.omit).toBe(true);
  });

  test('If omitByDefault is false, its omit property is initialized to false.', () => {
    const validatorSuite = validatorSuiteFactory.createSingleInputValidatorSuite<string>([], []);
    const field = new Field(validatorSuite, '', false);
    expect(field.omit).toBe(false);
  });

  test('If defaultValue is an empty string, modified is initialized to Modified.NO.', () => {
    const validatorSuite = validatorSuiteFactory.createSingleInputValidatorSuite<string>([], []);
    const field = new Field(validatorSuite, '', false);
    expect(field.state.modified).toBe(Modified.NO);
  });

  test('If defaultValue is NOT an empty string, modified is initialized to Modified.YES.', () => {
    const validatorSuite = validatorSuiteFactory.createSingleInputValidatorSuite<string>([], []);
    const field = new Field(validatorSuite, 'test', false);
    expect(field.state.modified).toBe(Modified.YES);
  });

  test('If an async validator suite is passed into the constructor, it validates the default value.', () => {
    const trigger = new Subject<void>();
    const mockValidator : SyncValidator<string> = (value : string) => ({ isValid : value.length > 0, message : 'test async validator message'});
    const asyncValidator = createTriggerableAsyncValidator(trigger, mockValidator);
    const validatorSuite = validatorSuiteFactory.createSingleInputValidatorSuite([], [asyncValidator], 'test pending message');
    const field = new Field(validatorSuite, '', false);
    field.stateChanges.subscribe(change => {
      if(!trigger.closed) {
        expect(change.validity).toBe(Validity.PENDING);
        expect(change.messages[0]).toStrictEqual({
          text : 'test pending message',
          type : MessageType.PENDING
        });
      } else {
        expect(change.validity).toBe(Validity.INVALID);
        expect(change.messages[0]).toStrictEqual({
          text : 'test async validator message',
          type : MessageType.INVALID
        });
      }
    });
    setTimeout(() => {
      trigger.complete();
    }, 500);
  });

  test('When setValue() is called, an existing validator subscription will be unsubscribed from.', () => {
    const trigger = new Subject<void>();
    const mockValidator : SyncValidator<string> = (value : string) => ({ isValid : value.length > 0, message : 'test async validator message'});
    const asyncValidator = createTriggerableAsyncValidator(trigger, mockValidator);
    const validatorSuite = validatorSuiteFactory.createSingleInputValidatorSuite([], [asyncValidator], 'test pending message');
    const field = new Field(validatorSuite, '', false);

    expect(field._validatorSuiteSubscription).toBeInstanceOf(Subscription);

    const currentSubscription = field._validatorSuiteSubscription as Subscription;

    vi.spyOn(currentSubscription, 'unsubscribe');
    field.setValue('test');

    expect(currentSubscription.unsubscribe).toHaveBeenCalledOnce();
  });

  test('Calling setValue() sets the value, validity and messages to the syncResult of its validator suite.', () => {
    const mockValidator : SyncValidator<string> = (value : string) => ({ isValid : value !== 'fail', message : 'test message'});
    const validatorSuite = validatorSuiteFactory.createSingleInputValidatorSuite([mockValidator], []);
    const field = new Field(validatorSuite, '', false);
    field.setValue('fail');
    const expectedValueValidityMessages = {
      value : 'fail',
      validity : Validity.INVALID,
      messages: [
        {
          text : 'test message',
          type : MessageType.INVALID
        }
      ]
    }
    const actualValueValidityMessages = {
      value : field.state.value,
      validity : field.state.validity,
      messages : field.state.messages
    }
    expect(actualValueValidityMessages).toStrictEqual(expectedValueValidityMessages);
  });

  test('Calling setValue() preserves the field\'s omit and visited properties.', () => {
    const validatorSuite = validatorSuiteFactory.createSingleInputValidatorSuite<string>([], []);
    const field = new Field(validatorSuite, '', false);
    field.omit = true;
    field.setState({...field.state, visited : Visited.YES});
    field.setValue('new value');
    expect(field.omit).toBe(true);
    expect(field.state.visited).toBe(Visited.YES);
  });

  test('Calling reset sets the field\'s value, modified, and omit to their default values.', () => {
    const validatorSuite = validatorSuiteFactory.createSingleInputValidatorSuite([required('This field is required.')], []);
    const field = new Field(validatorSuite, '', false);
    field.setValue('test');
    field.omit = true;
    field.reset();
    expect(field.state.value).toBe('');
    expect(field.state.validity).toBe(Validity.INVALID);
    expect(field.state.messages).toStrictEqual([
      {
        text : 'This field is required.',
        type : MessageType.INVALID
      }
    ]);
    expect(field.state.modified).toBe(Modified.NO);
    expect(field.omit).toBe(false);
  });
});