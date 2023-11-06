'use client';
import React, { CSSProperties, ChangeEventHandler, PropsWithChildren, useContext } from 'react';
import { FormContext } from '../context-providers/form-context';
import { validityToString } from '../util/validity-to-string';
import { Validity } from '../../model/state/validity.enum';
import { getAriaDescribedBy } from '../util/get-aria-described-by';
import { Visited } from '../../model/state/visited.enum';
import { Modified } from '../../model/state/modified-enum';

interface SelectOtherProps {
  fieldName : string;
  labelText? : string;
  selectProps? : {
    autoComplete? : string;
    autoFocus? : boolean;
    disabled? : boolean;
    labelClassName? : string;
    labelStyle? : CSSProperties;
    selectClassName? : string;
    selectStyle? : CSSProperties;
  },
  inputProps? : {
    type? : string;
    labelClassName? : string;
    labelStyle? : CSSProperties;
    inputClassName? : string;
    inputStyle? : CSSProperties;
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
}

export function SelectOther({ fieldName, labelText, selectProps = {}, inputProps = { type : 'text' }, children} : PropsWithChildren<SelectOtherProps>) {
  const formCtx = useContext(FormContext);
  if(!formCtx) throw new Error('Input cannot access properties of null or undefined FormContext');
  else {
    const { useDualField, useConfirmationAttempted } = formCtx;
    const { usePrimaryField, useSecondaryField, useSwitchToSecondaryField } = useDualField(fieldName);
    const { 
      value : primaryValue, 
      validity : primaryValidity, 
      messages : primaryMessages, 
      visited : primaryVisited, 
      modified : primaryModified, 
      updateValue : updatePrimaryValue, 
      visit : visitPrimary
    } = usePrimaryField();
    const { 
      value : secondaryValue, 
      validity : secondaryValidity, 
      messages : secondaryMessages, 
      visited : secondaryVisited, 
      modified : secondaryModified, 
      updateValue : updateSecondaryValue, 
      visit : visitSecondary
    } = useSecondaryField();

    const { useSecondaryField : isUsingSecondaryField, setUseSecondaryField } = useSwitchToSecondaryField();

    const confirmationAttempted = useConfirmationAttempted();

    const onChangeSelect : ChangeEventHandler<HTMLSelectElement> = (e) => {
      updatePrimaryValue(e.target.value);

      if(e.target.value === 'other') {
        setUseSecondaryField(true);
      } else {
        setUseSecondaryField(false);
      }
    }

    const onChangeInput : ChangeEventHandler<HTMLInputElement> = (e) => {
      updateSecondaryValue(e.target.value);
    }

    return (
      <>
        <label
          htmlFor={`${fieldName}-select`}
          data-validity={(confirmationAttempted || primaryVisited === Visited.YES || primaryModified === Modified.YES) ? validityToString(primaryValidity) : validityToString(Validity.VALID_FINALIZABLE)} 
          data-visited={primaryVisited !== Visited.NO ? true : null}
          data-modified={primaryModified !== Modified.NO ? true : null}
          className={selectProps.labelClassName}
          style={selectProps.labelStyle}
        >
          {labelText ? labelText : fieldName}
        </label>
        <select 
          {...selectProps}
          value={primaryValue}
          onChange={onChangeSelect}
          onBlur={visitPrimary}
          data-validity={(confirmationAttempted || primaryVisited === Visited.YES || primaryModified === Modified.YES) ? validityToString(primaryValidity) : validityToString(Validity.VALID_FINALIZABLE)} 
          data-visited={primaryVisited !== Visited.NO ? true : null}
          data-modified={primaryModified !== Modified.NO ? true : null}
          aria-invalid={!isUsingSecondaryField && (confirmationAttempted || primaryVisited === Visited.YES || primaryModified === Modified.YES) && primaryValidity <= Validity.INVALID}
          aria-describedby={!isUsingSecondaryField && (confirmationAttempted || primaryVisited === Visited.YES || primaryModified === Modified.YES) ? getAriaDescribedBy(fieldName, primaryMessages) : ""}
          id={`${fieldName}-select`}
          className={selectProps.selectClassName}
          style={selectProps.selectStyle}
        >
          {children}
          <option value='other'>Other</option>
        </select>
        {
          isUsingSecondaryField && (
            <>
              <label
                htmlFor={`${fieldName}-input`}
                data-validity={(confirmationAttempted || secondaryVisited === Visited.YES || secondaryModified === Modified.YES) ? validityToString(secondaryValidity) : validityToString(Validity.VALID_FINALIZABLE)} 
                data-visited={secondaryVisited !== Visited.NO ? true : null}
                data-modified={secondaryModified !== Modified.NO ? true : null}
                className={inputProps.labelClassName}
                style={inputProps.labelStyle}
              >
                Other
              </label>
              <input 
                {...inputProps}
                value={secondaryValue}
                onChange={onChangeInput}
                onBlur={visitSecondary}
                data-validity={(confirmationAttempted || secondaryVisited === Visited.YES || secondaryModified === Modified.YES) ? validityToString(secondaryValidity) : validityToString(Validity.VALID_FINALIZABLE)} 
                data-visited={secondaryVisited !== Visited.NO ? true : null}
                data-modified={secondaryModified !== Modified.NO ? true : null}
                aria-invalid={isUsingSecondaryField && (confirmationAttempted || secondaryVisited === Visited.YES || secondaryModified === Modified.YES) && secondaryValidity <= Validity.INVALID}
                aria-describedby={isUsingSecondaryField && (confirmationAttempted || secondaryVisited === Visited.YES || secondaryModified === Modified.YES) ? getAriaDescribedBy(fieldName, secondaryMessages) : ""}
                id={`${fieldName}-input`}
                className={inputProps.inputClassName}
                style={inputProps.inputStyle}
              />
            </>
          )
        }
      </>
    )
  }
}