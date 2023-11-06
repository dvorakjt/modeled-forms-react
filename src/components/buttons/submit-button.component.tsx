'use client';
import React, {CSSProperties, MouseEventHandler, useContext} from 'react';
import { RootFormContext } from '../context-providers/root-form-provider.component'; 
import { FormContext } from '../context-providers/form-context';
import { Validity } from '../../model/state/validity.enum';

interface SubmitButtonProps {
  className? : string;
  style? : CSSProperties;
  onResolve : (res : any) => void;
  onReject : (e : any) => void;
  onFinally? : () => void;
}

export function SubmitButton({ className, style, onResolve, onReject, onFinally} : SubmitButtonProps) {
  const rootFormCtx = useContext(RootFormContext);
  const formCtx = useContext(FormContext);
  if(rootFormCtx === null) throw new Error('Cannot render SubmitButton inside null RootFormContext');
  if(formCtx === null) throw new Error('Cannot Render SubmitButton inside null FormContext');

  const { submit } = rootFormCtx;
  const { validity } = formCtx.useFormState();

  const onClick : MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    submit()
      .then((value) => onResolve(value))
      .catch((e) => onReject(e))
      .finally(() => {
        if(onFinally) onFinally();
      });
  }

  return <button 
    className={className} onClick={onClick} 
    style={style}
    disabled={validity < Validity.VALID_FINALIZABLE}
  >Submit</button>
}