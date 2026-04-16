import { VisualizationStep } from './types';

export function bubbleSort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  const n = array.length;

  steps.push({
    array: [...array],
    description: 'Starting Bubble Sort',
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...array],
        comparing: [j, j + 1],
        description: `Comparing elements at positions ${j} and ${j + 1}`,
      });

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        steps.push({
          array: [...array],
          swapping: [j, j + 1],
          description: `Swapping elements at positions ${j} and ${j + 1}`,
        });
      }
    }
  }

  steps.push({
    array: [...array],
    sorted: array.map((_, i) => i),
    description: 'Array is sorted!',
  });

  return steps;
}

export function quickSort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  const INSERTION_THRESHOLD = 10;

  steps.push({
    array: [...array],
    description: 'Starting Quick Sort (Median-of-Three + Insertion Sort Optimization)',
  });

  function medianOfThree(low: number, high: number): number {
    const mid = Math.floor((low + high) / 2);
    
    steps.push({
      array: [...array],
      comparing: [low, mid, high],
      description: `Finding median of three: positions ${low}, ${mid}, ${high}`,
    });

    if (array[low] > array[mid]) {
      [array[low], array[mid]] = [array[mid], array[low]];
    }
    if (array[low] > array[high]) {
      [array[low], array[high]] = [array[high], array[low]];
    }
    if (array[mid] > array[high]) {
      [array[mid], array[high]] = [array[high], array[mid]];
    }

    [array[mid], array[high - 1]] = [array[high - 1], array[mid]];
    
    steps.push({
      array: [...array],
      pivot: high - 1,
      description: `Median pivot ${array[high - 1]} placed at position ${high - 1}`,
    });

    return high - 1;
  }

  function insertionSortRange(low: number, high: number): void {
    for (let i = low + 1; i <= high; i++) {
      const key = array[i];
      let j = i - 1;

      while (j >= low && array[j] > key) {
        array[j + 1] = array[j];
        steps.push({
          array: [...array],
          swapping: [j, j + 1],
          description: `Insertion sort: shifting ${array[j + 1]}`,
        });
        j--;
      }
      array[j + 1] = key;
    }
  }

  function partition(low: number, high: number, pivotIndex: number): number {
    const pivot = array[pivotIndex];
    let i = low;
    let j = high;

    while (true) {
      while (array[i] < pivot) {
        i++;
        steps.push({
          array: [...array],
          comparing: [i, pivotIndex],
          pivot: pivotIndex,
          description: `Scanning from left: ${array[i]} < ${pivot}`,
        });
      }

      while (array[j] > pivot) {
        j--;
        steps.push({
          array: [...array],
          comparing: [j, pivotIndex],
          pivot: pivotIndex,
          description: `Scanning from right: ${array[j]} > ${pivot}`,
        });
      }

      if (i >= j) {
        return j;
      }

      [array[i], array[j]] = [array[j], array[i]];
      steps.push({
        array: [...array],
        swapping: [i, j],
        pivot: pivotIndex,
        description: `Swapping ${array[i]} and ${array[j]}`,
      });
      i++;
      j--;
    }
  }

  function quickSortHelper(low: number, high: number): void {
    if (high - low < INSERTION_THRESHOLD) {
      if (high > low) {
        steps.push({
          array: [...array],
          comparing: Array.from({ length: high - low + 1 }, (_, i) => low + i),
          description: `Small subarray detected, switching to insertion sort`,
        });
        insertionSortRange(low, high);
      }
      return;
    }

    if (low < high) {
      const pivotIndex = medianOfThree(low, high);
      const pi = partition(low, high, pivotIndex);
      quickSortHelper(low, pi);
      quickSortHelper(pi + 1, high);
    }
  }

  quickSortHelper(0, array.length - 1);

  steps.push({
    array: [...array],
    sorted: array.map((_, i) => i),
    description: 'Array is sorted!',
  });

  return steps;
}

export function mergeSort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];

  steps.push({
    array: [...array],
    description: 'Starting Merge Sort',
  });

  function merge(left: number, mid: number, right: number): void {
    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);

    steps.push({
      array: [...array],
      comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      description: `Merging subarrays [${left}...${mid}] and [${mid + 1}...${right}]`,
    });

    let i = 0,
      j = 0,
      k = left;

    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) {
        array[k] = leftArr[i];
        i++;
      } else {
        array[k] = rightArr[j];
        j++;
      }
      k++;

      steps.push({
        array: [...array],
        swapping: [k - 1],
        description: `Placing element in sorted position`,
      });
    }

    while (i < leftArr.length) {
      array[k] = leftArr[i];
      i++;
      k++;
      steps.push({
        array: [...array],
        swapping: [k - 1],
        description: `Copying remaining elements`,
      });
    }

    while (j < rightArr.length) {
      array[k] = rightArr[j];
      j++;
      k++;
      steps.push({
        array: [...array],
        swapping: [k - 1],
        description: `Copying remaining elements`,
      });
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
    description: 'Array is sorted!',
  });

  return steps;
}

