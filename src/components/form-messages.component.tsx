import React, { useContext} from 'react';
import { FormContext } from './form-context';
import { Messages } from './messages.component';
import { MessageComponent } from './message-component.type';

type FormMessagesProps = {
  MessageComponent? : MessageComponent;
  idPrefix: string;
}

export function FormMessages({
  MessageComponent,
  idPrefix
} : FormMessagesProps) {
  const formCtx = useContext(FormContext);
  if(formCtx === null) throw new Error('FieldMessages cannot access useField property of null FormContext');
  else {
    const { messages } = formCtx.useFormState();
    return <Messages messages={messages} MessageComponent={MessageComponent} idPrefix={idPrefix} />
  }
}