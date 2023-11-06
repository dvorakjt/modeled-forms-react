'use client';
import React, {CSSProperties, MouseEventHandler, useContext} from 'react';
import { RootFormContext } from '../context-providers/root-form-provider.component'; 
import { FormContext } from '../context-providers/form-context';
import { Validity } from '../../model/state/validity.enum';

interface SubmitButtonProps {
  className? : string;
  style? : CSSProperties;
  onSuccess? : (res : any) => void;
  onError? : (e : any) => void;
  onFinally? : () => void;
  enableOnlyWhenValid? : boolean;
}

export function SubmitButton({ className, style, onSuccess, onError, onFinally, enableOnlyWhenValid} : SubmitButtonProps) {
  const rootFormCtx = useContext(RootFormContext);
  const formCtx = useContext(FormContext);
  if(rootFormCtx === null) throw new Error('Cannot render SubmitButton inside null RootFormContext');
  if(formCtx === null) throw new Error('Cannot Render SubmitButton inside null FormContext');

  const { trySubmit } = rootFormCtx;
  const { validity } = formCtx.useFormState();

  const onClick : MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    trySubmit({ onSuccess, onError, onFinally })
  }

  return <button 
    className={className} onClick={onClick} 
    style={style}
    disabled={enableOnlyWhenValid && validity < Validity.VALID_FINALIZABLE}
  >Submit</button>
}