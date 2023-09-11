import { Message } from './message.interface';

export interface MultiInputValidatorMessage extends Message {
  hasUnvisitedOrUnmodifiedFields : boolean;
}