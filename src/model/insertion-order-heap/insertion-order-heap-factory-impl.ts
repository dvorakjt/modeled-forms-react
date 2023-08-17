import { InsertionOrderHeapFactoryKey, type InsertionOrderHeapFactory, type InsertionOrderHeapFactoryKeyType } from "./insertion-order-heap-factory.interface";
import { autowire } from "undecorated-di";
import { InsertionOrderHeap } from "./insertion-order-heap.interface";
import { InsertionOrderHeapImpl } from "./insertion-order-heap-impl";

export class InsertionOrderHeapFactoryImpl implements InsertionOrderHeapFactory {
  createInsertionOrderHeap(): InsertionOrderHeap {
    return new InsertionOrderHeapImpl();
  }
}

export default autowire<InsertionOrderHeapFactoryKeyType, InsertionOrderHeapFactory, InsertionOrderHeapFactoryImpl>(
  InsertionOrderHeapFactoryImpl,
  InsertionOrderHeapFactoryKey
);