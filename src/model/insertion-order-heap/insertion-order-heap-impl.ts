import { InsertionOrderHeap } from './insertion-order-heap.interface';

interface HeapElement {
  readonly priorityId: number;
  readonly value: string;
}

interface ElementDictionaryValue {
  readonly priorityId: number;
  currentHeapIndex: number;
}

export class InsertionOrderHeapImpl implements InsertionOrderHeap {
  _heap: Array<HeapElement> = [];
  _elementDictionary: {
    [key: string]: ElementDictionaryValue;
  } = {};
  _currentPriorityId = 0;

  get size() {
    return this._heap.length;
  }

  get topValue(): string | undefined {
    return this._heap[0]?.value;
  }

  addValue(value: string) {
    const elementDictionaryKey = value;
    if (!(elementDictionaryKey in this._elementDictionary)) {
      this._elementDictionary[elementDictionaryKey] = {
        priorityId: this._currentPriorityId++,
        currentHeapIndex: -1,
      };
    }

    const dictionaryValue = this._elementDictionary[elementDictionaryKey];

    //if element is already in the heap, there is no need to add it, so return
    if (dictionaryValue.currentHeapIndex >= 0) return;

    const heapElement: HeapElement = {
      priorityId: dictionaryValue.priorityId,
      value: value,
    };
    this._addHeapElement(heapElement);
  }

  removeValue(value: string) {
    const heapIndex = this._elementDictionary[value].currentHeapIndex;
    this._removeHeapElementAtIndex(heapIndex);
  }

  _addHeapElement(heapElement: HeapElement) {
    this._heap.push(heapElement);
    const heapIndex = this.size - 1;
    this._elementDictionary[heapElement.value].currentHeapIndex = heapIndex;
    this._heapifyUp(heapIndex);
  }

  _removeHeapElementAtIndex(heapIndex: number) {
    //if heap is empty, or the element does not exist in the heap, return
    if (this.size === 0 || heapIndex === -1) return;

    if (heapIndex === this.size - 1) {
      const removedElement = this._heap[heapIndex];
      this._heap.pop();
      this._elementDictionary[removedElement.value].currentHeapIndex = -1;
    } else {
      const removedElement = this._heap[heapIndex];
      const elevatedElement = (this._heap[heapIndex] =
        this._heap[this.size - 1]);
      this._elementDictionary[removedElement.value].currentHeapIndex = -1;
      this._elementDictionary[elevatedElement.value].currentHeapIndex =
        heapIndex;
      this._heapifyDown(heapIndex);
    }
  }

  _heapifyDown(heapIndex: number) {
    const _leftChild = this._leftChild(heapIndex);
    const _rightChild = this._rightChild(heapIndex);
    let smallest = heapIndex;

    if (
      _leftChild < this.size &&
      this._compareHeapElements(this._heap[_leftChild], this._heap[smallest]) < 0
    ) {
      smallest = _leftChild;
    }
    if (
      _rightChild < this.size &&
      this._compareHeapElements(this._heap[_rightChild], this._heap[smallest]) < 0
    ) {
      smallest = _rightChild;
    }
    if (smallest != heapIndex) {
      const element = this._heap[heapIndex];
      const smallestElement = this._heap[smallest];

      this._elementDictionary[element.value].currentHeapIndex = smallest;
      this._elementDictionary[smallestElement.value].currentHeapIndex =
        heapIndex;

      this._heap[heapIndex] = smallestElement;
      this._heap[smallest] = element;

      this._heapifyDown(smallest);
    }
  }

  _heapifyUp(heapIndex: number) {
    while (
      heapIndex != 0 &&
      this._compareHeapElements(
        this._heap[this._parent(heapIndex)],
        this._heap[heapIndex],
      ) > 0
    ) {
      const temp = this._heap[this._parent(heapIndex)];
      this._heap[this._parent(heapIndex)] = this._heap[heapIndex];
      this._heap[heapIndex] = temp;

      this._elementDictionary[
        this._heap[this._parent(heapIndex)].value
      ].currentHeapIndex = this._parent(heapIndex);
      this._elementDictionary[this._heap[heapIndex].value].currentHeapIndex =
        heapIndex;

      heapIndex = this._parent(heapIndex);
    }
  }

  _parent(heapIndex: number) {
    return Math.floor((heapIndex - 1) / 2);
  }

  _leftChild(heapIndex: number) {
    return heapIndex * 2 + 1;
  }

  _rightChild(heapIndex: number) {
    return heapIndex * 2 + 2;
  }

  _compareHeapElements(a: HeapElement, b: HeapElement) {
    return a.priorityId - b.priorityId;
  }
}
