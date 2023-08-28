import { useState } from 'react';
import { AbstractField } from '../model/fields/base/abstract-field';

export function useField(field: AbstractField) {
  const [value, setValue] = useState(field.state.value);
  const [validity, setValidity] = useState(field.state.validity);
  const [messages, setMessages] = useState(field.state.messages);

  field.stateChanges.subscribe(change => {
    setValue(change.value);
    setValidity(change.validity);
    setMessages(change.messages);
  });

  const updateValue = (value: string) => {
    field.setValue(value);
  };

  const reset = field.reset;

  return {
    value,
    validity,
    messages,
    updateValue,
    reset,
  };
}
