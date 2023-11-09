import React, { useContext, PropsWithChildren } from 'react';
import { FormContext } from '../context-providers';

export interface OmittableContentProps {
  fieldName : string;
}

export function OmittableContent({ fieldName, children } : PropsWithChildren<OmittableContentProps>) {
  const formCtx = useContext(FormContext);
  if(!formCtx) throw new Error('OmittableContent cannot be rendered outside of a FormContext provider.');

  const { useOmittableFormElement } = formCtx;

  const { omitFormElement } = useOmittableFormElement(fieldName);

  if(omitFormElement) return null;

  return (
    <>
     {children}
    </>
  );
}