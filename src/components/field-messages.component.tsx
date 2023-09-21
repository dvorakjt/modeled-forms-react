import React, { useContext } from 'react';
import { FormContext } from './form-context';
import { Messages } from './messages.component';
import { MessageComponent } from './message-component.type';
import { getFieldMessageIdPrefix } from './util/get-field-message-id-prefix';
import { RootFormContext } from './root-form-provider.component';
import { Visited } from '../model/state/visited.enum';
import { Modified } from '../model/state/modified-enum';

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
    const { messages, visited, modified } = useField(fieldName);
    const { useSubmissionAttempted } = rootFormCtx;
    const { submissionAttempted } = useSubmissionAttempted();
    return <Messages messages={(submissionAttempted || visited === Visited.YES || modified === Modified.YES) ? messages : []} MessageComponent={MessageComponent} idPrefix={getFieldMessageIdPrefix(fieldName)}/>
  }
}