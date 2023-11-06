import { Config } from "../config-loader/config.interface";
import { MessageType } from "../state/messages/message-type.enum";
import { Message } from "../state/messages/message.interface";
import { SubmissionManager, TrySubmitArgsObject } from "./submission-manager.interface";
import { SubmitFn } from "./submit-fn.type";
import { BehaviorSubject, Subject } from "rxjs";

//submission happens in sequence after confirmation
//confirmation calls tryConfirm on all nested forms
export class SubmissionManagerImpl<T> implements SubmissionManager<T> {
  submitFn: SubmitFn<T>;
  _config : Config;
  _message : Message | null = null;

  get message() : Message | null {
    return this._message;
  }

  set message(val : Message | null) {
    this._message = val;
    this.messageChanges.next(this.message);
  }

  messageChanges: Subject<Message | null> = new BehaviorSubject<Message | null>(this.message);

  constructor(submitFn : SubmitFn<T>, config : Config) {
    this.submitFn = submitFn;
    this._config = config;
  }

  trySubmit({ state, onSuccess, onError, onFinally }: TrySubmitArgsObject<T>): void {
    //clear any existing messages
    this.reset();

    //now try submitting
    this.submitFn(state)
      .then((res) => {
        if(onSuccess) onSuccess(res);
      })
      .catch((e) => {
        if(e.message) {
          this.message = {
            text : e.message,
            type : MessageType.ERROR
          }
        } else {
          this.message = {
            text : this._config.globalMessages.submissionError,
            type : MessageType.ERROR
          }
        }
        //call on error
        if(onError) onError(e);
      })
      .finally(() => {
        if(onFinally) onFinally();
      });
  }
  reset(): void {
    this.message = null;
  }
}