import { describe, test, expect } from 'vitest';
import { InsertionOrderHeapFactoryImpl } from '../../../model/insertion-order-heap/insertion-order-heap-factory-impl';
import { InsertionOrderHeapImpl } from '../../../model/insertion-order-heap/insertion-order-heap-impl';

describe('InsertionOrderHeapFactoryImpl', () => {
  test('A new InsertionOrderHeapImpl is returned when createInsertionOrderHeap() is called.', () => {
    const insertionOrderHeapFactory = new InsertionOrderHeapFactoryImpl();
    expect(insertionOrderHeapFactory.createInsertionOrderHeap()).toBeInstanceOf(
      InsertionOrderHeapImpl,
    );
  });
});
