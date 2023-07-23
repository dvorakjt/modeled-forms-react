import { Message } from "./messages/message.interface";
import { Validity } from "./validity.enum";

export interface State {
  value : string;
  validity: Validity;
  messages: Array<Message>;
  exclude? : boolean;
}