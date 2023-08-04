import { BehaviorSubject, Subject } from "rxjs";
import { copyObject } from "../util/copy-object";
import type { MultiFieldValidatorMessagesAggregator } from "../types/aggregators/multi-field-validator-messages-aggregator.interface";
import { Message } from "../types/state/messages/message.interface";
import { MultiInputValidator } from "../types/validators/multi-input/multi-input-validator.interface";

type MessagesByValidatorId = {
  [id : number] : Message
}

export class MultiInputValidatorMessagesAggregatorImpl implements MultiFieldValidatorMessagesAggregator {
  messagesChanges: Subject<Message[]>;
  #messages : MessagesByValidatorId = {}

  get messages() {
    return [...this.generateMessages()];
  }

  constructor(validators : Array<MultiInputValidator>) {
    for(let i = 0; i < validators.length; i++) {
      const validator = validators[i];
      validator.messageChanges.subscribe(next => {
        if(next) this.#messages[i] = next;
        else delete this.#messages[i];
        if(this.messagesChanges) this.messagesChanges.next(this.messages);
      });
    }
    this.messagesChanges = new BehaviorSubject(this.messages);
  }

  private * generateMessages() {
    for(const key in this.#messages) yield copyObject(this.#messages[key]);
  }
}