export function insertionSort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];

  steps.push({
    array: [...array],
    description: 'Starting Insertion Sort',
  });

  for (let i = 1; i < array.length; i++) {
    const key = array[i];
    let j = i - 1;

    steps.push({
      array: [...array],
      comparing: [i],
      description: `Selecting element ${key} at position ${i}`,
    });

    while (j >= 0 && array[j] > key) {
      steps.push({
        array: [...array],
        comparing: [j, j + 1],
        description: `Comparing ${array[j]} with ${key}`,
      });

      array[j + 1] = array[j];
      steps.push({
        array: [...array],
        swapping: [j, j + 1],
        description: `Shifting ${array[j]} to the right`,
      });
      j--;
    }

    array[j + 1] = key;
    steps.push({
      array: [...array],
      swapping: [j + 1],
      description: `Inserting ${key} at position ${j + 1}`,
    });
  }

  steps.push({
    array: [...array],
    sorted: array.map((_, i) => i),
    description: 'Array is sorted!',
  });

  return steps;
}

export function selectionSort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];

  steps.push({
    array: [...array],
    description: 'Starting Selection Sort',
  });

  for (let i = 0; i < array.length - 1; i++) {
    let minIdx = i;

    steps.push({
      array: [...array],
      comparing: [i],
      description: `Finding minimum element from position ${i}`,
    });

    for (let j = i + 1; j < array.length; j++) {
      steps.push({
        array: [...array],
        comparing: [minIdx, j],
        description: `Comparing ${array[minIdx]} with ${array[j]}`,
      });

      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      steps.push({
        array: [...array],
        swapping: [i, minIdx],
        description: `Swapping ${array[i]} with minimum ${array[minIdx]}`,
      });
    }
  }

  steps.push({
    array: [...array],
    sorted: array.map((_, i) => i),
    description: 'Array is sorted!',
  });

  return steps;
}

export function heapSort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  const n = array.length;

  steps.push({
    array: [...array],
    description: 'Starting Heap Sort',
  });

  function heapify(n: number, i: number): void {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      steps.push({
        array: [...array],
        comparing: [largest, left],
        description: `Comparing parent with left child`,
      });

      if (array[left] > array[largest]) {
        largest = left;
      }
    }

    if (right < n) {
      steps.push({
        array: [...array],
        comparing: [largest, right],
        description: `Comparing with right child`,
      });

      if (array[right] > array[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      [array[i], array[largest]] = [array[largest], array[i]];
      steps.push({
        array: [...array],
        swapping: [i, largest],
        description: `Swapping to maintain heap property`,
      });
      heapify(n, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    steps.push({
      array: [...array],
      swapping: [0, i],
      description: `Moving max element to sorted position`,
    });
    heapify(i, 0);
  }

  steps.push({
    array: [...array],
    sorted: array.map((_, i) => i),
    description: 'Array is sorted!',
  });

  return steps;
}

export function countingSort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];

  steps.push({
    array: [...array],
    description: 'Starting Counting Sort (Handles negative numbers)',
  });

  if (array.length === 0) {
    return steps;
  }

  const max = Math.max(...array);
  const min = Math.min(...array);
  const range = max - min + 1;
  const count = new Array(range).fill(0);
  const output = new Array(array.length);

  steps.push({
    array: [...array],
    description: `Counting occurrences (range: ${min} to ${max})`,
  });

  for (let i = 0; i < array.length; i++) {
    count[array[i] - min]++;
    steps.push({
      array: [...array],
      comparing: [i],
      description: `Counting element ${array[i]}`,
    });
  }

  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }

  steps.push({
    array: [...array],
    description: 'Building cumulative count array',
  });

  for (let i = array.length - 1; i >= 0; i--) {
    const value = array[i];
    const index = count[value - min] - 1;
    output[index] = value;
    count[value - min]--;
    
    steps.push({
      array: [...output.map((v, idx) => idx < output.length && output[idx] !== undefined ? output[idx] : array[idx])],
      swapping: [index],
      description: `Placing ${value} at position ${index}`,
    });
  }

  for (let i = 0; i < array.length; i++) {
    array[i] = output[i];
  }

  steps.push({
    array: [...array],
    sorted: array.map((_, i) => i),
    description: 'Array is sorted!',
  });

  return steps;
}

