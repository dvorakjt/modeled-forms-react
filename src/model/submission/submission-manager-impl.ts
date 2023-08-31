import { BehaviorSubject, type Subject } from 'rxjs';
import { State } from '../state/state.interface';
import { SubmissionManager } from './submission-manager.interface';
import { SubmissionState } from './submission-state.interface';
import { SubmitFn } from './submit-fn.type';
import { copyObject } from '../util/copy-object';
import { Validity } from '../state/validity.enum';
import { MessageType } from '../state/messages/message-type.enum';
import { config } from '../../config';

export class SubmissionManagerImpl implements SubmissionManager {
  submissionStateChanges: Subject<SubmissionState>;
  _submitFn: SubmitFn;

  _submissionState: SubmissionState = {
    submissionAttempted: false,
  };

  set submissionState(submissionState: SubmissionState) {
    this._submissionState = submissionState;
    this.submissionStateChanges.next(this.submissionState);
  }

  get submissionState() {
    return copyObject(this._submissionState);
  }

  constructor(submitFn: SubmitFn) {
    this.submissionStateChanges = new BehaviorSubject(this.submissionState);
    this._submitFn = submitFn;
  }

  submit(state: State<any>) {
    this.submissionState = {
      submissionAttempted: true,
    };
    return new Promise<any>((resolve, reject) => {
      if (state.validity < Validity.VALID_FINALIZABLE) {
        this.submissionState = {
          ...this._submissionState,
          message: {
            type: MessageType.INVALID,
            text: config.globalMessages.submissionFailed,
          },
        };
        reject(new Error(config.globalMessages.submissionFailed));
      } else {
        this._submitFn(state)
          .then(res => {
            resolve(res);
          })
          .catch(e => {
            if (e.message)
              this.submissionState = {
                ...this._submissionState,
                message: {
                  type: MessageType.ERROR,
                  text: e.message,
                },
              };
            reject(e);
          });
      }
    });
  }

  clearMessage() {
    this.submissionState = {
      submissionAttempted: this.submissionState.submissionAttempted,
    };
  }

  reset() {
    this.submissionState = {
      submissionAttempted: false,
    };
  }
}
