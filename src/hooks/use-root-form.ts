import { useRef, useMemo } from 'react';
import { RootFormTemplate } from '../model/templates/forms/root-form-template.interface';
import { container } from '../model/container';
import { useForm } from './use-form';
import { TrySubmitArgsObject } from '../model/submission/submission-manager.interface';

const rootFormTemplateParser = container.services.RootFormTemplateParser;

export function useRootForm(template: RootFormTemplate) {
  const form = useMemo(
    () => rootFormTemplateParser.parseTemplate(template),
    [template],
  );
  const formRef = useRef(form);
  const trySubmit = (argsObject: TrySubmitArgsObject) =>
    formRef.current.trySubmit(argsObject);

  return {
    ...useForm(formRef.current),
    trySubmit,
  };
}
