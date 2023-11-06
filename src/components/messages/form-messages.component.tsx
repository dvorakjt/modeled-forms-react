'use client';
import React, { CSSProperties, useContext} from 'react';
import { FormContext } from '../context-providers/form-context';
import { RootFormContext } from '../context-providers/root-form-provider.component';
import { Messages } from './messages.component';

type FormMessagesProps = {
  idPrefix: string;
  containerClassName? : string;
  containerStyle? : CSSProperties;
  messageClassName? : string;
  messageStyle? : CSSProperties;
}

export function FormMessages({
  idPrefix,
  containerClassName,
  containerStyle,
  messageClassName,
  messageStyle
} : FormMessagesProps) {
  const formCtx = useContext(FormContext);
  const rootFormCtx = useContext(RootFormContext);
  if(!formCtx) throw new Error('FormMessages cannot access useFormState property of null or undefined FormContext');
  if(!rootFormCtx) throw new Error('FormMessages cannot access useSubmissionAttempted property of null or undefined RootFormContext');

  const { messages } = formCtx.useFormState();

  return (
    <Messages 
      messages={messages} 
      idPrefix={idPrefix} 
      containerClassName={containerClassName} 
      containerStyle={containerStyle} 
      messageClassName={messageClassName}
      messageStyle={messageStyle}
    />
  );
}