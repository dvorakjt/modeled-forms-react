import { useState, useEffect, useRef } from 'react';
import { AbstractField } from '../model/fields/base/abstract-field';
import { Subscription } from 'rxjs';
import { Visited } from '../model/state/visited.enum';
import { Focused } from '../model/state/focused.enum';

export function useField(field: AbstractField) {
  const [state, setState] = useState({
    value: field.state.value,
    validity: field.state.validity,
    messages: field.state.messages,
    visited: field.state.visited,
    modified: field.state.modified,
    focused : field.state.focused
  });

  const stateChangesSubRef = useRef<Subscription | null>(null);

  useEffect(() => {
    stateChangesSubRef.current = field.stateChanges.subscribe(stateChange => {
      setState({
        value: stateChange.value,
        validity: stateChange.validity,
        messages: stateChange.messages,
        visited: stateChange.visited,
        modified: stateChange.modified,
        focused : stateChange.focused
      });
    });
    return () => {
      stateChangesSubRef.current?.unsubscribe();
    };
  }, []);

  const updateValue = (value: string) => {
    field.setValue(value);
  };

  const reset = () => field.reset();

  const visit = () => {
    if (field.state.visited === Visited.NO) {
      field.setState({
        visited: Visited.YES,
      });
    }
  };

  const focus = () => {
    if (field.state.focused === Focused.NO)
    {
      field.setState({
        focused : Focused.YES
      });
    }
  }

  return {
    ...state,
    updateValue,
    reset,
    visit,
    focus
  };
}
