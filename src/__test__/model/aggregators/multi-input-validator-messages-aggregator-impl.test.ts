import { container } from "../../../model/container";
import { MultiInputValidatorMessagesAggregatorImpl } from "../../../model/aggregators/multi-input-validator-messages-aggregator-impl";
import { describe, test, expect, beforeEach} from 'vitest';
import { MultiInputValidatorMessagesAggregator } from "../../../model/aggregators/multi-input-validator-messages-aggregator.interface";
import { MockField } from "../../util/mocks/mock-field";
import { MessageType, Validity } from "../../../model";
import { FormElementDictionary } from "../../../model/form-elements/form-element-dictionary.type";
import { MultiInputValidator } from "../../../model/validators/multi-input/multi-input-validator.interface";
import { SyncValidator } from "../../../model/validators/sync-validator.type";
import { AggregatedStateChanges } from "../../../model/aggregators/aggregated-state-changes.interface";
import { AbstractField } from "../../../model/fields/base/abstract-field";

describe('MultiInputValidatorMessagesAggregatorImpl', () => {
  let multiInputValidatorMessagesAggregator : MultiInputValidatorMessagesAggregator;
  let fields : FormElementDictionary;
  let multiInputValidatorOne : MultiInputValidator;
  let multiInputValidatorTwo : MultiInputValidator;
  let validatorFnOne : SyncValidator<AggregatedStateChanges>;
  let validatorFnTwo : SyncValidator<AggregatedStateChanges>;

  beforeEach(() => {
    fields = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE),
      fieldB : new MockField('', Validity.VALID_FINALIZABLE)
    }

    validatorFnOne = ({fieldA, fieldB}) => {
      return {
        isValid : fieldA.value === fieldB.value,
        message : 'Validator Function One is valid.'
      }
    }

    validatorFnTwo = ({ fieldA, fieldB}) => {
      return {
        isValid : fieldA.value !== fieldB.value,
        message : 'Validator Function Two is invalid.'
      }
    };
    multiInputValidatorOne = container.services.MultiInputValidatorFactory.createSyncMultiInputValidator(validatorFnOne, fields);
    multiInputValidatorTwo = container.services.MultiInputValidatorFactory.createSyncMultiInputValidator(validatorFnTwo, fields);
    multiInputValidatorMessagesAggregator = new MultiInputValidatorMessagesAggregatorImpl([multiInputValidatorOne, multiInputValidatorTwo]);
  });

  test('It returns the messages of each field mapped to MultiInputValidatorMessages.', () => {
    const expectedMessages = [
      {
        type : MessageType.VALID,
        text : 'Validator Function One is valid.',
        hasUnvisitedOrUnmodifiedFields : true
      },
      {
        type : MessageType.INVALID,
        text: 'Validator Function Two is invalid.',
        hasUnvisitedOrUnmodifiedFields : true
      }
    ]
    expect(multiInputValidatorMessagesAggregator.messages).toStrictEqual(expectedMessages);
  });

  test('It deletes a message when a validator returns a null message.', () => {
    const validatorFn : SyncValidator<AggregatedStateChanges> = ({ fieldA, fieldB }) => {
      const isValid = fieldA.value !== fieldB.value
      return {
        isValid,
        message : !isValid ? 'Validator Function is invalid.' : undefined
      }
    }
    const multiInputValidator = container.services.MultiInputValidatorFactory.createSyncMultiInputValidator(validatorFn, fields);
    multiInputValidatorMessagesAggregator = new MultiInputValidatorMessagesAggregatorImpl([multiInputValidator]);

    const expectedMessages = [
      {
        text : 'Validator Function is invalid.',
        type : MessageType.INVALID,
        hasUnvisitedOrUnmodifiedFields : true
      }
    ];

    expect(multiInputValidatorMessagesAggregator.messages).toStrictEqual(expectedMessages);
    
    //trigger validatorFn
    (fields.fieldA as AbstractField).setValue('test');

    expect(multiInputValidatorMessagesAggregator.messages).toStrictEqual([]);
  });
});