import { OneTimeEventEmitter } from './one-time-event-emitter.interface';

export class OneTimeEventEmitterImpl implements OneTimeEventEmitter {
  #eventOccurred: boolean = false;
  #callbacks: Array<() => void> = [];

  onEvent(cb: () => void) {
    if (this.#eventOccurred) cb();
    else this.#callbacks.push(cb);
  }

  triggerEvent() {
    if (!this.#eventOccurred) {
      this.#eventOccurred = true;
      for(const cb of this.#callbacks) {
        cb();
      }
    }
  }
}
