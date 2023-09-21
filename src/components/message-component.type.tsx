import { MessageType } from "../model/state/messages/message-type.enum"

export type MessageComponentProps = {
  className? : string,
  validity : MessageType,
  text : string,
  id : string;
}

export type MessageComponent = (props : MessageComponentProps) => JSX.Element;