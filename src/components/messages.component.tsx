import React, { useState, useEffect } from "react";
import { Message } from "../model/state/messages/message.interface";
import { MessageComponent } from "./message-component.type";
import { DefaultMessage } from "./default-message.component";

interface MessagesProps {
  messages : Array<Message>;
  MessageComponent? : MessageComponent;
  idPrefix: string;
}

export function Messages({
  messages,
  MessageComponent = DefaultMessage,
  idPrefix
} : MessagesProps) {
 
  const [statefulMessages, setStatefulMessages] = useState(messages);

  useEffect(() => {
    setStatefulMessages(messages);
  }, [messages])

  return (
    <div className="messages" aria-live='polite'>
      {statefulMessages.map((message, index) => {
        return (
          <MessageComponent validity={message.type} text={message.text} className="message" key={index.toString()} id={`${idPrefix}-${index.toString()}`}/>
        )
      })}
    </div>
  )
}