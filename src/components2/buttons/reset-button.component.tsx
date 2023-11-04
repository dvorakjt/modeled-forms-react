'use client';
import React, { CSSProperties, MouseEventHandler, useContext, useEffect, useState } from "react";
import { FormContext } from "../context-providers/form-context";

interface ResetButtonProps {
  disabled? : boolean;
  className? : string;
  style? : CSSProperties;
}

export function ResetButton(props : ResetButtonProps) {
  const [disabled, setDisabled] = useState(props.disabled);
  const formCtx = useContext(FormContext);

  useEffect(() => {
    setDisabled(props.disabled);
  }, [props.disabled])

  if(formCtx === null) throw new Error('Reset button cannot read property reset of null FormContext');
  else {
    const { reset } = formCtx;

    const onClick : MouseEventHandler<HTMLButtonElement> = (e) => {
      e.preventDefault();
      reset();
    }

    return <button onClick={onClick} className={props.className} style={props.style} disabled={disabled}>Reset</button>
  }
}