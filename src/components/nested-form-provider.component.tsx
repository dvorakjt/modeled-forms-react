import React, { PropsWithChildren, useContext } from 'react';
import { FormContext } from './form-context';

type NestedFormProviderProps = {
  fieldName : string;
} & PropsWithChildren;

export function NestedFormProvider({fieldName, children} : NestedFormProviderProps) {
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