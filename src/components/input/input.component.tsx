import React, { CSSProperties, useContext } from 'react';
import { FormContext } from '../context-providers/form-context';
import { validityToString } from '../util/validity-to-string';
import { Validity } from '../../model/state/validity.enum';
import { getAriaDescribedBy } from '../util/get-aria-described-by';
import { Visited } from '../../model/state/visited.enum';
import { Modified } from '../../model/state/modified.enum';

export interface InputProps {
  fieldName : string;
  type : string;
  className? : string;
  style? : CSSProperties;
  readOnly? : boolean;
  autoComplete? : string;
  disabled? : boolean;
  placeholder? : string;
  list? : string;
  autoFocus? : boolean;
  step? : number;
  max? : string;
  min? : string;
  maxLength? : number;
  size? : number;
}

export function Input({fieldName, className, type, disabled, readOnly = false, autoComplete, placeholder, list, autoFocus, step, max, min, maxLength, size, style} : InputProps) {
  const formCtx = useContext(FormContext);
  if(!formCtx) throw new Error('Input cannot access properties of null or undefined FormContext');
  else {
    const { useField, useConfirmationAttempted } = formCtx;
    const { value, validity, messages, visited, modified, updateValue, visit} = useField(fieldName);

    const confirmationAttempted = useConfirmationAttempted();

    return (
    <input 
      id={fieldName}
      name={fieldName}
      type={type}
      className={className}
      data-validity={(confirmationAttempted || visited === Visited.YES || modified === Modified.YES) ? validityToString(validity) : validityToString(Validity.VALID_FINALIZABLE)} 
      aria-invalid={(confirmationAttempted || visited === Visited.YES || modified === Modified.YES) && validity <= Validity.INVALID}
      data-visited={visited !== Visited.NO ? true : null}
      data-modified={modified !== Modified.NO ? true : null}
      value={value} 
      onChange={(e) => {
       updateValue(e.target.value);
      }}
      readOnly={readOnly}
      aria-readonly={readOnly}
      aria-describedby={(confirmationAttempted || visited === Visited.YES || modified === Modified.YES) ? getAriaDescribedBy(fieldName, messages) : ""}
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
      style={style}
      disabled={disabled}
    />);
  }
}