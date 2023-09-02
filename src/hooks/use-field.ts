import { useState, useEffect, useRef } from 'react';
import { AbstractField } from '../model/fields/base/abstract-field';
import { Subscription } from 'rxjs';

export function useField(field: AbstractField) {
  const [value, setValue] = useState(field.state.value);
  const [validity, setValidity] = useState(field.state.validity);
  const [messages, setMessages] = useState(field.state.messages);
  const [interactions, setInteractions] = useState(field.interactions);
  const stateChangesSubRef = useRef<Subscription | null>(null);
  const interactionsChangesSubRef = useRef<Subscription | null>(null);

  useEffect(() => {
    stateChangesSubRef.current = field.stateChanges.subscribe(change => {
      setValue(change.value);
      setValidity(change.validity);
      setMessages(change.messages);
    });
    interactionsChangesSubRef.current = field.interactionsChanges.subscribe(change => {
      setInteractions(change);
    });
    return () => { 
      stateChangesSubRef.current?.unsubscribe();
      interactionsChangesSubRef.current?.unsubscribe();
    }
  }, []);

  const updateValue = (value: string) => {
    field.setValue(value);
  };

  const visit = () => {
    field.interactions = {
      ...field.interactions,
      visited : true
    }
  }

  const reset = () => field.reset();

  return {
    value,
    validity,
    messages,
    updateValue,
    interactions,
    visit,
    reset,
  };
}
