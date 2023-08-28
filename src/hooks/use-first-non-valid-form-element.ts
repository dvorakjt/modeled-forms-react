import { useState } from 'react';
import { AbstractRootForm } from '../model/forms/abstract-root-form';
import { AbstractNestedForm } from '../model/forms/abstract-nested-form';

export function useFirstNonValidFormElement(
  form: AbstractRootForm | AbstractNestedForm,
) {
  const [firstNonValidFormElement, setFirstNonValidFormElement] = useState(
    form.firstNonValidFormElement,
  );

  form.firstNonValidFormElementChanges.subscribe(change => {
    setFirstNonValidFormElement(change);
  });

  return {
    firstNonValidFormElement,
  };
}
