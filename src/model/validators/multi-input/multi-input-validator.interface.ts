import type { Subject } from 'rxjs';
import type { Message } from '../../state/messages/message.interface';
import type { Validity } from '../../state/validity.enum';
import type { OneTimeValueEmitter } from '../../emitters/one-time-value-emitter.interface';

export interface MultiInputValidator {
  calculatedValidityChanges: Subject<Validity>;
  overallValidityChanges: Subject<Validity>;
  messageChanges: Subject<Message | null>;
  accessedFields: OneTimeValueEmitter<Set<string>>;
}
