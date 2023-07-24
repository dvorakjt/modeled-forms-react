import type { Message } from "./messages/message.interface";
import type { Validity } from "./validity.enum";

export interface ValidatorSuiteResult<T> {
  value : T;
  validity: Validity;
  messages: Array<Message>;
}