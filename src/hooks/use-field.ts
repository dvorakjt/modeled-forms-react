import { useState, useEffect, useRef } from 'react';
import { AbstractField } from '../model/fields/base/abstract-field';
import { Subscription } from 'rxjs';
import { Visited } from '../model/state/visited.enum';

export function useField(field: AbstractField) {
  const [value, setValue] = useState(field.state.value);
  const [validity, setValidity] = useState(field.state.validity);
  const [messages, setMessages] = useState(field.state.messages);
  const [visited, setVisited] = useState(field.state.visited);
  const [modified, setModified] = useState(field.state.modified);

  const stateChangesSubRef = useRef<Subscription | null>(null);

  useEffect(() => {
    stateChangesSubRef.current = field.stateChanges.subscribe(change => {
      setValue(change.value);
      setValidity(change.validity);
      setMessages(change.messages);
      setVisited(change.visited);
      setModified(change.modified);
    });
    return () => { 
      stateChangesSubRef.current?.unsubscribe();
    }
  }, []);

  const updateValue = (value: string) => {
    field.setValue(value);
  };

  const reset = () => field.reset();

  const visit = () => { 
    if(field.state.visited === Visited.NO) {
      field.setState({
        visited : Visited.YES
      });
    }
  }

  return {
    value,
    validity,
    messages,
    updateValue,
    reset,
    visited,
    modified,
    visit
  };
}
