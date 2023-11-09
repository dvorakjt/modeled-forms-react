import { Subject } from 'rxjs';
import { ConfirmationState } from './confirmation-state.interface';
import { ResettableFormElement } from '../form-elements/resettable-form-element.interface';
import { Validity } from '../state/validity.enum';

export interface TryConfirmArgsObject {
  onSuccess?: () => void;
  onError?: () => void;
  errorMessage?: string;
}

export type TryConfirmArgsObjectWithValidity = {
  validity: Validity;
} & TryConfirmArgsObject;

export interface ConfirmationManager extends ResettableFormElement {
  confirmationState: ConfirmationState;
  confirmationStateChanges: Subject<ConfirmationState>;
  tryConfirm(argsObject: TryConfirmArgsObjectWithValidity): void;
  clearMessage(): void;
}
