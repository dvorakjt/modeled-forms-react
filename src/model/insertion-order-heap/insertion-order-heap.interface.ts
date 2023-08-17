export interface InsertionOrderHeap {
  topValue: string | undefined;
  size: number;
  addValue(value: string): void;
  removeValue(value: string): void;
}
