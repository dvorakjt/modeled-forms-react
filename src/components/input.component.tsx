import React, { useContext } from 'react';
import { FormContext } from './form-context';
import { validityToString } from './util/validity-to-string';
import { Validity } from '../model/state/validity.enum';
import { getFieldAriaDescribedBy } from './util/get-field-aria-described-by';
import { RootFormContext } from './root-form-provider.component';
import { Visited } from '../model/state/visited.enum';
import { Modified } from '../model/state/modified-enum';

export type InputProps = {
  fieldName : string;
  inputType : string;
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

export function Input({fieldName, inputType, readOnly = false, autoComplete, placeholder, list, autoFocus, step, max, min, maxLength, size} : InputProps) {
  const rootFormCtx = useContext(RootFormContext);
  const formCtx = useContext(FormContext);
  if(!rootFormCtx) throw new Error('Input cannot access properties of null or undefined RootFormContext');
  if(!formCtx) throw new Error('Input cannot access properties of null or undefined FormContext');
  else {
    const { useField } = formCtx;
    const { value, validity, messages, visited, modified, updateValue, visit} = useField(fieldName);
    const { useSubmissionAttempted } = rootFormCtx;
    const { submissionAttempted } = useSubmissionAttempted();
    
    return (
    <input 
      id={fieldName}
      name={fieldName}
      type={inputType}
      className="input"
      data-validity={(submissionAttempted || visited === Visited.YES || modified === Modified.YES) ? validityToString(validity) : validityToString(Validity.VALID_FINALIZABLE)} 
      aria-invalid={(submissionAttempted || visited === Visited.YES || modified === Modified.YES) && validity <= Validity.INVALID}
      value={value} 
      onChange={(e) => {
       updateValue(e.target.value);
      }}
      readOnly={readOnly}
      aria-readonly={readOnly}
      aria-describedby={(submissionAttempted || visited === Visited.YES || modified === Modified.YES) ? getFieldAriaDescribedBy(fieldName, messages.length) : ""}
      autoComplete={autoComplete}
      placeholder={placeholder}
      list={list}
      autoFocus={autoFocus}
      step={step}
      max={max}
      min={min}
      maxLength={maxLength}
      size={size}
      onBlur={visit}
    />);
  }
}