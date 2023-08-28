import { useState } from 'react';
import { AbstractRootForm } from '../model/forms/abstract-root-form';

export function useSubmissionAttempted(form: AbstractRootForm) {
  const [submissionAttempted, setSubmissionAttempted] = useState(
    form.submissionState.submissionAttempted,
  );

  form.submissionStateChanges.subscribe(change => {
    setSubmissionAttempted(change.submissionAttempted);
  });

  return {
    submissionAttempted,
  };
}
