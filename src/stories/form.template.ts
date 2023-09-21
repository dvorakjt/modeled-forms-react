import { RootFormTemplate } from '../model/templates/forms/root-form-template.interface';
import { required } from '../model/validators/util/required';
import { email } from '../model/validators/util/email';
import { includesLower } from '../model/validators/util/includes-lower';
import { includesUpper } from '../model/validators/util/includes-upper';
import { includesDigit } from '../model/validators/util/includes-digit';
import { includesSymbol } from '../model/validators/util/includes-symbol';
import { inLengthRange } from '../model/validators/util/in-length-range';
import { maxDate } from '../model/validators/util/max-date';
import { Validity } from '../model/state/validity.enum';
import { MessageType } from '../model/state/messages/message-type.enum';
import { Message } from '../model/state/messages/message.interface';
import { State } from '../model/state/state.interface';

export const template: RootFormTemplate = {
  fields: {
    firstName: {
      defaultValue: '',
      syncValidators: [required('❌ First Name is a required field.')],
    },
    lastName: {
      defaultValue: '',
      syncValidators: [required('❌ Last Name is a required field.')],
    },
    emailAddr: {
      defaultValue: '',
      syncValidators: [
        required('❌ Email is a required field.'),
        email('❌ Please enter a valid email address.'),
      ],
    },
    password: {
      defaultValue: '',
      syncValidators: [
        required('❌ Password is a required field.'),
        includesLower(
          '❌ Password must include a lowercase letter.',
          '✅ Password includes a lowercase letter.',
        ),
        includesUpper(
          '❌ Password must include an uppercase letter.',
          '✅ Password includes an uppercase letter.',
        ),
        includesDigit(
          '❌ Password must include a digit.',
          '✅ Password includes a digit.',
        ),
        includesSymbol(
          '❌ Password must include a symbol.',
          '✅ Password includes a symbol.',
        ),
        inLengthRange(
          8,
          64,
          '❌ Password must be at least 8 characters long but no more than 64.',
          '✅ Password is between 8 and 64 characters long.',
        ),
      ],
    },
    ageInformation: {
      fields: {
        birthday: {
          defaultValue: '',
          syncValidators: [
            required('❌ Birthday is a required field.'),
            maxDate(
              new Date(),
              '❌ Birthday must be a valid date prior to the current date.',
            ),
          ],
        },
        age: {
          defaultValue: '',
          syncStateControlFn: ({ birthday, overallValidity }) => {
            if (overallValidity() < Validity.VALID_FINALIZABLE)
              return {
                value: '',
                validity: Validity.INVALID,
                messages: [
                  {
                    type: MessageType.INVALID,
                    text: 'Please enter a valid birthday',
                  },
                ],
              };
            const ageDifMs = Date.now() - new Date(birthday.value).getTime();
            const ageDate = new Date(ageDifMs); // miliseconds from epoch
            return {
              value: Math.abs(ageDate.getUTCFullYear() - 1970).toString(),
              validity: Validity.VALID_FINALIZABLE,
              messages: [] as Array<Message>,
            };
          },
        },
      },
    },
  },
  finalizedFields: {
    fullName : {
      syncFinalizerFn: ({firstName, lastName}) => {
        return firstName.value + ' ' + lastName.value
      }
    }
  },
  submitFn: (state : State<any>) => {
    return new Promise((resolve) => {
      resolve(state);
    });
  }
};
