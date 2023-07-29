export interface OneTimeEventEmitter {
  onEvent(cb: () => void): void;
  triggerEvent(): void;
}
