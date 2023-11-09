'use client';
import React, { CSSProperties, useContext } from 'react';
import { FormContext } from '../context-providers/form-context';
import { validityToString } from '../util/validity-to-string';
import { Validity } from '../../model/state/validity.enum';
import { getAriaDescribedBy } from '../util/get-aria-described-by';
import { Visited } from '../../model/state/visited.enum';
import { Modified } from '../../model/state/modified.enum';
import { getRadioInputId } from '../util/get-radio-input-id';

export interface RadioInputProps {
  fieldName : string;
  value : string;
  labelText : string;
  labelClassName? : string;
  radioClassName? : string;
  labelStyle? : CSSProperties;
  radioStyle? : CSSProperties;
}

export function RadioInput({ fieldName, value, labelText, labelClassName, labelStyle, radioClassName, radioStyle} : RadioInputProps) {
  const formCtx = useContext(FormContext);
  if(!formCtx) throw new Error('Input cannot access properties of null or undefined FormContext');
  else {
    const { useField, useConfirmationAttempted } = formCtx;
    const { value : fieldValue, validity, messages, visited, modified, updateValue, visit} = useField(fieldName);

    const confirmationAttempted = useConfirmationAttempted();

    return (
      <>
        <input 
          type='radio' 
          name={fieldName} 
          id={getRadioInputId(fieldName, value)} 
          value={value} 
          checked={fieldValue === value}
          className={radioClassName}
          style={radioStyle}
          onClick={visit}
          onChange={(e) => updateValue(e.target.value)}
          aria-describedby={(confirmationAttempted || visited === Visited.YES || modified === Modified.YES) ? getAriaDescribedBy(fieldName, messages) : ""}
          data-validity={(confirmationAttempted || visited === Visited.YES || modified === Modified.YES) ? validityToString(validity) : validityToString(Validity.VALID_FINALIZABLE)} 
          data-visited={visited !== Visited.NO ? true : null}
          data-modified={modified !== Modified.NO ? true : null}
        />
        <label 
          htmlFor={getRadioInputId(fieldName, value)} 
          className={labelClassName} 
          style={labelStyle}
          data-validity={(confirmationAttempted || visited === Visited.YES || modified === Modified.YES) ? validityToString(validity) : validityToString(Validity.VALID_FINALIZABLE)} 
          aria-invalid={(confirmationAttempted || visited === Visited.YES || modified === Modified.YES) && validity <= Validity.INVALID}
          data-visited={visited !== Visited.NO ? true : null}
          data-modified={modified !== Modified.NO ? true : null}
        >
          {labelText}
        </label>
      </>
    )
  }
}