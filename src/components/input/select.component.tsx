'use client';
import React, { CSSProperties, PropsWithChildren, useContext } from 'react';
import { FormContext } from '../context-providers/form-context';
import { validityToString } from '../util/validity-to-string';
import { Validity } from '../../model/state/validity.enum';
import { getAriaDescribedBy } from '../util/get-aria-described-by';
import { RootFormContext } from '../context-providers/root-form-provider.component';
import { Visited } from '../../model/state/visited.enum';
import { Modified } from '../../model/state/modified-enum';

interface SelectProps {
  fieldName : string;
  className? : string;
  style? : CSSProperties;
  autoComplete? : string;
  autoFocus? : boolean;
  disabled? : boolean;
  multiple? : boolean;
  size? : number;
}

export function Select({
  children,
  fieldName,
  className,
  style,
  autoComplete,
  autoFocus,
  disabled,
  multiple,
  size
} : PropsWithChildren<SelectProps>) {
  const rootFormCtx = useContext(RootFormContext);
  const formCtx = useContext(FormContext);
  if(!rootFormCtx) throw new Error('Input cannot access properties of null or undefined RootFormContext');
  if(!formCtx) throw new Error('Input cannot access properties of null or undefined FormContext');
  else {
    const { useField } = formCtx;
    const { value, validity, messages, visited, modified, updateValue, visit} = useField(fieldName);
    const { useSubmissionAttempted } = rootFormCtx;
    const submissionAttempted = useSubmissionAttempted();

    return (
      <select
        value={value}
        onChange={(e) => updateValue(e.target.value)}
        onBlur={visit}
        data-validity={(submissionAttempted || visited === Visited.YES || modified === Modified.YES) ? validityToString(validity) : validityToString(Validity.VALID_FINALIZABLE)} 
        aria-invalid={(submissionAttempted || visited === Visited.YES || modified === Modified.YES) && validity <= Validity.INVALID}
        aria-describedby={(submissionAttempted || visited === Visited.YES || modified === Modified.YES) ? getAriaDescribedBy(fieldName, messages) : ""}
        data-visited={visited !== Visited.NO ? true : null}
        data-modified={modified !== Modified.NO ? true : null}
        className={className}
        style={style}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        disabled={disabled}
        multiple={multiple}
        size={size}
        id={fieldName}
        name={fieldName}
      >
        {children}
      </select>
    )
  }
}