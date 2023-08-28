import React from "react";
import { MessageComponent, MessageComponentProps } from "./message-component.type";

export const DefaultMessage : MessageComponent = ({className, type, text} : MessageComponentProps) => {
  return <span className={className} data-type={type}>{text}</span>
}