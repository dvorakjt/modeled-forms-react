import React, { useContext} from 'react';
import { FormContext } from './form-context';
import { Messages } from './messages.component';
import { MessageComponent } from './message-component.type';
import { getFieldMessageIdPrefix } from './util/get-field-message-id-prefix';
import { RootFormContext } from './root-form-provider.component';

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
  const rootFormCtx = useContext(RootFormContext);
  const formCtx = useContext(FormContext);
  if(!rootFormCtx) throw new Error('FieldMessages cannot access properties of null or undefined RootFormContext.');
  if(!formCtx) throw new Error('FieldMessages cannot access properties of null or undefined FormContext.');
  else {
    const { useField } = formCtx;
    const { messages, interactions } = useField(fieldName);
    const { useSubmissionAttempted } = rootFormCtx;
    const { submissionAttempted } = useSubmissionAttempted();
    return <Messages messages={submissionAttempted || interactions.visited || interactions.modified ? messages : []} messagesContainerClassName={messagesContainerClassName} messageClassName={messageClassName} MessageComponent={MessageComponent} idPrefix={getFieldMessageIdPrefix(fieldName)}/>
  }
}