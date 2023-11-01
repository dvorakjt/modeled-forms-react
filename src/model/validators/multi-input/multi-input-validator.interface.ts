import type { Subject } from 'rxjs';
import type { Validity } from '../../state/validity.enum';
import type { OneTimeValueEmitter } from '../../emitters/one-time-value-emitter.interface';
import { Message } from '../../state/messages/message.interface';

export interface MultiInputValidator {
  calculatedValidityChanges: Subject<Validity>;
  overallValidityChanges: Subject<Validity>;
  messageChanges: Subject<Message | null>;
  accessedFields: OneTimeValueEmitter<Set<string>>;
}
