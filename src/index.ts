import { email } from "./model/constituents/validators/util/email";
import { required } from "./model/constituents/validators/util/required";
import { Services, getContainer } from "./model/container2";
import { Field } from "./model/constituents/fields/base/field.interface";
import { Validity } from "./model/constituents/state/validity.enum";
import { FormElementsParser } from "./model/types/parser/form-elements/form-elements-parser.interface";

const container = getContainer();

const formElementsParser = container.get<FormElementsParser>(Services.FormElementsParser);

const formElementMap = formElementsParser.parseTemplate({
  fieldA : 'a field',
  fieldB : {
    defaultValue: 'field b',
    syncValidators: [required('Field B is required.'), email('Field B must be an email.')]
  },
  fieldC : {
    defaultValue: 'field c',
    syncValueControlFn: ({ fieldB }) => {
      if(fieldB.validity < Validity.VALID_FINALIZABLE) return;
      return fieldB.value.toUpperCase()
    }
  },
  fieldD : {
    primaryDefaultValue: 'field d',
    secondaryDefaultValue: 'FIELD D',
    omitByDefault: true
  }
});

(formElementMap.fieldB as Field).setValue('new value in field B');
(formElementMap.fieldB as Field).setValue('user@example.com');

for(const key in formElementMap) {
  console.log(key);
  console.log(formElementMap[key].state);
}