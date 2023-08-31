import { useState, useEffect, useRef } from 'react';
import { AbstractField } from '../model/fields/base/abstract-field';
import { Subscription } from 'rxjs';

export function useField(field: AbstractField) {
  const [value, setValue] = useState(field.state.value);
  const [validity, setValidity] = useState(field.state.validity);
  const [messages, setMessages] = useState(field.state.messages);
  const stateChangesSubRef = useRef<Subscription | null>(null);

  useEffect(() => {
    stateChangesSubRef.current = field.stateChanges.subscribe(change => {
      setValue(change.value);
      setValidity(change.validity);
      setMessages(change.messages);
    });
    return () => stateChangesSubRef.current?.unsubscribe();
  }, []);

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
