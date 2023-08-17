import { InsertionOrderHeap } from './insertion-order-heap.interface';

interface InsertionOrderHeapFactory {
  createInsertionOrderHeap(): InsertionOrderHeap;
}
const InsertionOrderHeapFactoryKey = 'InsertionOrderHeapFactory';
type InsertionOrderHeapFactoryKeyType = typeof InsertionOrderHeapFactoryKey;

export {
  InsertionOrderHeapFactoryKey,
  type InsertionOrderHeapFactory,
  type InsertionOrderHeapFactoryKeyType,
};
