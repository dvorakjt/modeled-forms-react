import { Message } from "../../model";
import { getMessageId } from "./get-message-id";

export function getAriaDescribedBy(fieldName : string, messages : Array<Message>) {
  const describedBy = [];

  for(let i = 0; i < messages.length; i++) {
    describedBy.push(getMessageId(fieldName, i));
  }

  return describedBy.join(' ');
}