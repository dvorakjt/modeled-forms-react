import { Subject } from "rxjs";
import { ResettableFormElement } from "../form-elements/resettable-form-element.interface";
import { Message } from "../state/messages/message.interface";
import { SubmitFn } from "./submit-fn.type";
import { State } from "../state/state.interface";

export interface TrySubmitArgsObject {
  onSuccess? : (res : any) => void;
  onError? : (e : any) => void;
  onFinally? : () => void;
}

export type TrySubmitArgsObjectWithState = {
  state : State<any>;
} & TrySubmitArgsObject;

export interface SubmissionManager extends ResettableFormElement{
  submitFn : SubmitFn
  message : Message | null;
  messageChanges : Subject<Message | null>;
  trySubmit(argsObject : TrySubmitArgsObjectWithState) : void;
}