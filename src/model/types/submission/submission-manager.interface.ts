import type { ManagedSubject } from '../subscriptions/managed-subject.interface';
import type { Message } from '../state/messages/message.interface';
import type { State } from '../state/state.interface';

export interface SubmissionManager {
  get message(): Message | null;
  clearMessage: () => void;
  submissionChanges: ManagedSubject<void>;
  submit: (state: State<any>) => Promise<any>;
}
