import { ConfirmationManager, TryConfirmArgsObjectWithValidity } from "./confirmation-manager.interface";
import { BehaviorSubject, Subject } from "rxjs";
import { ConfirmationState } from "./confirmation-state.interface";
import { Validity } from "../state/validity.enum";
import { MessageType } from "../state/messages/message-type.enum";

export class ConfirmationManagerImpl implements ConfirmationManager {
  _confirmationState : ConfirmationState = {
    confirmationAttempted : false
  }

  get confirmationState() : ConfirmationState {
    return this._confirmationState;
  }

  set confirmationState(val : ConfirmationState) {
    this._confirmationState = val;
    this.confirmationStateChanges.next(this.confirmationState);
  }

  confirmationStateChanges: Subject<ConfirmationState> = new BehaviorSubject<ConfirmationState>(this.confirmationState);

  tryConfirm({validity, onSuccess, onError, errorMessage}: TryConfirmArgsObjectWithValidity): void {
    this.confirmationState = {
      confirmationAttempted : true
    }

    if(validity < Validity.VALID_FINALIZABLE) {
      if(onError) onError();

      if(errorMessage) {
        this.confirmationState = {
          ...this.confirmationState,
          message : {
            text : errorMessage,
            type : MessageType.INVALID
          }
        }
      }
    } else if(onSuccess) onSuccess();
  }

  clearMessage(): void {
    this.confirmationState = {
      confirmationAttempted : this.confirmationState.confirmationAttempted
    }
  }
  
  reset(): void {
    this.confirmationState = {
      confirmationAttempted : false
    }
  }
  
}