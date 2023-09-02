import React, { useContext } from 'react';
import { FormContext } from './form-context';
import { validityToString } from './util/validity-to-string';
import { Validity } from '../model/state/validity.enum';
import { getFieldAriaDescribedBy } from './util/get-field-aria-described-by';

export type InputProps = {
  fieldName : string;
  inputType : string;
  inputClassName : string;
  readOnly? : boolean;
  autoComplete? : string;
  placeholder? : string;
  list? : string;
  autoFocus? : boolean;
  step? : number;
  max? : string;
  min? : string;
  maxLength? : number;
  size? : number;
}

export function Input({fieldName, inputType, inputClassName, readOnly = false, autoComplete, placeholder, list, autoFocus, step, max, min, maxLength, size} : InputProps) {
  const formCtx = useContext(FormContext);
  if(formCtx === null) throw new Error('Input cannot access property useField of null FormContext');
  else {
    const { useField } = formCtx;
    const { value, validity, messages, updateValue } = useField(fieldName);
    
    return (
    <input 
      id={fieldName}
      name={fieldName}
      type={inputType}
      className={inputClassName} 
      data-validity={validityToString(validity)} 
      aria-invalid={validity <= Validity.INVALID}
      value={value} 
      onChange={(e) => {
       updateValue(e.target.value);
      }}
      readOnly={readOnly}
      aria-readonly={readOnly}
      aria-describedby={getFieldAriaDescribedBy(fieldName, messages.length)}
      autoComplete={autoComplete}
      placeholder={placeholder}
      list={list}
      autoFocus={autoFocus}
      step={step}
      max={max}
      min={min}
      maxLength={maxLength}
      size={size}
    />);
  }
}