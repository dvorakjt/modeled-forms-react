import { email } from "./model/constituents/validators/util/email";
import { required } from "./model/constituents/validators/util/required";
import { Services, getContainer } from "./model/container";
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
    valueControlFn: ({ fieldB }) => {
      return fieldB.value.toUpperCase()
    }
  },
  fieldD : {
    primaryDefaultValue: 'field d',
    secondaryDefaultValue: 'FIELD D',
    omitByDefault: true
  }
});

for(const key in formElementMap) {
  console.log(key);
  console.log(formElementMap[key].state);
}