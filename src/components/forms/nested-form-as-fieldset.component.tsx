import React, { CSSProperties, PropsWithChildren } from 'react';
import { NestedFormProvider, NestedFormProviderProps } from '../context-providers/nested-form-provider.component';

type NestedFormAsFieldsetProps = NestedFormProviderProps & {
  disabled? : boolean;
  className? : string;
  style? : CSSProperties
}

export function NestedFormAsFieldset({
  fieldName,
  className,
  style,
  children
} : PropsWithChildren<NestedFormAsFieldsetProps>) {
  return (
    <NestedFormProvider fieldName={fieldName}>
      <fieldset
        name={fieldName}
        id={fieldName}
        className={className}
        style={style}
      >
        {children}
      </fieldset>
    </NestedFormProvider>
  )
}