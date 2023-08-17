import { InsertionOrderHeap } from "./insertion-order-heap.interface";

interface HeapElement {
  readonly priorityId : number;
  readonly value : string;
}

interface ElementDictionaryValue {
  readonly priorityId : number;
  currentHeapIndex : number;
}

export class InsertionOrderHeapImpl implements InsertionOrderHeap {
  #heap : Array<HeapElement> = [];
  #elementDictionary : {
    [key : string] : ElementDictionaryValue
  } = {}
  #currentPriorityId = 0;
  
  get size() {
    return this.#heap.length;
  }
  
  get topValue() : string | undefined {
    return this.#heap[0]?.value;
  }

  addValue(value : string) {
    const elementDictionaryKey = value;
    if(!(elementDictionaryKey in this.#elementDictionary)) {
      this.#elementDictionary[elementDictionaryKey] = {
        priorityId : this.#currentPriorityId++,
        currentHeapIndex : -1
      }
    }
    
    const dictionaryValue = this.#elementDictionary[elementDictionaryKey];

    //if element is already in the heap, there is no need to add it, so return
    if(dictionaryValue.currentHeapIndex >= 0) return;
    
    const heapElement : HeapElement = {
      priorityId : dictionaryValue.priorityId,
      value : value
    }
    this.addHeapElement(heapElement);
  }

  removeValue(value : string) {
    const heapIndex = this.#elementDictionary[value].currentHeapIndex;
    this.removeHeapElementAtIndex(heapIndex);
  }

  private addHeapElement(heapElement : HeapElement) {
    this.#heap.push(heapElement);
    const heapIndex = this.size - 1;
    this.#elementDictionary[heapElement.value].currentHeapIndex = heapIndex;
    this.heapifyUp(heapIndex);
  }

  private removeHeapElementAtIndex(heapIndex : number) {
    //if heap is empty, or the element does not exist in the heap, return
    if(this.size === 0 || heapIndex === -1) return;

    if(heapIndex === this.size - 1) {
      const removedElement = this.#heap[heapIndex];
      this.#heap.pop();
      this.#elementDictionary[removedElement.value].currentHeapIndex = -1;
    } else {
      const removedElement = this.#heap[heapIndex];
      const elevatedElement = this.#heap[heapIndex] = this.#heap[this.size - 1];
      this.#elementDictionary[removedElement.value].currentHeapIndex = -1;
      this.#elementDictionary[elevatedElement.value].currentHeapIndex = heapIndex;
      this.heapifyDown(heapIndex);
    }
  }
  

  private heapifyDown(heapIndex : number) {
    const leftChild = this.leftChild(heapIndex);
    const rightChild = this.rightChild(heapIndex);
    let smallest = heapIndex;
        
    if(leftChild < this.size && this.compareHeapElements(this.#heap[leftChild], this.#heap[smallest]) < 0) {
      smallest = leftChild;
    }
     if(rightChild < this.size && this.compareHeapElements(this.#heap[rightChild], this.#heap[smallest]) < 0) {
      smallest = rightChild;
    }
    if(smallest != heapIndex) {
      const element = this.#heap[heapIndex];
      const smallestElement = this.#heap[smallest];

      this.#elementDictionary[element.value].currentHeapIndex = smallest;
      this.#elementDictionary[smallestElement.value].currentHeapIndex = heapIndex;
      
      this.#heap[heapIndex] = smallestElement;
      this.#heap[smallest] = element;
      
      this.heapifyDown(smallest);
    }
  }

  private heapifyUp(heapIndex : number) {
    while(heapIndex != 0 && this.compareHeapElements(this.#heap[this.parent(heapIndex)], this.#heap[heapIndex]) > 0)
    {
      const temp = this.#heap[this.parent(heapIndex)]; 
      this.#heap[this.parent(heapIndex)] = this.#heap[heapIndex];
      this.#heap[heapIndex] = temp;
      
      this.#elementDictionary[this.#heap[this.parent(heapIndex)].value].currentHeapIndex = this.parent(heapIndex);
      this.#elementDictionary[this.#heap[heapIndex].value].currentHeapIndex = heapIndex;
      
      heapIndex = this.parent(heapIndex);
    }
  }

  private parent(heapIndex : number) {
    return Math.floor((heapIndex - 1) / 2);
  }

  private leftChild(heapIndex : number) {
    return heapIndex * 2 + 1;
  }

  private rightChild(heapIndex : number) {
    return heapIndex * 2 + 2;
  }

  private compareHeapElements(a : HeapElement, b : HeapElement) {
    return a.priorityId - b.priorityId;
  }
}