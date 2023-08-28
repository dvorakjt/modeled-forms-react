import React from "react";

export type LabelProps = {
  labelText : string;
  labelClassName? : string;
}

export function Label({labelText, labelClassName = 'label'} : LabelProps) {
  return <label className={labelClassName}>{labelText}</label>
}