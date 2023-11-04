'use client';
import React, { CSSProperties, PropsWithChildren, useContext } from 'react';
import { FormContext } from '../context-providers/form-context';
import { validityToString } from '../util/validity-to-string';
import { Validity } from '../../model/state/validity.enum';
import { RootFormContext } from '../context-providers/root-form-provider.component';
import { Visited } from '../../model/state/visited.enum';
import { Modified } from '../../model/state/modified-enum';

interface LabelComponentProps {
  fieldName : string;
  className? : string;
  style? : CSSProperties
}

export function Label({ fieldName, className, style, children } : PropsWithChildren<LabelComponentProps>) {
  const rootFormCtx = useContext(RootFormContext);
  const formCtx = useContext(FormContext);
  if(!rootFormCtx) throw new Error('Input cannot access properties of null or undefined RootFormContext');
  if(!formCtx) throw new Error('Input cannot access properties of null or undefined FormContext');
  else {
    const { useField } = formCtx;
    const { validity, visited, modified } = useField(fieldName);
    const { useSubmissionAttempted } = rootFormCtx;
    const submissionAttempted = useSubmissionAttempted();
  
    return (
      <label 
        htmlFor={fieldName} 
        className={className} 
        style={style}
        data-validity={(submissionAttempted || visited === Visited.YES || modified === Modified.YES) ? validityToString(validity) : validityToString(Validity.VALID_FINALIZABLE)} 
      >
        {children}
      </label>
    );
  }
}

