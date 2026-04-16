import { VisualizationStep } from '../types';

export function mergeSort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  
  steps.push({
    array: [...array],
    description: 'Starting Stable Merge Sort - Preserves relative order of equal elements',
  });
  
  function merge(left: number, mid: number, right: number): void {
    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);
    
    steps.push({
      array: [...array],
      comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      description: `Merging subarrays [${left}...${mid}] and [${mid + 1}...${right}]`,
    });
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) {
        array[k] = leftArr[i];
        i++;
      } else {
        array[k] = rightArr[j];
        j++;
      }
      
      steps.push({
        array: [...array],
        swapping: [k],
        description: `Placing ${array[k]} in sorted position`,
      });
      k++;
    }
    
    while (i < leftArr.length) {
      array[k++] = leftArr[i++];
    }
    
    while (j < rightArr.length) {
      array[k++] = rightArr[j++];
    }
  }
  
  function mergeSortHelper(left: number, right: number): void {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      mergeSortHelper(left, mid);
      mergeSortHelper(mid + 1, right);
      merge(left, mid, right);
    }
  }
  
  mergeSortHelper(0, array.length - 1);
  
  steps.push({
    array: [...array],
    sorted: array.map((_, i) => i),
    description: 'Merge Sort complete! Stable O(n log n) guaranteed',
  });
  
  return steps;
}

export function cascadeMergeSort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  const n = array.length;
  
  steps.push({
    array: [...array],
    description: 'Starting Cascade Merge Sort - Optimized for tape drives and sequential access',
  });
  
  const runs: number[][] = [];
  const runSize = 32;
  
  for (let i = 0; i < n; i += runSize) {
    const run: number[] = [];
    for (let j = i; j < Math.min(i + runSize, n); j++) {
      run.push(array[j]);
    }
    run.sort((a, b) => a - b);
    runs.push(run);
    
    steps.push({
      array: [...array],
      comparing: Array.from({ length: run.length }, (_, idx) => i + idx),
      description: `Created sorted run ${runs.length}: [${run.slice(0, 5).join(', ')}...]`,
    });
  }
  
  while (runs.length > 1) {
    const merged: number[][] = [];
    
    for (let i = 0; i < runs.length; i += 2) {
      if (i + 1 < runs.length) {
        const mergedRun = [...runs[i], ...runs[i + 1]].sort((a, b) => a - b);
        merged.push(mergedRun);
        
        steps.push({
          array: [...array],
          description: `Cascading merge: combining runs ${i} and ${i + 1} (size: ${mergedRun.length})`,
        });
      } else {
        merged.push(runs[i]);
      }
    }
    
    runs.length = 0;
    runs.push(...merged);
  }
  
  const result = runs[0] || [];
  for (let i = 0; i < result.length; i++) {
    array[i] = result[i];
  }
  
  steps.push({
    array: [...array],
    sorted: array.map((_, i) => i),
    description: 'Cascade Merge Sort complete! Optimized for sequential storage devices',
  });
  
  return steps;
}

export function oscillatingMergeSort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  const n = array.length;
  
  steps.push({
    array: [...array],
    description: 'Starting Oscillating Merge Sort - Alternates merge direction for cache efficiency',
  });
  
  let tempArray = new Array(n);
  let direction = true;
  
  function merge(src: number[], dest: number[], left: number, mid: number, right: number, ascending: boolean): void {
    let i = left;
    let j = mid + 1;
    let k = left;
    
    const dir = ascending ? 1 : -1;
    
    while (i <= mid && j <= right) {
      const comparison = dir * (src[i] - src[j]);
      
      if (comparison <= 0) {
        dest[k++] = src[i++];
      } else {
        dest[k++] = src[j++];
      }
    }
    
    while (i <= mid) dest[k++] = src[i++];
    while (j <= right) dest[k++] = src[j++];
    
    steps.push({
      array: [...dest],
      comparing: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
      description: `Oscillating merge (${ascending ? 'ascending' : 'descending'}): [${left}...${right}]`,
    });
  }
  
  let currSize = 1;
  let toggle = false;
  
  while (currSize < n) {
    for (let left = 0; left < n - 1; left += 2 * currSize) {
      const mid = Math.min(left + currSize - 1, n - 1);
      const right = Math.min(left + 2 * currSize - 1, n - 1);
      
      if (toggle) {
        merge(tempArray, array, left, mid, right, direction);
      } else {
        merge(array, tempArray, left, mid, right, direction);
      }
    }
    
    toggle = !toggle;
    direction = !direction;
    currSize *= 2;
    
    steps.push({
      array: toggle ? [...tempArray] : [...array],
      description: `Oscillation complete - Direction: ${direction ? 'ascending' : 'descending'}`,
    });
  }
  
  const finalArray = toggle ? tempArray : array;
  for (let i = 0; i < n; i++) {
    array[i] = finalArray[i];
  }
  
  steps.push({
    array: [...array],
    sorted: array.map((_, i) => i),
    description: 'Oscillating Merge Sort complete! Cache-optimized bidirectional merging',
  });
  
  return steps;
}
