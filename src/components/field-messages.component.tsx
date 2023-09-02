import React, { useContext} from 'react';
import { FormContext } from './form-context';
import { Messages } from './messages.component';
import { MessageComponent } from './message-component.type';
import { getFieldMessageIdPrefix } from './util/get-field-message-id-prefix';

export type FieldMessagesProps = {
  fieldName : string;
  messagesContainerClassName? : string; //defaults to .messages
  messageClassName? : string; //defaults to .message
  MessageComponent? : MessageComponent;
}

export function FieldMessages({
  fieldName,
  messagesContainerClassName,
  messageClassName,
  MessageComponent
} : FieldMessagesProps) {
  const formCtx = useContext(FormContext);
  if(formCtx === null) throw new Error('FieldMessages cannot access useField property of null FormContext');
  else {
    const { useField } = formCtx;
    const { messages } = useField(fieldName);
    return <Messages messages={messages} messagesContainerClassName={messagesContainerClassName} messageClassName={messageClassName} MessageComponent={MessageComponent} idPrefix={getFieldMessageIdPrefix(fieldName)}/>
  }
}