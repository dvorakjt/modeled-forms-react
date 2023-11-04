'use client';
import React, { CSSProperties, useContext } from 'react';
import { FormContext } from '../context-providers/form-context';
import { RootFormContext } from '../context-providers/root-form-provider.component';
import { Messages } from './messages.component';
import { Visited } from '../../model/state/visited.enum';
import { Modified } from '../../model/state/modified-enum';
import { getFieldMessageIdPrefix } from '../util/get-field-message-id-prefix';

export type FieldMessagesProps = {
  fieldName : string;
  containerClassName? : string;
  containerStyle? : CSSProperties;
  messageClassName? : string;
  messageStyle? : CSSProperties;
}

export function FieldMessages({
  fieldName,
  containerClassName,
  containerStyle,
  messageClassName,
  messageStyle
} : FieldMessagesProps) {
  const rootFormCtx = useContext(RootFormContext);
  const formCtx = useContext(FormContext);
  if(!rootFormCtx) throw new Error('FieldMessages cannot access properties of null or undefined RootFormContext.');
  if(!formCtx) throw new Error('FieldMessages cannot access properties of null or undefined FormContext.');
  else {
    const { useField } = formCtx;
    const { messages, visited, modified } = useField(fieldName);
    const { useSubmissionAttempted } = rootFormCtx;
    const submissionAttempted = useSubmissionAttempted();
    return (
      <Messages 
        messages={(submissionAttempted || visited === Visited.YES || modified === Modified.YES) ? messages : []} 
        containerClassName={containerClassName}
        containerStyle={containerStyle}
        messageClassName={messageClassName}
        messageStyle={messageStyle}
        idPrefix={getFieldMessageIdPrefix(fieldName)}
      />
    );
  }
}