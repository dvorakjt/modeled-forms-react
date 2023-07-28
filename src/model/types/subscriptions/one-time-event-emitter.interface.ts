export interface OneTimeEventEmitter {
  get eventOccurred(): boolean;
  onEvent(cb: () => void): void;
  triggerEvent(): void;
}
