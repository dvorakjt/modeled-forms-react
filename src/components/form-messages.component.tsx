import React, { useContext} from 'react';
import { FormContext } from './form-context';
import { RootFormContext } from './root-form-provider.component';
import { Messages } from './messages.component';
import { MessageComponent } from './message-component.type';
import { MultiInputValidatorMessage } from '../model/state/messages/multi-input-validator-message.interface';

type FormMessagesProps = {
  MessageComponent? : MessageComponent;
  idPrefix: string;
}

export function FormMessages({
  MessageComponent,
  idPrefix
} : FormMessagesProps) {
  const formCtx = useContext(FormContext);
  const rootFormCtx = useContext(RootFormContext);
  if(!formCtx) throw new Error('FormMessages cannot access useFormState property of null or undefined FormContext');
  if(!rootFormCtx) throw new Error('FormMessages cannot access useSubmissionAttempted property of null or undefined RootFormContext');

  const submissionAttempted = rootFormCtx.useSubmissionAttempted();
  const { messages : rawMessages } = formCtx.useFormState();

  const messages = submissionAttempted ? rawMessages : rawMessages.filter((message) => {
    return !((message as MultiInputValidatorMessage).hasUnvisitedOrUnmodifiedFields); //filter out multi-input validator messages from unvisited/unmodified fields
  })
  return <Messages messages={messages} MessageComponent={MessageComponent} idPrefix={idPrefix} />
}