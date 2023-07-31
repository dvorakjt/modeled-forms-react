import type { Message } from '../../state/messages/message.interface';
import type { Validity } from '../../state/validity.enum';

export interface ValidatorSuiteResult<T> {
  value: T;
  validity: Validity;
  messages: Array<Message>;
}
