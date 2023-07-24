import { Subject } from "rxjs";
import { ManagedSubject } from "../../../model/subscriptions/managed-subject";
import { SubmissionManager } from "../../../model/types/forms/submission-manager.interface";
import { Message } from "../../../model/types/state/messages/message.interface";
import { SubscriptionManager } from "../../../model/types/subscriptions/subscription-manager.interface";

export class SubmissionManagerStub implements SubmissionManager {
  submissionChanges: ManagedSubject<void>;
  #message : Message | null = null;

  set message(message : Message | null) {
    this.#message = message;
  }

  get message() {
    return this.#message;
  }

  constructor(subscriptionManager : SubscriptionManager) {
    this.submissionChanges = subscriptionManager.registerSubject(new Subject());
  }

  async submit() {
    return;
  }

  clearMessage() {
    this.#message = null;
  }
}