export interface OneTimeValueEmitter<T> {
  onValue(cb: (value: T) => void): void;
  setValue(value: T): void;
}