export function radixSort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];

  steps.push({
    array: [...array],
    description: 'Starting Radix Sort (LSD - Least Significant Digit)',
  });

  if (array.length === 0) {
    return steps;
  }

  const hasNegative = array.some(num => num < 0);
  const offset = hasNegative ? Math.abs(Math.min(...array)) : 0;
  const workArray = array.map(num => num + offset);

  function countingSortByDigit(exp: number): void {
    const output = new Array(workArray.length).fill(0);
    const count = new Array(10).fill(0);

    steps.push({
      array: [...array],
      description: `Processing digit at position ${Math.log10(exp) + 1}`,
    });

    for (let i = 0; i < workArray.length; i++) {
      const digit = Math.floor(workArray[i] / exp) % 10;
      count[digit]++;
      steps.push({
        array: [...array],
        comparing: [i],
        description: `Counting digit ${digit} from ${array[i]}`,
      });
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
        description: `Placing ${array[i]} based on current digit`,
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
    description: 'Array is sorted!',
  });

  return steps;
}

export function timSort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  const MIN_MERGE = 32;

  steps.push({
    array: [...array],
    description: 'Starting Timsort (Natural runs + Binary Insertion + Galloping)',
  });

  function binaryInsertionSort(left: number, right: number): void {
    for (let i = left + 1; i <= right; i++) {
      const key = array[i];
      let insertPos = left;
      let l = left;
      let r = i - 1;

      while (l <= r) {
        const mid = Math.floor((l + r) / 2);
        steps.push({
          array: [...array],
          comparing: [mid, i],
          description: `Binary search for position of ${key}`,
        });

        if (array[mid] > key) {
          r = mid - 1;
        } else {
          l = mid + 1;
        }
      }
      insertPos = l;

      for (let j = i; j > insertPos; j--) {
        array[j] = array[j - 1];
        steps.push({
          array: [...array],
          swapping: [j - 1, j],
          description: `Shifting elements for insertion`,
        });
      }
      array[insertPos] = key;
    }
  }

  function merge(left: number, mid: number, right: number): void {
    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);

    steps.push({
      array: [...array],
      comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      description: `Merging runs [${left}...${mid}] and [${mid + 1}...${right}]`,
    });

    let i = 0, j = 0, k = left;
    let gallopCountLeft = 0, gallopCountRight = 0;
    const GALLOP_THRESHOLD = 7;

    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) {
        array[k] = leftArr[i];
        gallopCountLeft++;
        gallopCountRight = 0;
        i++;

        if (gallopCountLeft >= GALLOP_THRESHOLD) {
          steps.push({
            array: [...array],
            swapping: [k],
            description: `Galloping mode: copying from left run`,
          });
          while (i < leftArr.length && leftArr[i] <= rightArr[j]) {
            array[k++] = leftArr[i++];
          }
          gallopCountLeft = 0;
        }
      } else {
        array[k] = rightArr[j];
        gallopCountRight++;
        gallopCountLeft = 0;
        j++;

        if (gallopCountRight >= GALLOP_THRESHOLD) {
          steps.push({
            array: [...array],
            swapping: [k],
            description: `Galloping mode: copying from right run`,
          });
          while (j < rightArr.length && rightArr[j] < leftArr[i]) {
            array[k++] = rightArr[j++];
          }
          gallopCountRight = 0;
        }
      }
      
      steps.push({
        array: [...array],
        swapping: [k],
        description: `Placing element in merged position`,
      });
      k++;
    }

    while (i < leftArr.length) {
      array[k++] = leftArr[i++];
      steps.push({
        array: [...array],
        swapping: [k - 1],
        description: `Copying remaining left elements`,
      });
    }

    while (j < rightArr.length) {
      array[k++] = rightArr[j++];
      steps.push({
        array: [...array],
        swapping: [k - 1],
        description: `Copying remaining right elements`,
      });
    }
  }

  const n = array.length;
  
  for (let start = 0; start < n; start += MIN_MERGE) {
    const end = Math.min(start + MIN_MERGE - 1, n - 1);
    steps.push({
      array: [...array],
      comparing: Array.from({ length: end - start + 1 }, (_, i) => start + i),
      description: `Detecting natural run [${start}...${end}]`,
    });
    binaryInsertionSort(start, end);
  }

  let size = MIN_MERGE;
  while (size < n) {
    for (let start = 0; start < n; start += size * 2) {
      const mid = start + size - 1;
      const end = Math.min(start + size * 2 - 1, n - 1);

      if (mid < end) {
        merge(start, mid, end);
      }
    }
    size *= 2;
  }

  steps.push({
    array: [...array],
    sorted: array.map((_, i) => i),
    description: 'Array is sorted!',
  });

  return steps;
}

