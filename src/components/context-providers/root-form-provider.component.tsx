'use client';
import React, { PropsWithChildren, createContext } from "react";
import { useRootForm } from "../../hooks/use-root-form";
import { FormContext, FormContextType } from "./form-context";
import { type RootFormTemplate } from "../../model/templates/forms/root-form-template.interface";
import { useSubmissionAttempted } from "../../hooks/use-submission-attempted";

export interface RootFormProviderProps {
  template : RootFormTemplate
};

export interface RootFormContextType {
  useSubmissionAttempted : () => ReturnType<typeof useSubmissionAttempted>;
  submit : () => Promise<any>;
}

export const RootFormContext = createContext<RootFormContextType | null>(null);

export function RootFormProvider({ template, children } : PropsWithChildren<RootFormProviderProps>) {
  const rootForm = useRootForm(template);

  const rootFormCtxValue : RootFormContextType = {
    useSubmissionAttempted : rootForm.useSubmissionAttempted,
    submit : rootForm.submit
  }

  const formCtxValue : FormContextType = {
    useFormState : rootForm.useFormState,
    useFirstNonValidFormElement : rootForm.useFirstNonValidFormElement,
    useField : rootForm.useField,
    useDualField : rootForm.useDualField,
    useNestedForm : rootForm.useNestedForm,
    useOmittableFormElement : rootForm.useOmittableFormElement,
    useExtractedValue : rootForm.useExtractedValue,
    reset : rootForm.reset
  }

  return (
    <RootFormContext.Provider value={rootFormCtxValue}>
      <FormContext.Provider value={formCtxValue}>
        {children}
      </FormContext.Provider>
    </RootFormContext.Provider>
  )
} 