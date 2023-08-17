import { Message } from '../state/messages/message.interface';

export interface SubmissionState {
  message?: Message;
  submissionAttempted: boolean;
}
