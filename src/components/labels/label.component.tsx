'use client';
import React, { CSSProperties, PropsWithChildren, useContext } from 'react';
import { FormContext } from '../context-providers/form-context';
import { validityToString } from '../util/validity-to-string';
import { Validity } from '../../model/state/validity.enum';
import { Visited } from '../../model/state/visited.enum';
import { Modified } from '../../model/state/modified-enum';

interface LabelComponentProps {
  fieldName : string;
  className? : string;
  style? : CSSProperties
}

export function Label({ fieldName, className, style, children } : PropsWithChildren<LabelComponentProps>) {
  const formCtx = useContext(FormContext);
  if(!formCtx) throw new Error('Input cannot access properties of null or undefined FormContext');
  else {
    const { useField, useConfirmationAttempted } = formCtx;
    const { validity, visited, modified } = useField(fieldName);

    const confirmationAttempted = useConfirmationAttempted();
  
    return (
      <label 
        htmlFor={fieldName} 
        className={className} 
        style={style}
        data-validity={(confirmationAttempted || visited === Visited.YES || modified === Modified.YES) ? validityToString(validity) : validityToString(Validity.VALID_FINALIZABLE)} 
        data-visited={visited !== Visited.NO ? true : null}
        data-modified={modified !== Modified.NO ? true : null}
      >
        {children}
      </label>
    );
  }
}

