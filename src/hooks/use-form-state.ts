import { useState, useEffect, useRef } from 'react';
import { AbstractNestedForm } from '../model/forms/abstract-nested-form';
import { AbstractRootForm } from '../model/forms/abstract-root-form';
import { Subscription } from 'rxjs';

export function useFormState(form: AbstractRootForm | AbstractNestedForm) {
  const [state, setState] = useState({
    value: form.state.value,
    validity: form.state.validity,
    messages: form.state.messages,
    visited: form.state.visited,
    modified: form.state.modified,
    focused : form.state.focused
  });

  const subRef = useRef<Subscription | null>(null);

  useEffect(() => {
    subRef.current = form.stateChanges.subscribe(stateChange => {
      setState({
        value: stateChange.value,
        validity: stateChange.validity,
        messages: stateChange.messages,
        visited: stateChange.visited,
        modified: stateChange.modified,
        focused : stateChange.focused
      });
    });
    return () => subRef.current?.unsubscribe();
  }, []);

  return state;
}
