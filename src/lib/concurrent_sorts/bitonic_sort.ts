import { VisualizationStep } from '../types';

export function bitonicSort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  
  const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(array.length)));
  while (array.length < nextPowerOfTwo) {
    array.push(Infinity);
  }
  
  steps.push({
    array: [...array].filter(n => n !== Infinity),
    description: 'Starting Bitonic Sort - Optimized for parallel/concurrent processing',
  });
  
  function compareAndSwap(i: number, j: number, dir: boolean): void {
    if ((array[i] > array[j]) === dir) {
      [array[i], array[j]] = [array[j], array[i]];
      
      const displayArray = array.filter(n => n !== Infinity);
      steps.push({
        array: [...displayArray],
        swapping: [Math.min(i, displayArray.length - 1), Math.min(j, displayArray.length - 1)],
        description: `Bitonic merge: swapping ${array[j]} and ${array[i]}`,
      });
    }
  }
  
  function bitonicMerge(low: number, cnt: number, dir: boolean): void {
    if (cnt > 1) {
      const k = Math.floor(cnt / 2);
      
      for (let i = low; i < low + k; i++) {
        compareAndSwap(i, i + k, dir);
      }
      
      bitonicMerge(low, k, dir);
      bitonicMerge(low + k, k, dir);
    }
  }
  
  function bitonicSortRecursive(low: number, cnt: number, dir: boolean): void {
    if (cnt > 1) {
      const k = Math.floor(cnt / 2);
      
      const displayArray = array.filter(n => n !== Infinity);
      steps.push({
        array: [...displayArray],
        comparing: Array.from({ length: cnt }, (_, i) => low + i).filter(idx => idx < displayArray.length),
        description: `Building bitonic sequence [${low}...${low + cnt - 1}]`,
      });
      
      bitonicSortRecursive(low, k, !dir);
      bitonicSortRecursive(low + k, k, dir);
      
      bitonicMerge(low, cnt, dir);
    }
  }
  
  bitonicSortRecursive(0, array.length, true);
  
  const result = array.filter(n => n !== Infinity);
  
  steps.push({
    array: result,
    sorted: result.map((_, i) => i),
    description: 'Bitonic Sort complete! Highly parallelizable with O(log²n) depth',
  });
  
  return steps;
}
