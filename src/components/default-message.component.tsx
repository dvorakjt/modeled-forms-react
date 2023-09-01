import React from "react";
import { MessageComponent, MessageComponentProps } from "./message-component.type";

export const DefaultMessage : MessageComponent = ({className, validity, text} : MessageComponentProps) => {
  return <span className={className} data-validity={validity}>{text}</span>
}