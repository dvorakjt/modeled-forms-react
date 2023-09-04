import React, { useContext } from 'react';
import { FormContext } from './form-context';
import { validityToString } from './util/validity-to-string';
import { Validity } from '../model/state/validity.enum';
import { getFieldAriaDescribedBy } from './util/get-field-aria-described-by';
import { RootFormContext } from './root-form-provider.component';

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
    const { value, validity, messages, updateValue} = useField(fieldName);
    // const { useSubmissionAttempted } = rootFormCtx;
    // const { submissionAttempted } = useSubmissionAttempted();
    
    //always set the validity property to the actual validity
    //the visited, modified, submitted properties can be used in conjunction with this property to determine how to style the component
    //aria-invalid is set only if visited, modified or submitted AND the field is invalid
    //similarly, aria-describedby is set only under the same conditions, with the exception that the validity does not have to be invalid
    //onBlur should call the field's visit method
    return (
    <input 
      id={fieldName}
      name={fieldName}
      type={inputType}
      className="input"
      data-validity={validityToString(validity)} 
      // data-visited={}
      // data-modified={}
      // data-submitted={submissionAttempted}
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
      // onBlur={visit}
    />);
  }
}