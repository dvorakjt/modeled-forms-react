import { useRef, useMemo } from 'react';
import { RootFormTemplate } from '../model/templates/forms/root-form-template.interface';
import { container } from '../model/container';
import { useForm } from './use-form';
import { useSubmissionAttempted as _useSubmissionAttempted } from './use-submission-attempted';

const rootFormTemplateParser = container.services.RootFormTemplateParser;

export function useRootForm(template: RootFormTemplate) {
  const form = useMemo(() => rootFormTemplateParser.parseTemplate(template), [template]) ;
  const formRef = useRef(form);
  const useSubmissionAttempted = () => _useSubmissionAttempted(formRef.current);
  const submit = () => formRef.current.submit();


  return {
    ...useForm(formRef.current),
    useSubmissionAttempted,
    submit,
  };
}
