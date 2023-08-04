import { BehaviorSubject, type Subject } from "rxjs";
import { State } from "../types/state/state.interface";
import { SubmissionManager } from "../types/submission/submission-manager.interface";
import { SubmissionState } from "../types/submission/submission-state.interface";
import { SubmitFn } from "../types/submission/submit-fn.type";
import { copyObject } from "../util/copy-object";
import { Validity } from "../types/state/validity.enum";
import { MessageType } from "../types/state/messages/message-type.enum";
import { GlobalMessages } from "../constants/global-messages.enum";

export class SubmissionManagerImpl implements SubmissionManager {
  submissionStateChanges: Subject<SubmissionState>;
  #submitFn : SubmitFn;

  #submissionState: SubmissionState = {
    submissionAttempted : false
  }

  set submissionState(submissionState : SubmissionState) {
    this.#submissionState = submissionState;
    this.submissionStateChanges.next(this.submissionState);
  } 

  get submissionState() {
    return copyObject(this.#submissionState);
  }
  

  constructor(submitFn : SubmitFn) {
    this.submissionStateChanges = new BehaviorSubject(this.submissionState);
    this.#submitFn = submitFn;
  }

  submit(state: State<any>) {
    this.submissionState = {
      submissionAttempted : true
    }
    return new Promise<any>((resolve, reject) => {
      if(state.validity < Validity.VALID_FINALIZABLE) {
        this.submissionState = {
          ...this.#submissionState,
          message : {
            type: MessageType.INVALID,
            text: GlobalMessages.SUBMISSION_FAILED
          }
        }
        reject(new Error(GlobalMessages.SUBMISSION_FAILED))
      } else {
        this.#submitFn(state).then((res) => {
          resolve(res);
        }).catch(e => {
          if(e.message) this.submissionState = {
            ...this.#submissionState,
            message : {
              type: MessageType.ERROR,
              text : e.message
            }
          }
          reject(e);
        });
      }
    });
  }

  clearMessage() {
    this.submissionState = {
      submissionAttempted : this.submissionState.submissionAttempted
    }
  }

  reset() {
    this.submissionState = {
      submissionAttempted : false
    }
  }
}