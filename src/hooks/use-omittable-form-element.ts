import { useState } from 'react';
import { AbstractField } from '../model/fields/base/abstract-field';
import { AbstractNestedForm } from '../model/forms/abstract-nested-form';

export function useOmittableFormElement(
  formElement: AbstractField | AbstractNestedForm,
) {
  const [omitFormElement, _setOmitFormElement] = useState(formElement.omit);

  formElement.stateChanges.subscribe(change => {
    _setOmitFormElement(change.omit ? true : false);
  });

  const setOmitFormElement = (omit: boolean) => {
    formElement.omit = omit;
  };

  return {
    omitFormElement,
    setOmitFormElement,
  };
}
