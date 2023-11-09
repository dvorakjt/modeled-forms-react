import { useState, useEffect, useRef } from 'react';
import { Subscription } from 'rxjs';
import { AbstractRootForm } from '../model/forms/abstract-root-form';
import { AbstractNestedForm } from '../model/forms/abstract-nested-form';

export function useConfirmationAttempted(form: AbstractRootForm | AbstractNestedForm) {
  const [confirmationAttempted, setConfirmationAttempted] = useState(form.confirmationAttempted);
  const subRef = useRef<Subscription | null>(null);

  useEffect(() => {
    subRef.current = form.confirmationAttemptedChanges.subscribe(change => {
      setConfirmationAttempted(change);
    });
    return () => subRef.current?.unsubscribe();
  }, []);

  return confirmationAttempted;
}
