import { MessageType } from "../model/state/messages/message-type.enum"

export type MessageComponentProps = {
  className? : string,
  type : MessageType,
  text : string
}

export type MessageComponent = (props : MessageComponentProps) => JSX.Element;