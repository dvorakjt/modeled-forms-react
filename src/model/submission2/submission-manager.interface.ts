import { Subject } from "rxjs";
import { ResettableFormElement } from "../form-elements/resettable-form-element.interface";
import { Message } from "../state/messages/message.interface";
import { SubmitFn } from "./submit-fn.type";
import { State } from "../state/state.interface";

export interface TrySubmitArgsObject<T> {
  state : State<any>;
  onSuccess? : (res : T) => void;
  onError? : (e : any) => void;
  onFinally? : () => void;
}

export interface SubmissionManager<T> extends ResettableFormElement{
  submitFn : SubmitFn<T>
  message : Message | null;
  messageChanges : Subject<Message | null>;
  trySubmit(argsObject : TrySubmitArgsObject<T>) : void;
}