'use client';
import React, { CSSProperties, MouseEventHandler, PropsWithChildren, useContext } from "react";
import { FormContext } from "../context-providers/form-context";
import { Validity } from "../../model";
import { container } from "../../model/container";

interface ConfirmButtonProps {
  className? : string;
  style? : CSSProperties;
  enableOnlyWhenValid? : boolean;
  errorMessage? : string;
  onSuccess? : () => void;
  onError? : () => void;
}

export function ConfirmButton({ className, style, enableOnlyWhenValid, onSuccess, onError, errorMessage, children } : PropsWithChildren<ConfirmButtonProps> ) {
  const formCtx = useContext(FormContext);
  if(formCtx === null) throw new Error('Reset button cannot read property reset of null FormContext');
  else {
    const { tryConfirm, useFormState } = formCtx;

    const { validity } = useFormState();

    const onClick : MouseEventHandler<HTMLButtonElement> = (e) => {
      e.preventDefault();
      
      tryConfirm({
        onSuccess,
        onError,
        errorMessage : errorMessage ?? container.services.ConfigLoader.config.globalMessages.confirmationFailed
      });
    }

    return <button onClick={onClick} className={className} style={style} disabled={enableOnlyWhenValid && validity < Validity.VALID_FINALIZABLE}>{children}</button>
  }
}