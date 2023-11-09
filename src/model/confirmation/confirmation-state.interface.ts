import { Message } from '../state/messages/message.interface';

export interface ConfirmationState {
  confirmationAttempted: boolean;
  message?: Message;
}
