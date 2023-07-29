import { OneTimeEventEmitter } from '../types/subscriptions/one-time-event-emitter.interface';

export class OneTimeEventEmitterImpl implements OneTimeEventEmitter {
  #eventOccurred: boolean = false;
  #cb?: () => void;

  onEvent(cb: () => void) {
    if (this.#eventOccurred) cb();
    else this.#cb = cb;
  }

  triggerEvent() {
    if (!this.#eventOccurred) {
      this.#eventOccurred = true;
      if (this.#cb) this.#cb();
    }
  }
}
