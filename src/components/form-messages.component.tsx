import React, { useContext} from 'react';
import { FormContext } from './form-context';
import { Messages } from './messages.component';
import { MessageComponent } from './message-component.type';

type FormMessagesProps = {
  messagesContainerClassName? : string; //defaults to .messages
  messageClassName? : string; //defaults to .message
  MessageComponent? : MessageComponent;
  idPrefix: string;
}

export function FormMessages({
  messagesContainerClassName,
  messageClassName,
  MessageComponent,
  idPrefix
} : FormMessagesProps) {
  const formCtx = useContext(FormContext);
  if(formCtx === null) throw new Error('FieldMessages cannot access useField property of null FormContext');
  else {
    const { messages } = formCtx.useFormState();
    return <Messages messages={messages} messagesContainerClassName={messagesContainerClassName} messageClassName={messageClassName} MessageComponent={MessageComponent} idPrefix={idPrefix} />
  }
}