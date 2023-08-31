import React, {useContext} from 'react';
import { RootFormContext } from './root-form-provider.component'; 
import { FormContext } from './form-context';
import { Validity } from '../model/state/validity.enum';

interface SubmitButtonProps {
  className : string;
}

export function SubmitButton({ className } : SubmitButtonProps) {
  const rootFormCtx = useContext(RootFormContext);
  const formCtx = useContext(FormContext);
  if(rootFormCtx === null) throw new Error('Cannot render SubmitButton inside null RootFormContext');
  if(formCtx === null) throw new Error('Cannot Render SubmitButton inside null FormContext');

  const { submit } = rootFormCtx;
  const { validity } = formCtx.useFormState();

  return <button className={className} onClick={submit} disabled={validity < Validity.VALID_FINALIZABLE}>Submit</button>
}