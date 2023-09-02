import React from 'react';
import { LabelProps, Label } from "./label.component";
import { InputProps, Input } from "./input.component";
import { FieldMessagesProps, FieldMessages } from "./field-messages.component";

export type InputGroupProps = {
  inputGroupClassName? : string;
} & LabelProps & InputProps & FieldMessagesProps;

export function InputGroup({
  fieldName, 
  inputGroupClassName, 
  inputClassName, 
  inputType, 
  readOnly, 
  autoComplete,
  placeholder,
  list,
  autoFocus,
  step,
  max,
  min,
  maxLength,
  size,
  labelText, 
  labelClassName, 
  messageClassName, 
  messagesContainerClassName, 
  MessageComponent
} : InputGroupProps) {
  return (
    <div className={inputGroupClassName}>
      <Label fieldName={fieldName} labelText={labelText} labelClassName={labelClassName} />
      <Input 
        fieldName={fieldName} 
        inputClassName={inputClassName} 
        inputType={inputType} 
        readOnly={readOnly} 
        autoComplete={autoComplete} 
        placeholder={placeholder} 
        list={list} 
        autoFocus={autoFocus}
        step={step}
        max={max}
        min={min}
        maxLength={maxLength}
        size={size}
      />
      <FieldMessages fieldName={fieldName} messagesContainerClassName={messagesContainerClassName} messageClassName={messageClassName} MessageComponent={MessageComponent} />
    </div>
  )
}