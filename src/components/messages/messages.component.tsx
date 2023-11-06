'use client';
import React, { useState, useEffect, CSSProperties } from "react";
import { Message } from "../../model/state/messages/message.interface";
import { Message as MessageComponent } from "./message.component";

interface MessagesProps {
  messages : Array<Message>;
  idPrefix: string;
  containerClassName? : string;
  containerStyle? : CSSProperties;
  messageClassName? : string;
  messageStyle? : CSSProperties;
}

export function Messages({
  messages,
  idPrefix,
  containerClassName,
  containerStyle,
  messageClassName,
  messageStyle
} : MessagesProps) {
 
  const [statefulMessages, setStatefulMessages] = useState(messages);

  useEffect(() => {
    setStatefulMessages(messages);
  }, [messages])

  return (
    <div className={containerClassName} style={containerStyle} aria-live='polite'>
      {statefulMessages.map((message, index) => {
        return (
          <MessageComponent 
            validity={message.type} 
            text={message.text} 
            key={index.toString()} 
            id={`${idPrefix}-${index.toString()}`}
            className={messageClassName}
            style={messageStyle}
          />
        )
      })}
    </div>
  )
}