# Modeled Forms React
Modeled Forms React is provides declarative HTML form state management for React applications. Modeled Forms React is currently a work in progress. Completion of the alpha release is projected by late October 2023. Complete documentation will be published at that time. Please read further for a synopsis of project goals, features and sample usage.

## Goals
The impetus for this project was a very complicated form for voter registration. The form had fields whose values were derived from each other (for example, a zip code determines a user's state), fields that produced temporary values which controlled modals displayed to the user (for instance, a user's birthday determines their age, which--in conjunction with their state--determines their eligibility to register to vote and thus the message they are shown), fields which required async validation, and even a field whose value could be set in one of two ways (a `<select>` element where the user could select 'other' and enter a value manually). The form was even split into 4 separate pages to simplify the UI for users, and thus could be thought of as having four nested forms. To add to this, the input elements that had relatively complex styling requirements.

The code that accomplished this was...a bit of a mess, and I felt strongly that the logic related to the state and value of the form fields should be abstracted away and separated from the logic related to its presentation. This architecture, in which the view, model and controller for interacting with the model, is of course, the classic MVC architecture (thus the name Modeled Forms React). Inspired by Angular's [reactive approach to forms](https://angular.io/guide/reactive-forms), I decided to create a library for React that provided declarative management of form state, allowed for interactivity of form fields (meaning that fields could be related--an update to one field could trigger an update to another), guaranteed that validity and value were encapsulated together, and was design-agnostic while providing highly customizable components that easily hooked into this state. The library should also provide easy-to-use built-in validators, and handle asynchronous code as seamlessly as synchronous code (for instance, asynchronous validation, asynchronous field interactions).

## Features at a High Level

**Fields have a state, which consists of their value, validity, messages, visited and modified.**

Upon construction, fields can be granted synchronous and/or asynchronous validators. Anytime the field's setValue() method is called, these validators run, and the field's validity is updated to the syncResult of those validators immediately, which async validators are awaited (passing or no sync validators in combination with async validators results in a validity of PENDING). Thus form value and validity are always updated simultaneously. 

**Fields can control other Fields**

Fields can control other fields by value or by state. To do this a control function is passed into the template, which might look something like this:

    const controlFn : SyncFieldValueControlFn = ({ firstName, lastName }) => { 
	    if(firstName.value && lastName.value) {
		    return `${firstName[0]}.${lastName[0]}.`;
	    }
    }
This demonstrates a field control function that could be used to determine the user's initials. If the control function returns a falsy value, the controlled field's value will not be set. Unexpected errors are also caught at this level and result in a validity of ERROR, as well as setting an error message on the field. A customizable, global error message is used for this purpose. If a control function could throw an error, though, it is better to catch it inside the control function and handle it in a way that is most meaningful to your form and users. This control function will run anytime either firstName or lastName updates.

Fields can also be 'state-controlled' meaning that instead of returning a string value, the control function returns a FieldState object.

**Fields are Omittable**

A field's omit property determines whether it is included in the finalized form value.

**The Finalized Form of the Data is Configurable**

Finalizers allow you to transform the data that will be submitted to your backend, and configure this transformation in a declarative way. This means that  not only is the state of the form always up to date in terms of the relationship between its value and its validity, but the data is also always ready to be submitted to the backend (assuming it is in a valid state).

**Forms Can Be Nested, and First Nonvalid Field Is Tracked**

Forms may be nested, and can be used as arguments in finalizers or field control functions. Additionally, the first nonvalid (meaning errant, invalid, pending) field in the form is tracked using the InsertionOrderHeap class. In a form with multiple sub-forms spread across several pages, this could allow programmatic navigation to the first subform which is not in a valid state.

**Fields can be evaluated for validity as a group**

MultiInputValidators allow you to determine the validity of several fields as a group. An use-case could be evaluating the validity of an address after the user has completed all fields. Of course, async validation is possible, meaning an API call to the Google Maps or MapQuest APIs could be made to perform this validation.

**Extract Values allow you to hook into field values and generate values based on those fields**

