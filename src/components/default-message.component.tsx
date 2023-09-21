import React from "react";
import { MessageComponent, MessageComponentProps } from "./message-component.type";

export const DefaultMessage : MessageComponent = ({className, validity, text, id} : MessageComponentProps) => {
  return <span className={className} data-validity={validity} id={id}>{text}</span>
}