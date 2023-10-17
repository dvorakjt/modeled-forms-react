import { describe, beforeEach, test, expect } from 'vitest';
import { InsertionOrderHeapImpl } from '../../../model/insertion-order-heap/insertion-order-heap-impl';
import { InsertionOrderHeap } from '../../../model/insertion-order-heap/insertion-order-heap.interface';

describe('InsertionOrderHeapImpl', () => {
  let insertionOrderHeap : InsertionOrderHeap;

  beforeEach(() => {
    insertionOrderHeap = new InsertionOrderHeapImpl();
  });

  test('getting the size attribute correctly returns the number of elements in the heap.', () => {
    for(let i = 0; i < 10; i++) {
      expect(insertionOrderHeap.size).toBe(i);
      insertionOrderHeap.addValue(i.toString());
    }
  });

  test('If there are no elements in the heap, topValue is undefined.', () => {
    expect(insertionOrderHeap.topValue).toBe(undefined);
  });

  test('If there is at least one element in the heap, topValue should match the earliest value added.', () => {
    insertionOrderHeap.addValue('a');
    insertionOrderHeap.addValue('b');
    insertionOrderHeap.addValue('c');
    expect(insertionOrderHeap.topValue).toBe('a');
  });

  test('If a pre-existing element exists in the heap, a duplicate is NOT added to the heap when addValue() is called.', () => {
    for(let i = 0; i < 10; i++) insertionOrderHeap.addValue('a');
    expect(insertionOrderHeap.size).toBe(1);
  });

  test('When a new element is added, it is placed at the bottom of the heap.', () => {
    insertionOrderHeap.addValue('a');
    insertionOrderHeap.addValue('b');
    insertionOrderHeap.addValue('c');
    while(insertionOrderHeap.size > 1) {
      if(insertionOrderHeap.topValue) insertionOrderHeap.removeValue(insertionOrderHeap.topValue);
    }
    expect(insertionOrderHeap.topValue).toBe('c');
  });
});