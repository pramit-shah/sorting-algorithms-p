import { VisualizationStep } from '../types';

export function radixSortLSD(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  
  steps.push({
    array: [...array],
    description: 'Starting Radix Sort LSD (Least Significant Digit) - Processes digits right to left',
  });
  
  if (array.length === 0) return steps;
  
  const hasNegative = array.some(num => num < 0);
  const offset = hasNegative ? Math.abs(Math.min(...array)) : 0;
  const workArray = array.map(num => num + offset);
  
  function countingSortByDigit(exp: number): void {
    const output = new Array(workArray.length).fill(0);
    const count = new Array(10).fill(0);
    
    for (let i = 0; i < workArray.length; i++) {
      const digit = Math.floor(workArray[i] / exp) % 10;
      count[digit]++;
    }
    
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }
    
    for (let i = workArray.length - 1; i >= 0; i--) {
      const digit = Math.floor(workArray[i] / exp) % 10;
      const index = count[digit] - 1;
      output[index] = workArray[i];
      count[digit]--;
    }
    
    for (let i = 0; i < workArray.length; i++) {
      workArray[i] = output[i];
      array[i] = output[i] - offset;
      
      steps.push({
        array: [...array],
        swapping: [i],
        description: `LSD: Placing ${array[i]} based on digit at position ${Math.log10(exp) + 1}`,
      });
    }
  }
  
  const max = Math.max(...workArray);
  let exp = 1;
  
  while (Math.floor(max / exp) > 0) {
    countingSortByDigit(exp);
    exp *= 10;
  }
  
  steps.push({
    array: [...array],
    sorted: array.map((_, i) => i),
    description: 'Radix Sort LSD complete! Stable O(d*n) where d is digit count',
  });
  
  return steps;
}

