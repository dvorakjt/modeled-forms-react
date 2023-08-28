import { useState } from 'react';
import { AbstractNestedForm } from '../model/forms/abstract-nested-form';
import { AbstractRootForm } from '../model/forms/abstract-root-form';

export function useFormState(form: AbstractRootForm | AbstractNestedForm) {
  const [value, setValue] = useState(form.state.value);
  const [validity, setValidity] = useState(form.state.validity);
  const [messages, setMessages] = useState(form.state.messages);

  form.stateChanges.subscribe(stateChange => {
    //here we would be able to compare equality if records were used to maintain state
    setValue(stateChange.value);
    setValidity(stateChange.validity);
    setMessages(stateChange.messages);
  });

  return {
    value,
    validity,
    messages,
  };
}
