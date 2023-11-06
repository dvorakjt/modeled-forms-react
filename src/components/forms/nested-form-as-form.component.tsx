import React, { PropsWithChildren } from 'react';
import { NestedFormProvider, NestedFormProviderProps } from '../context-providers/nested-form-provider.component';
import { FormProps } from './form-props.interface';

type NestedFormAsFormProps = NestedFormProviderProps & FormProps;

export function NestedFormAsForm({
  fieldName,
  acceptCharset,
  autoCapitalize,
  autoComplete,
  name,
  id,
  className,
  style,
  children
} : PropsWithChildren<NestedFormAsFormProps>) {
  return (
    <NestedFormProvider fieldName={fieldName}>
      <form
        acceptCharset={acceptCharset}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        name={name}
        id={id}
        className={className}
        style={style}
      >
        {children}
      </form>
    </NestedFormProvider>
  )
}