If you need to generate a value that is not to be included in the form, but should be synchronized with updates to the value of a field, this can be performed by utilizing Extracted Values.

**Auto Transforms and Configuration**

By default, autoTrim is set to true. This means that before running default validators that may depend on the length of the value string of a field, that field's value will be trimmed. The field's value will also be trimmed when it is finalized. This can be configured by creating a .modeledformsreactrc file and setting the autoTrim property. Global messages can also be configured here, for instance, for internationalization purposes. Regular expressions used to provide email address validation and the like can also be configured in this file.

**Common Validators are provided out of the box**

Validators like **required, pattern, email, minDate,** and more are provided out of the box and require minimal configuration.

**Hooks and Customizable Components are also built into the library**

Hooks and components integrate the RxJS-based model with the React-based view. Components are design-agnostic and provide only what is necessary to style the component as you wish based on the corresponding field's state.

## Example

### 1. Create a RootFormTemplate!

```
import { 
  RootFormTemplate, 
  required, 
  email, 
  includesDigit, 
  inLengthRange, 
  includesLower, 
  includesUpper, 
  includesSymbol, 
  maxDate, 
  Validity, 
  State 
} from 'modeled-forms-react';

//a function that makes an API call to validate an address. Just part of this example, not included in modeled-forms-react.
import { validateAddress } from './validate-address';

export const template: RootFormTemplate = {
  fields: {
    firstName: {
      defaultValue: '',
      syncValidators: [required('First Name is a required field.')],
    },
    lastName: {
      defaultValue: '',
      syncValidators: [required('Last Name is a required field.')],
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
    address : {
      fields: {
        line1 : {
          defaultValue: '',
          syncValidators: [
            required('❌ Address Line 1 is a required field.')
          ]
        },
        line2 : '',
        city: {
          defaultValue: '',
          syncValidators: [
            required('❌ City is a required field.')
          ]
        },
        state: {
          defaultValue: '',
          syncValidators: [
            required('❌ State is a required field.'),
            inLengthRange(2, 2, '❌ Please enter a two-character state abbreviation.')
          ]
        },
        zip: {
          defaultValue: '',
          syncValidators: [
            required('❌ Zip is a required field.'),
            inLengthRange(5, 5, '❌ Please enter a 5-digit zip code.'),
            (value) => {
              const isValid = !(/\D/.test(value));
              return {
                isValid,
                message : isValid ? undefined : '❌ Zip code must only contain digits.'
              }
            }
          ]
        }
      },
      multiFieldValidators: {
        async: [
          {
            validatorFn: ({line1, line2, city, state, zip, overallValidity}) => {

              return new Promise((resolve) => {
                if(overallValidity() < Validity.VALID_FINALIZABLE) resolve({
                  isValid : false
                });
                else {
                  validateAddress(line1.value, line2.value, city.value, state.value, zip.value).then((isValid) => {
                    resolve({
                      isValid,
                      message : isValid ? undefined : 'Please enter a valid address.'
                    })
                  });
                }
              });
            },
            pendingValidatorMessage: 'Checking address fields...'
          }
        ]
      },
    extractedValues: {
      syncExtractedValues: {},
      asyncExtractedValues: {}
    }
    },
  },
  finalizedFields: {
    fullName : {
      syncFinalizerFn: ({firstName, lastName}) => {
        return firstName.value + ' ' + lastName.value
      }
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submitFn: (state : State<any>) => {
    return new Promise((resolve) => {
      console.log(state);
      resolve(state);
    });
  },
  extractedValues: {
    syncExtractedValues: {
      age : ({ birthday, overallValidity }) => {
        if (overallValidity() < Validity.VALID_FINALIZABLE) return "Unknown";
        const ageDifMs = Date.now() - new Date(birthday.value).getTime();
        const ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
      }
    },
    asyncExtractedValues: {}
  }
};

```

### Create A Component Which Displays an Extracted Value, in this case age

