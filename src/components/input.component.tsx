import React, { useContext } from 'react';
import { FormContext } from './form-context';

export type InputProps = {
  fieldName : string;
  inputType : string;
  inputClassName : string;
  readOnly? : boolean;
}

export function Input({fieldName, inputType, inputClassName, readOnly = false} : InputProps) {
  const formCtx = useContext(FormContext);
  if(formCtx === null) throw new Error('Input cannot access property useField of null FormContext');
  else {
    const { useField } = formCtx;
    const { value, validity, updateValue } = useField(fieldName);
    
    return <input type={inputType} className={inputClassName} readOnly={readOnly} data-validity={validity} value={value} onChange={(e) => {
      updateValue(e.target.value);
    }} />
  }
}