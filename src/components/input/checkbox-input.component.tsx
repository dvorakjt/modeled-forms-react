'use client';
import React, { CSSProperties, useContext } from 'react';
import { FormContext } from '../context-providers/form-context';
import { validityToString } from '../util/validity-to-string';
import { Validity } from '../../model/state/validity.enum';
import { getAriaDescribedBy } from '../util/get-aria-described-by';
import { RootFormContext } from '../context-providers/root-form-provider.component';
import { Visited } from '../../model/state/visited.enum';
import { Modified } from '../../model/state/modified-enum';

interface CheckboxInputProps {
  fieldName : string;
  value : string;
  labelText : string;
  labelClassName? : string;
  labelStyle? : CSSProperties;
  checkboxClassName? : string;
  checkboxStyle? : CSSProperties;
}

export function CheckboxInput({ fieldName, value, labelText, labelClassName, labelStyle, checkboxClassName, checkboxStyle} : CheckboxInputProps) {
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
      <>
        <input 
          type='checkbox' 
          name={fieldName} 
          id={fieldName} 
          value={value} 
          checked={fieldValue === value}
          className={checkboxClassName}
          style={checkboxStyle}
          onClick={visit}
          onChange={() => {
            updateValue(fieldValue === value ? '' : value)
          }}
          aria-describedby={(submissionAttempted || visited === Visited.YES || modified === Modified.YES) ? getAriaDescribedBy(fieldName, messages) : ""}
          aria-invalid={(submissionAttempted || visited === Visited.YES || modified === Modified.YES) && validity <= Validity.INVALID}
          data-validity={(submissionAttempted || visited === Visited.YES || modified === Modified.YES) ? validityToString(validity) : validityToString(Validity.VALID_FINALIZABLE)} 
          data-visited={visited !== Visited.NO ? true : null}
          data-modified={modified !== Modified.NO ? true : null}
        />
        <label 
          htmlFor={fieldName} 
          className={labelClassName} 
          style={labelStyle}
          data-validity={(submissionAttempted || visited === Visited.YES || modified === Modified.YES) ? validityToString(validity) : validityToString(Validity.VALID_FINALIZABLE)} 
          data-visited={visited !== Visited.NO ? true : null}
          data-modified={modified !== Modified.NO ? true : null}
        >
          {labelText}
        </label>
      </>
    )
  }
}