```
import { FormContext } from "modeled-forms-react";
import { useContext } from "react";

export function Age() {
  const formCtx = useContext(FormContext);
  if(!formCtx) throw new Error('FormCtx was null');
  const { useExtractedValue } = formCtx;

  const age = useExtractedValue('age');

  return (
    <div>
      <label>Age: {age}</label>
    </div>
  )
}
```

### Create The Form!

```
import { 
  RootFormProvider, 
  InputGroup, 
  NestedFormProvider, 
  SubmitButton, 
  ResetButton, 
  FormMessages 
} from "modeled-forms-react";
import styles from './styles.module.scss';

import { template } from "./form.template";
import { Age } from "./age.component";
export function Form() {
  return (
    <div className={styles.screen}>
      <div className={styles.form}>
        <h1>My Awesome Form</h1>
        <RootFormProvider template={template}>
          <InputGroup fieldName="firstName" labelText="First Name" inputType="text" inputGroupClassName={styles.inputGroup}  />
          <InputGroup fieldName="lastName" labelText="Last Name" inputType="text" inputGroupClassName={styles.inputGroup}  />
          <InputGroup fieldName="emailAddr" labelText="Email" inputType="email" inputGroupClassName={styles.inputGroup} />
          <InputGroup fieldName="password" labelText="Password" inputType="password" inputGroupClassName={styles.inputGroup} />
          <InputGroup fieldName="birthday" labelText="Birthday" inputType="date" inputGroupClassName={styles.inputGroup} />
          <Age />
          <NestedFormProvider fieldName="address">
            <InputGroup fieldName="line1" labelText="Address Line 1" inputType="text" inputGroupClassName={styles.inputGroup} />
            <InputGroup fieldName="line2" labelText="Address Line 2" inputType="text" inputGroupClassName={styles.inputGroup} />
            <InputGroup fieldName="city" labelText="City" inputType="text" inputGroupClassName={styles.inputGroup} />
            <InputGroup fieldName="state" labelText="State" inputType="text" inputGroupClassName={styles.inputGroup} />
            <InputGroup fieldName="zip" labelText="Zip" inputType="number" inputGroupClassName={styles.inputGroup} />
          </NestedFormProvider>
          <FormMessages idPrefix="rootForm" />
          <SubmitButton className={styles.button} />
          <ResetButton disabled={false} className={styles.button} />
        </RootFormProvider>
      </div>
    </div>
  
  );
}
```

### Style the Form!

Notice how we can hook into the validity of various components via the data-validity attribute.

```
//styles.module.scss

.screen {
  background-color: #121212;
  display : flex;
  justify-content: center;
  padding: 20px;
  width: 100vw;
  min-height: 100vh;
}

.form {
  background: linear-gradient(#9c988a, white);
  position: relative;
  padding: 12px;
  box-sizing: border-box;
  border-radius: 4px;
  width: 400px;
  height: fit-content;

  &::after {
    content: '';
	  position: absolute;
	  top: 4px;
	  left: 4px;
	  width: calc(100% - 8px);
	  height: 50%;
	  background: linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.2));
  }

  h1 {
    position: relative;
    z-index: 999;
    font-size: 1.5rem;
  }
}

.inputGroup {
  position: relative;
  z-index: 999;
  display: flex;
  flex-direction: column;
}

.inputGroup .label {
  margin : 4px;
}

.inputGroup :global {
  .input {
    transition: all 300ms ease-in-out;
    outline: 1px solid red;
    margin : 4px;
  }
  
  .input[data-validity="PENDING"] {
    transition: all 300ms ease-in-out;
    outline: 1px solid gray;
    margin : 4px;
  }
  
  .input[data-validity="VALID"] {
    outline: none;
  }
  

  .messages {
    display: flex;
    flex-direction: column;

    .message {
      background-color: rgba(255, 171, 199, 0.8);
      margin: 2px;
      font-size: 10px;
    }

    .message[data-validity="VALID"] {
      background-color: lightgreen;
    }
  } 
}
```

More complete docs will be published along with the alpha release.