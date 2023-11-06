'use client';
import React, { PropsWithChildren, createContext } from "react";
import { useRootForm } from "../../hooks/use-root-form";
import { FormContext, FormContextType } from "./form-context";
import { type RootFormTemplate } from "../../model/templates/forms/root-form-template.interface";
import { TrySubmitArgsObject } from "../../model/submission/submission-manager.interface";

export interface RootFormProviderProps {
  template : RootFormTemplate
};

export interface RootFormContextType {
  trySubmit : (argsObject : TrySubmitArgsObject) => void;
}

export const RootFormContext = createContext<RootFormContextType | null>(null);

export function RootFormProvider({ template, children } : PropsWithChildren<RootFormProviderProps>) {
  const rootForm = useRootForm(template);

  const rootFormCtxValue : RootFormContextType = {
    trySubmit : rootForm.trySubmit
  }

  const formCtxValue : FormContextType = {
    useFormState : rootForm.useFormState,
    useConfirmationAttempted : rootForm.useConfirmationAttempted,
    tryConfirm : rootForm.tryConfirm,
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