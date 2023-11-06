import React, { useContext } from "react";
import { FormContext } from "../../components/context-providers/form-context";

export function FormValueDisplay() {
  const formCtx = useContext(FormContext);
  if(!formCtx) throw new Error('FormValueDisplay cannot access null or undefined FormContext');

  const { useFormState } = formCtx;

  const { value } = useFormState();

  return <pre>{JSON.stringify(value)}</pre>
}