import React, { useContext} from "react";
import { FormContext } from "./form-context";
import { validityToString } from "./util/validity-to-string";

export type LabelProps = {
  fieldName : string;
  labelText : string;
  labelClassName? : string;
}

export function Label({fieldName, labelText, labelClassName = 'label'} : LabelProps) {
  const formCtx = useContext(FormContext);
  if(formCtx === null) throw new Error('Input cannot access property useField of null FormContext');
  else {
    const { useField } = formCtx;
    const { validity } = useField(fieldName);

    return <label htmlFor={fieldName} className={labelClassName} data-validity={validityToString(validity)}>{labelText}</label>
  }
}