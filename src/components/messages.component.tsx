import React, { useState, useEffect } from "react";
import { Message } from "../model/state/messages/message.interface";
import { MessageComponent } from "./message-component.type";
import { DefaultMessage } from "./default-message.component";

interface MessagesProps {
  messages : Array<Message>;
  messagesContainerClassName? : string; //defaults to .messages
  messageClassName? : string; //defaults to .message
  MessageComponent? : MessageComponent;
}

export function Messages({
  messages,
  messagesContainerClassName = 'messages',
  messageClassName = 'message',
  MessageComponent = DefaultMessage,
} : MessagesProps) {
 
  const [statefulMessages, setStatefulMessages] = useState(messages);

  useEffect(() => {
    setStatefulMessages(messages);
  }, [messages])

  return (
    <div className={messagesContainerClassName}>
      {statefulMessages.map((message, index) => {
        return (
          <MessageComponent validity={message.type} text={message.text} className={messageClassName} key={index.toString()} />
        )
      })}
    </div>
  )
}