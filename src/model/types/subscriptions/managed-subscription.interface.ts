export interface ManagedSubscription {
  get closed(): boolean;
  unsubscribe(): void;
  onDisposed(cb: () => void): void;
}
