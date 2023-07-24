import { ManagedSubject } from "../../subscriptions/managed-subject";
import { Message } from "../state/messages/message.interface";
import { State } from "../state/state.interface";

export interface SubmissionManager {
  get message() : Message | null;
  clearMessage : () => void;
  submissionChanges : ManagedSubject<void>;
  submit : (state : State<any>) => Promise<any>;
}