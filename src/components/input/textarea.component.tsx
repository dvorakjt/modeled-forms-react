import React, { CSSProperties, useContext } from 'react';
import { FormContext } from '../context-providers/form-context';
import { validityToString } from '../util/validity-to-string';
import { Validity } from '../../model/state/validity.enum';
import { getAriaDescribedBy } from '../util/get-aria-described-by';
import { Visited } from '../../model/state/visited.enum';
import { Modified } from '../../model/state/modified.enum';

export interface TextareaProps {
  fieldName : string;
  className? : string;
  style? : CSSProperties;
  autoComplete? : 'on' | 'off';
  autoCorrect? : 'on' | 'off';
  autoFocus? : boolean;
  cols? : number;
  rows? : number;
  maxLength? : number;
  placeholder? : string;
  readOnly? : boolean;
  spellCheck? : boolean | 'true' | 'false'
  wrap? : 'hard' | 'soft' | 'off'
}

export function Textarea({
  fieldName,
  className,
  style,
  autoComplete,
  autoCorrect,
  autoFocus,
  cols,
  rows,
  maxLength,
  placeholder,
  readOnly,
  spellCheck,
  wrap
} : TextareaProps) {
  const formCtx = useContext(FormContext);
  if(!formCtx) throw new Error('Input cannot access properties of null or undefined FormContext');
  else {
    const { useField, useConfirmationAttempted } = formCtx;
    const { value, validity, messages, visited, modified, updateValue, visit} = useField(fieldName);

    const confirmationAttempted = useConfirmationAttempted();
    
    return (
    <textarea 
      id={fieldName}
      name={fieldName}
      className={className}
      style={style}
      cols={cols}
      rows={rows}
      wrap={wrap}
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
      autoCorrect={autoCorrect}
      spellCheck={spellCheck}
      placeholder={placeholder}
      autoFocus={autoFocus}
      maxLength={maxLength}
      onBlur={visit}
    />);
  }
}