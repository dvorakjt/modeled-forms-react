import React, { PropsWithChildren } from 'react';
import { RootFormProvider, RootFormProviderProps } from "../context-providers/root-form-provider.component";
import { FormProps } from "./form-props.interface";

export type RootFormProps = FormProps & RootFormProviderProps;

export function RootForm({
  template,
  acceptCharset,
  autoCapitalize,
  autoComplete,
  name,
  id,
  className,
  style,
  children
} : PropsWithChildren<RootFormProps>) {
  return (
    <RootFormProvider template={template}>
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
    </RootFormProvider>
  )
}