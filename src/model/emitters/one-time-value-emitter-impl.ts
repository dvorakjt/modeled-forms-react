import type { OneTimeValueEmitter } from './one-time-value-emitter.interface';

export class OneTimeValueEmitterImpl<T> implements OneTimeValueEmitter<T> {
  #value?: T;
  #callbacks: Array<(value: T) => void> = [];

  onValue(cb: (value: T) => void) {
    if (this.#value) cb(this.#value);
    else this.#callbacks.push(cb);
  }

  setValue(value: T) {
    if (!this.#value) {
      this.#value = value;
      for(const cb of this.#callbacks) {
        cb(this.#value);
      }
    }
  }
}
