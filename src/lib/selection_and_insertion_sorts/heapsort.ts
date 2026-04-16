import { VisualizationStep } from '../types';

class MaxHeap {
  private heap: number[] = [];
  private steps: VisualizationStep[];
  private originalArray: number[];

  constructor(steps: VisualizationStep[], originalArray: number[]) {
    this.steps = steps;
    this.originalArray = originalArray;
  }

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  private getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }

  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  private heapifyUp(index: number): void {
    let currentIndex = index;
    
    while (currentIndex > 0) {
      const parentIndex = this.getParentIndex(currentIndex);
      
      this.steps.push({
        array: [...this.heap],
        comparing: [currentIndex, parentIndex],
        description: `Heapify up: comparing node ${this.heap[currentIndex]} with parent ${this.heap[parentIndex]}`,
      });
      
      if (this.heap[currentIndex] > this.heap[parentIndex]) {
        this.swap(currentIndex, parentIndex);
        this.steps.push({
          array: [...this.heap],
          swapping: [currentIndex, parentIndex],
          description: `Swapping ${this.heap[parentIndex]} with ${this.heap[currentIndex]} to maintain max heap property`,
        });
        currentIndex = parentIndex;
      } else {
        break;
      }
    }
  }

  private heapifyDown(index: number, heapSize: number): void {
    let currentIndex = index;
    
    while (this.getLeftChildIndex(currentIndex) < heapSize) {
      let largestIndex = currentIndex;
      const leftIndex = this.getLeftChildIndex(currentIndex);
      const rightIndex = this.getRightChildIndex(currentIndex);
      
      if (leftIndex < heapSize) {
        this.steps.push({
          array: [...this.heap],
          comparing: [largestIndex, leftIndex],
          description: `Heapify down: comparing with left child`,
        });
        
        if (this.heap[leftIndex] > this.heap[largestIndex]) {
          largestIndex = leftIndex;
        }
      }
      
      if (rightIndex < heapSize) {
        this.steps.push({
          array: [...this.heap],
          comparing: [largestIndex, rightIndex],
          description: `Heapify down: comparing with right child`,
        });
        
        if (this.heap[rightIndex] > this.heap[largestIndex]) {
          largestIndex = rightIndex;
        }
      }
      
      if (largestIndex !== currentIndex) {
        this.swap(currentIndex, largestIndex);
        this.steps.push({
          array: [...this.heap],
          swapping: [currentIndex, largestIndex],
          description: `Swapping to maintain max heap property`,
        });
        currentIndex = largestIndex;
      } else {
        break;
      }
    }
  }

  public insert(value: number): void {
    this.heap.push(value);
    this.steps.push({
      array: [...this.heap],
      comparing: [this.heap.length - 1],
      description: `Inserting ${value} into heap`,
    });
    this.heapifyUp(this.heap.length - 1);
  }

  public extractMax(): number | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();
    
    const max = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    
    this.steps.push({
      array: [...this.heap],
      swapping: [0],
      description: `Extracted max element ${max}, restructuring heap`,
    });
    
    if (this.heap.length > 0) {
      this.heapifyDown(0, this.heap.length);
    }
    
    return max;
  }

  public buildHeap(arr: number[]): void {
    this.heap = [...arr];
    
    this.steps.push({
      array: [...this.heap],
      description: 'Building max heap from array',
    });
    
    const startIndex = Math.floor(this.heap.length / 2) - 1;
    
    for (let i = startIndex; i >= 0; i--) {
      this.heapifyDown(i, this.heap.length);
    }
    
    this.steps.push({
      array: [...this.heap],
      description: 'Max heap construction complete',
    });
  }

  public sort(): number[] {
    const sorted: number[] = [];
    const heapSize = this.heap.length;
    
    for (let i = heapSize - 1; i >= 0; i--) {
      this.swap(0, i);
      this.steps.push({
        array: [...this.heap],
        swapping: [0, i],
        description: `Moving max element ${this.heap[i]} to sorted position`,
      });
      
      this.heapifyDown(0, i);
    }
    
    return this.heap;
  }

  public getHeap(): number[] {
    return [...this.heap];
  }
}

export function heapsort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  
  steps.push({
    array: [...arr],
    description: 'Starting Heapsort - Memory Efficient O(1) space, In-place sorting',
  });
  
  const heap = new MaxHeap(steps, arr);
  heap.buildHeap(arr);
  
  const sorted = heap.sort();
  
  steps.push({
    array: sorted,
    sorted: sorted.map((_, i) => i),
    description: 'Heapsort complete! Array sorted in-place with O(1) auxiliary space',
  });
  
  return steps;
}
