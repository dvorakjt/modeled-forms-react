import { BehaviorSubject } from "rxjs";
import { MultiFieldValidatorMessagesAggregator } from "../types/aggregators/multi-field-validator-messages-aggregator";
import { Message } from "../types/state/messages/message.interface";
import { ManagedObservableFactory } from "../types/subscriptions/managed-observable-factory.interface";
import { ManagedSubject } from "../types/subscriptions/managed-subject.interface";
import { MultiInputValidator } from "../types/validators/multi-input/multi-input-validator.interface";
import { copyObject } from "../util/copy-object";

type MessagesByValidatorId = {
  [id : number] : Message
}

export class MultiInputValidatorMessagesAggregatorImpl implements MultiFieldValidatorMessagesAggregator {
  messagesChanges: ManagedSubject<Message[]>;
  #messages : MessagesByValidatorId = {}

  get messages() {
    return [...this.generateMessages()];
  }

  constructor(validators : Array<MultiInputValidator>, managedObservableFactory : ManagedObservableFactory) {
    for(let i = 0; i < validators.length; i++) {
      const validator = validators[i];
      validator.messageChanges.subscribe(next => {
        if(next) this.#messages[i] = next;
        else delete this.#messages[i];
        if(this.messagesChanges) this.messagesChanges.next(this.messages);
      });
    }
    this.messagesChanges = managedObservableFactory.createManagedSubject(new BehaviorSubject(this.messages));
  }

  private * generateMessages() {
    for(const key in this.#messages) yield copyObject(this.#messages[key]);
  }
}