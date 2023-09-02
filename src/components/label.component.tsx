import React, { useContext} from "react";
import { FormContext } from "./form-context";
import { validityToString } from "./util/validity-to-string";
import { RootFormContext } from "./root-form-provider.component";
import { Validity } from "../model";

export type LabelProps = {
  fieldName : string;
  labelText : string;
  labelClassName? : string;
}

export function Label({fieldName, labelText, labelClassName = 'label'} : LabelProps) {
  const rootFormCtx = useContext(RootFormContext);
  const formCtx = useContext(FormContext);
  if(!rootFormCtx) throw new Error('Input cannot access properties of null or undefined RootFormContext');
  if(formCtx === null) throw new Error('Input cannot access property useField of null FormContext');
  else {
    const { useField } = formCtx;
    const { validity, interactions } = useField(fieldName);
    const { useSubmissionAttempted } = rootFormCtx;
    const { submissionAttempted } = useSubmissionAttempted();

    return <label htmlFor={fieldName} className={labelClassName} data-validity={submissionAttempted || interactions.visited || interactions.modified ? validityToString(validity) : validityToString(Validity.VALID_FINALIZABLE)}>{labelText}</label>
  }
}