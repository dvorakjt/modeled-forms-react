import React, { CSSProperties, useContext} from 'react';
import { FormContext } from '../context-providers/form-context';
import { Messages } from './messages.component';

export type FormMessagesProps = {
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
  if(!formCtx) throw new Error('FormMessages cannot access useFormState property of null or undefined FormContext');

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