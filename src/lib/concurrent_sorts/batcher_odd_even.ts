import { VisualizationStep } from '../types';

export function batcherOddEvenMergeSort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  
  const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(array.length)));
  while (array.length < nextPowerOfTwo) {
    array.push(Infinity);
  }
  
  steps.push({
    array: [...array].filter(n => n !== Infinity),
    description: 'Starting Batcher Odd-Even Merge Sort - Parallel sorting network',
  });
  
  function compareAndSwap(i: number, j: number): void {
    if (i < array.length && j < array.length && array[i] > array[j]) {
      [array[i], array[j]] = [array[j], array[i]];
      
      const displayArray = array.filter(n => n !== Infinity);
      if (i < displayArray.length && j < displayArray.length) {
        steps.push({
          array: [...displayArray],
          swapping: [i, j],
          description: `Comparing and swapping positions ${i} and ${j}`,
        });
      }
    }
  }
  
  function oddEvenMerge(lo: number, n: number, r: number): void {
    const m = r * 2;
    
    if (m < n) {
      oddEvenMerge(lo, n, m);
      oddEvenMerge(lo + r, n, m);
      
      for (let i = lo + r; i + r < lo + n; i += m) {
        compareAndSwap(i, i + r);
      }
    } else {
      compareAndSwap(lo, lo + r);
    }
  }
  
  function oddEvenMergeSort(lo: number, n: number): void {
    if (n > 1) {
      const m = Math.floor(n / 2);
      
      const displayArray = array.filter(n => n !== Infinity);
      steps.push({
        array: [...displayArray],
        comparing: Array.from({ length: n }, (_, i) => lo + i).filter(idx => idx < displayArray.length),
        description: `Sorting subarray [${lo}...${lo + n - 1}]`,
      });
      
      oddEvenMergeSort(lo, m);
      oddEvenMergeSort(lo + m, n - m);
      
      oddEvenMerge(lo, n, 1);
    }
  }
  
  oddEvenMergeSort(0, array.length);
  
  const result = array.filter(n => n !== Infinity);
  
  steps.push({
    array: result,
    sorted: result.map((_, i) => i),
    description: 'Batcher Odd-Even Merge Sort complete! Fixed comparison network for hardware parallelism',
  });
  
  return steps;
}
