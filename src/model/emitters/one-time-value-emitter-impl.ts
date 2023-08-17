import type { OneTimeValueEmitter } from "./one-time-value-emitter.interface";

export class OneTimeValueEmitterImpl<T> implements OneTimeValueEmitter<T> {
  #value? : T;
  #cb?: (value : T) => void;

  onValue(cb: (value : T) => void) {
    if (this.#value) cb(this.#value);
    else this.#cb = cb;
  }

  setValue(value : T) {
    if (!this.#value) {
      this.#value = value;
      if (this.#cb) this.#cb(this.#value);
    }
  }
}