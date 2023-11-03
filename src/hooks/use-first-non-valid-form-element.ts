import { useState, useEffect, useRef } from 'react';
import { AbstractRootForm } from '../model/forms/abstract-root-form';
import { AbstractNestedForm } from '../model/forms/abstract-nested-form';
import { Subscription } from 'rxjs';

export function useFirstNonValidFormElement(
  form: AbstractRootForm | AbstractNestedForm,
) {
  const [firstNonValidFormElement, setFirstNonValidFormElement] = useState(
    form.firstNonValidFormElement,
  );
  const subRef = useRef<Subscription | null>(null);

  useEffect(() => {
    subRef.current = form.firstNonValidFormElementChanges.subscribe(change => {
      setFirstNonValidFormElement(change);
    });
    return () => subRef.current?.unsubscribe();
  }, []);

  
  return firstNonValidFormElement;
}
