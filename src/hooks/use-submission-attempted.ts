import { useState, useEffect, useRef } from 'react';
import { AbstractRootForm } from '../model/forms/abstract-root-form';
import { Subscription } from 'rxjs';

export function useSubmissionAttempted(form: AbstractRootForm) {
  const [submissionAttempted, setSubmissionAttempted] = useState(
    form.submissionState.submissionAttempted,
  );
  const subRef = useRef<Subscription | null>(null);

  useEffect(() => {
    subRef.current = form.submissionStateChanges.subscribe(change => {
      setSubmissionAttempted(change.submissionAttempted);
    });
    return () => subRef.current?.unsubscribe();
  }, []);

  return {
    submissionAttempted,
  };
}
