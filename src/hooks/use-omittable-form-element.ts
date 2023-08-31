import { useState, useEffect, useRef } from 'react';
import { AbstractField } from '../model/fields/base/abstract-field';
import { AbstractNestedForm } from '../model/forms/abstract-nested-form';
import { Subscription } from 'rxjs';

export function useOmittableFormElement(
  formElement: AbstractField | AbstractNestedForm,
) {
  const [omitFormElement, _setOmitFormElement] = useState(formElement.omit);
  const subRef = useRef<Subscription | null>(null);

  useEffect(() => {
    subRef.current = formElement.stateChanges.subscribe(change => {
      _setOmitFormElement(change.omit ? true : false);
    });
    return () => subRef.current?.unsubscribe();
  }, []);

  const setOmitFormElement = (omit: boolean) => {
    formElement.omit = omit;
  };

  return {
    omitFormElement,
    setOmitFormElement,
  };
}