export function radixSortMSD(arr: number[] | string[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  
  const isStringArray = arr.length > 0 && typeof arr[0] === 'string';
  
  if (isStringArray) {
    return radixSortMSDStrings(arr as string[]);
  } else {
    return radixSortMSDNumbers(arr as number[]);
  }
}

function radixSortMSDNumbers(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  
  steps.push({
    array: [...array],
    description: 'Starting Radix Sort MSD (Most Significant Digit) - Processes digits left to right',
  });
  
  if (array.length === 0) return steps;
  
  const max = Math.max(...array.map(Math.abs));
  const maxDigits = Math.floor(Math.log10(max)) + 1;
  
  function msdSort(arr: number[], left: number, right: number, digit: number): void {
    if (left >= right || digit < 0) return;
    
    const buckets: number[][] = Array.from({ length: 19 }, () => []);
    
    for (let i = left; i <= right; i++) {
      const digitValue = Math.floor(arr[i] / Math.pow(10, digit)) % 10;
      const bucketIndex = digitValue + 9;
      buckets[bucketIndex].push(arr[i]);
    }
    
    let index = left;
    for (const bucket of buckets) {
      for (const value of bucket) {
        arr[index++] = value;
      }
    }
    
    steps.push({
      array: [...arr],
      comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      description: `MSD: Sorting by digit ${digit} (left to right)`,
    });
    
    let bucketStart = left;
    for (const bucket of buckets) {
      if (bucket.length > 1) {
        msdSort(arr, bucketStart, bucketStart + bucket.length - 1, digit - 1);
      }
      bucketStart += bucket.length;
    }
  }
  
  msdSort(array, 0, array.length - 1, maxDigits - 1);
  
  steps.push({
    array: [...array],
    sorted: array.map((_, i) => i),
    description: 'Radix Sort MSD complete! Optimized for early termination on sorted buckets',
  });
  
  return steps;
}

function radixSortMSDStrings(arr: string[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  
  steps.push({
    array: array.map((s, i) => i),
    description: `Starting Radix Sort MSD for strings: [${array.join(', ')}]`,
  });
  
  function charCodeAt(str: string, index: number): number {
    return index < str.length ? str.charCodeAt(index) : -1;
  }
  
  function msdStringSort(arr: string[], left: number, right: number, charIndex: number): void {
    if (left >= right) return;
    
    const R = 256;
    const buckets: string[][] = Array.from({ length: R + 1 }, () => []);
    
    for (let i = left; i <= right; i++) {
      const charCode = charCodeAt(arr[i], charIndex);
      buckets[charCode + 1].push(arr[i]);
    }
    
    let index = left;
    for (const bucket of buckets) {
      for (const value of bucket) {
        arr[index++] = value;
      }
    }
    
    steps.push({
      array: array.map((s, i) => i),
      comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      description: `MSD String: Sorting by character ${charIndex} - [${arr.slice(left, right + 1).join(', ')}]`,
    });
    
    let bucketStart = left;
    for (let r = 0; r < buckets.length; r++) {
      if (buckets[r].length > 1) {
        msdStringSort(arr, bucketStart, bucketStart + buckets[r].length - 1, charIndex + 1);
      }
      bucketStart += buckets[r].length;
    }
  }
  
  msdStringSort(array, 0, array.length - 1, 0);
  
  steps.push({
    array: array.map((s, i) => i),
    sorted: array.map((_, i) => i),
    description: `MSD String Sort complete! Sorted: [${array.join(', ')}]`,
  });
  
  return steps;
}

export function radixSortBinary(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  
  steps.push({
    array: [...array],
    description: 'Starting Binary Radix Sort - Processes bits for maximum efficiency',
  });
  
  if (array.length === 0) return steps;
  
  const max = Math.max(...array);
  const maxBits = max.toString(2).length;
  
  for (let bit = 0; bit < maxBits; bit++) {
    const zeros: number[] = [];
    const ones: number[] = [];
    
    for (const num of array) {
      if ((num & (1 << bit)) === 0) {
        zeros.push(num);
      } else {
        ones.push(num);
      }
    }
    
    let index = 0;
    for (const num of zeros) {
      array[index++] = num;
    }
    for (const num of ones) {
      array[index++] = num;
    }
    
    steps.push({
      array: [...array],
      description: `Binary Radix: Sorted by bit ${bit} (0s: ${zeros.length}, 1s: ${ones.length})`,
    });
  }
  
  steps.push({
    array: [...array],
    sorted: array.map((_, i) => i),
    description: 'Binary Radix Sort complete! Bit-level sorting for integers',
  });
  
  return steps;
}

interface SortableObject {
  [key: string]: number | string;
}

export function countingSortObjects<T extends SortableObject>(
  arr: T[],
  key: keyof T
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  
  steps.push({
    array: arr.map((_, i) => i),
    description: `Starting Counting Sort on objects by key "${String(key)}"`,
  });
  
  if (arr.length === 0) return steps;
  
  const values = arr.map(obj => obj[key]);
  const isNumeric = typeof values[0] === 'number';
  
  if (!isNumeric) {
    steps.push({
      array: arr.map((_, i) => i),
      description: 'Counting sort requires numeric keys',
    });
    return steps;
  }
  
  const numValues = values as number[];
  const min = Math.min(...numValues);
  const max = Math.max(...numValues);
  const range = max - min + 1;
  
  const count = new Array(range).fill(0);
  const output: T[] = new Array(arr.length);
  
  for (let i = 0; i < arr.length; i++) {
    count[(numValues[i] - min)]++;
  }
  
  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }
  
  for (let i = arr.length - 1; i >= 0; i--) {
    const value = numValues[i];
    const index = count[value - min] - 1;
    output[index] = arr[i];
    count[value - min]--;
    
    steps.push({
      array: output.map((_, idx) => idx),
      swapping: [index],
      description: `Placing object with ${String(key)}=${value} at position ${index}`,
    });
  }
  
  for (let i = 0; i < arr.length; i++) {
    arr[i] = output[i];
  }
  
  steps.push({
    array: arr.map((_, i) => i),
    sorted: arr.map((_, i) => i),
    description: `Counting Sort complete! Objects sorted by key "${String(key)}"`,
  });
  
  return steps;
}

export function countingSortParallel(arr: number[], numThreads: number = 4): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  
  steps.push({
    array: [...array],
    description: `Starting Parallel Counting Sort with ${numThreads} simulated threads`,
  });
  
  if (array.length === 0) return steps;
  
  const min = Math.min(...array);
  const max = Math.max(...array);
  const range = max - min + 1;
  
  const chunkSize = Math.ceil(array.length / numThreads);
  const localCounts: number[][] = [];
  
  for (let t = 0; t < numThreads; t++) {
    const start = t * chunkSize;
    const end = Math.min(start + chunkSize, array.length);
    const localCount = new Array(range).fill(0);
    
    for (let i = start; i < end; i++) {
      localCount[array[i] - min]++;
    }
    
    localCounts.push(localCount);
    
    steps.push({
      array: [...array],
      comparing: Array.from({ length: end - start }, (_, i) => start + i),
      description: `Thread ${t} counting chunk [${start}...${end - 1}]`,
    });
  }
  
  const globalCount = new Array(range).fill(0);
  for (const localCount of localCounts) {
    for (let i = 0; i < range; i++) {
      globalCount[i] += localCount[i];
    }
  }
  
  steps.push({
    array: [...array],
    description: 'Merging counts from all threads',
  });
  
  for (let i = 1; i < globalCount.length; i++) {
    globalCount[i] += globalCount[i - 1];
  }
  
  const output = new Array(array.length);
  
  for (let i = array.length - 1; i >= 0; i--) {
    const value = array[i];
    const index = globalCount[value - min] - 1;
    output[index] = value;
    globalCount[value - min]--;
  }
  
  for (let i = 0; i < array.length; i++) {
    array[i] = output[i];
  }
  
  steps.push({
    array: [...array],
    sorted: array.map((_, i) => i),
    description: `Parallel Counting Sort complete! Utilized ${numThreads} threads for O(n+k) performance`,
  });
  
  return steps;
}
