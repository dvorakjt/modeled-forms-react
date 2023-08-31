import { OneTimeEventEmitter } from './one-time-event-emitter.interface';

export class OneTimeEventEmitterImpl implements OneTimeEventEmitter {
  _eventOccurred: boolean = false;
  _callbacks: Array<() => void> = [];

  onEvent(cb: () => void) {
    if (this._eventOccurred) cb();
    else this._callbacks.push(cb);
  }

  triggerEvent() {
    if (!this._eventOccurred) {
      this._eventOccurred = true;
      for (const cb of this._callbacks) {
        cb();
      }
    }
  }
}
