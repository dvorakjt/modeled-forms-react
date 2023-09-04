import React, { useContext } from 'react';
import { FormContext } from './form-context';
import { Messages } from './messages.component';
import { MessageComponent } from './message-component.type';
import { getFieldMessageIdPrefix } from './util/get-field-message-id-prefix';
import { RootFormContext } from './root-form-provider.component';

export type FieldMessagesProps = {
  fieldName : string;
  MessageComponent? : MessageComponent;
}

export function FieldMessages({
  fieldName,
  MessageComponent
} : FieldMessagesProps) {
  const rootFormCtx = useContext(RootFormContext);
  const formCtx = useContext(FormContext);
  if(!rootFormCtx) throw new Error('FieldMessages cannot access properties of null or undefined RootFormContext.');
  if(!formCtx) throw new Error('FieldMessages cannot access properties of null or undefined FormContext.');
  else {
    const { useField } = formCtx;
    const { messages } = useField(fieldName);
    // const { useSubmissionAttempted } = rootFormCtx;
    // const { submissionAttempted } = useSubmissionAttempted(); 
    //if submitted, modified, or visited, show messages, otherwise show an empty array?
    //alternatively, always return the messages, but style them using data-visited, data-modified, data-submitted attributes
    return <Messages messages={messages} MessageComponent={MessageComponent} idPrefix={getFieldMessageIdPrefix(fieldName)}/>
  }
}