import { RootFormTemplateParser } from "./model";
import { AbstractField } from "./model/fields/base/abstract-field";
import type { RootFormTemplate } from "./model/templates/forms/root-form-template.interface";
import { required } from "./model/validators/util/required";

const template : RootFormTemplate = {
  fields: {
    hello : 'hello',
    world : {
      defaultValue: 'world'
    },
    helloWorld : {
      defaultValue: '',
      syncValueControlFn: ({hello, world}) => {
        return hello.value + " " + world.value;
      }
    },
    firstName: {
      defaultValue: '',
      syncValidators: [
        required('first name is required')
      ]
    },
    lastName : {
      defaultValue: '',
      syncValidators: [
        required('last name is required')
      ]
    }
  },
  multiFieldValidators: {
    sync: [
      ({firstName, lastName}) => {
        const isValid = firstName.value !== lastName.value;
        return {
          isValid,
          message: !isValid ? 'First name must not equal last name.' : undefined
        }
      }
    ]
  },
  finalizerTemplateDictionary: {
    fullName : {
      syncFinalizerFn: ({ firstName, lastName }) => {
        return firstName.value + ' ' + lastName.value;
      },
      preserveOriginalFields: true
    }
  },
  submitFn: (formState) => {
    return new Promise((resolve) => {
      console.log(formState);
      resolve(formState);
    })
  }
}

const form = RootFormTemplateParser.parseTemplate(template);
form.stateChanges.subscribe(stateChange => {
  console.log(stateChange);
});
(form.userFacingFields["firstName"] as AbstractField).setValue('Fred');
(form.userFacingFields["lastName"] as AbstractField).setValue('Fred');
(form.userFacingFields["lastName"] as AbstractField).setValue('Guy');
form.submit();
