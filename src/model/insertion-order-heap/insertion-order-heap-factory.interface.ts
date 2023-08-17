import { InsertionOrderHeap } from "./insertion-order-heap.interface";

export interface InsertionOrderHeapFactory {
  createInsertionOrderHeap() : InsertionOrderHeap;
}

export const InsertionOrderHeapFactoryKey = 'InsertionOrderHeapFactory';
export type InsertionOrderHeapFactoryKeyType = typeof InsertionOrderHeapFactoryKey;