export function introSort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  const maxDepth = Math.floor(2 * Math.log2(array.length));

  steps.push({
    array: [...array],
    description: 'Starting Introsort (Quicksort + Heapsort + Insertion Sort)',
  });

  function insertionSortRange(left: number, right: number): void {
    for (let i = left + 1; i <= right; i++) {
      const key = array[i];
      let j = i - 1;

      while (j >= left && array[j] > key) {
        array[j + 1] = array[j];
        steps.push({
          array: [...array],
          swapping: [j, j + 1],
          description: `Insertion sort: shifting ${array[j + 1]}`,
        });
        j--;
      }
      array[j + 1] = key;
    }
  }

  function heapify(start: number, end: number, root: number): void {
    let largest = root;
    const left = 2 * (root - start) + 1 + start;
    const right = 2 * (root - start) + 2 + start;

    if (left <= end) {
      steps.push({
        array: [...array],
        comparing: [largest, left],
        description: `Heapify: comparing with left child`,
      });
      if (array[left] > array[largest]) {
        largest = left;
      }
    }

    if (right <= end) {
      steps.push({
        array: [...array],
        comparing: [largest, right],
        description: `Heapify: comparing with right child`,
      });
      if (array[right] > array[largest]) {
        largest = right;
      }
    }

    if (largest !== root) {
      [array[root], array[largest]] = [array[largest], array[root]];
      steps.push({
        array: [...array],
        swapping: [root, largest],
        description: `Heapify: swapping to maintain heap property`,
      });
      heapify(start, end, largest);
    }
  }

  function heapSort(left: number, right: number): void {
    steps.push({
      array: [...array],
      comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      description: `Depth limit exceeded, switching to Heapsort`,
    });

    for (let i = Math.floor((right - left) / 2) + left; i >= left; i--) {
      heapify(left, right, i);
    }

    for (let i = right; i > left; i--) {
      [array[left], array[i]] = [array[i], array[left]];
      steps.push({
        array: [...array],
        swapping: [left, i],
        description: `Heapsort: moving max to sorted position`,
      });
      heapify(left, i - 1, left);
    }
  }

  function partition(low: number, high: number): number {
    const mid = Math.floor((low + high) / 2);
    const pivot = array[mid];
    [array[mid], array[high]] = [array[high], array[mid]];
    
    steps.push({
      array: [...array],
      pivot: high,
      description: `Quicksort: pivot ${pivot} at position ${high}`,
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...array],
        comparing: [j, high],
        pivot: high,
        description: `Comparing ${array[j]} with pivot`,
      });

      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        if (i !== j) {
          steps.push({
            array: [...array],
            swapping: [i, j],
            pivot: high,
            description: `Swapping elements`,
          });
        }
      }
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    steps.push({
      array: [...array],
      swapping: [i + 1, high],
      description: `Placing pivot in correct position`,
    });

    return i + 1;
  }

  function introSortHelper(low: number, high: number, depth: number): void {
    const size = high - low + 1;

    if (size < 16) {
      insertionSortRange(low, high);
      return;
    }

    if (depth === 0) {
      heapSort(low, high);
      return;
    }

    if (low < high) {
      const pi = partition(low, high);
      introSortHelper(low, pi - 1, depth - 1);
      introSortHelper(pi + 1, high, depth - 1);
    }
  }

  introSortHelper(0, array.length - 1, maxDepth);

  steps.push({
    array: [...array],
    sorted: array.map((_, i) => i),
    description: 'Array is sorted!',
  });

  return steps;
}

export const sortingAlgorithms: Record<
  string,
  (arr: number[]) => VisualizationStep[]
> = {
  'bubble-sort': bubbleSort,
  'quick-sort': quickSort,
  'merge-sort': mergeSort,
  'heap-sort': heapSort,
  'insertion-sort': insertionSort,
  'selection-sort': selectionSort,
  'counting-sort': countingSort,
  'radix-sort': radixSort,
  'bucket-sort': countingSort,
  'tim-sort': timSort,
  'intro-sort': introSort,
};
