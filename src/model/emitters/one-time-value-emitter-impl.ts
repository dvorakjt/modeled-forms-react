import type { OneTimeValueEmitter } from './one-time-value-emitter.interface';

export class OneTimeValueEmitterImpl<T> implements OneTimeValueEmitter<T> {
  _value?: T;
  _callbacks: Array<(value: T) => void> = [];

  onValue(cb: (value: T) => void) {
    if (this._value) cb(this._value);
    else this._callbacks.push(cb);
  }

  setValue(value: T) {
    if (!this._value) {
      this._value = value;
      for (const cb of this._callbacks) {
        cb(this._value);
      }
    }
  }
}
