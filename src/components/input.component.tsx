import React, { useContext } from 'react';
import { FormContext } from './form-context';
import { validityToString } from './util/validity-to-string';

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

//need to include aria-invalid and aria-errormessage, these should only be set after the form has been submitted
//these props should be added to InputGroup
export function Input({fieldName, inputType, inputClassName, readOnly = false, autoComplete, placeholder, list, autoFocus, step, max, min, maxLength, size} : InputProps) {
  const formCtx = useContext(FormContext);
  if(formCtx === null) throw new Error('Input cannot access property useField of null FormContext');
  else {
    const { useField } = formCtx;
    const { value, validity, updateValue } = useField(fieldName);
    
    return (
    <input 
      id={fieldName}
      name={fieldName}
      type={inputType}
      className={inputClassName} 
      data-validity={validityToString(validity)} 
      value={value} 
      onChange={(e) => {
       updateValue(e.target.value);
      }}
      readOnly={readOnly} 
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