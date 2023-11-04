'use client';
import React, { CSSProperties, useContext } from 'react';
import { FormContext } from '../context-providers/form-context';
import { validityToString } from '../util/validity-to-string';
import { Validity } from '../../model/state/validity.enum';
import { getAriaDescribedBy } from '../util/get-aria-described-by';
import { RootFormContext } from '../context-providers/root-form-provider.component';
import { Visited } from '../../model/state/visited.enum';
import { Modified } from '../../model/state/modified-enum';
import { getRadioInputId } from '../util/get-radio-input-id';

interface RadioInputProps {
  fieldName : string;
  value : string;
  labelText : string;
  className? : string;
  style? : CSSProperties;
}

export function RadioInput({ fieldName, value, className, style, labelText} : RadioInputProps) {
  const rootFormCtx = useContext(RootFormContext);
  const formCtx = useContext(FormContext);
  if(!rootFormCtx) throw new Error('Input cannot access properties of null or undefined RootFormContext');
  if(!formCtx) throw new Error('Input cannot access properties of null or undefined FormContext');
  else {
    const { useField } = formCtx;
    const { value : fieldValue, validity, messages, visited, modified, updateValue, visit} = useField(fieldName);
    const { useSubmissionAttempted } = rootFormCtx;
    const submissionAttempted = useSubmissionAttempted();

    return (
      <label 
        htmlFor={getRadioInputId(fieldName, value)} 
        className={className} 
        style={style}
        data-validity={(submissionAttempted || visited === Visited.YES || modified === Modified.YES) ? validityToString(validity) : validityToString(Validity.VALID_FINALIZABLE)} 
        aria-invalid={(submissionAttempted || visited === Visited.YES || modified === Modified.YES) && validity <= Validity.INVALID}
      >
        <input 
          type='radio' 
          name={fieldName} 
          id={getRadioInputId(fieldName, value)} 
          value={value} 
          checked={fieldValue === value}
          className={className}
          style={style}
          onClick={visit}
          onChange={(e) => updateValue(e.target.value)}
          aria-describedby={(submissionAttempted || visited === Visited.YES || modified === Modified.YES) ? getAriaDescribedBy(fieldName, messages) : ""}
        />
        {labelText}
      </label>
    )
  }
}