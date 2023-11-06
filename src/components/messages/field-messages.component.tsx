'use client';
import React, { CSSProperties, useContext } from 'react';
import { FormContext } from '../context-providers/form-context';
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
  const formCtx = useContext(FormContext);
  if(!formCtx) throw new Error('FieldMessages cannot access properties of null or undefined FormContext.');
  else {
    const { useField, useConfirmationAttempted } = formCtx;
    const { messages, visited, modified } = useField(fieldName);

    const confirmationAttempted = useConfirmationAttempted();

    return (
      <Messages 
        messages={(confirmationAttempted || visited === Visited.YES || modified === Modified.YES) ? messages : []} 
        containerClassName={containerClassName}
        containerStyle={containerStyle}
        messageClassName={messageClassName}
        messageStyle={messageStyle}
        idPrefix={getFieldMessageIdPrefix(fieldName)}
      />
    );
  }
}