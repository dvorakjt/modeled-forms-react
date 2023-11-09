import React, { PropsWithChildren, useContext } from 'react';
import { FormContext } from './form-context';

export interface NestedFormProviderProps {
  fieldName : string;
}

export function NestedFormProvider({fieldName, children} : PropsWithChildren<NestedFormProviderProps>) {
  const formCtx = useContext(FormContext);
  if(formCtx === null) throw new Error('NestedFormProvider cannot access useNestedForm property of null context.');
  else {
    const { useNestedForm } = formCtx;
    const nestedForm = useNestedForm(fieldName);

    return (
      <FormContext.Provider value={nestedForm}>
        {children}
      </FormContext.Provider>
    )
  }
}