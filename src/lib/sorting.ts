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

  steps.push({
    array: [...array],
    description: 'Starting Quick Sort',
  });

  function partition(low: number, high: number): number {
    const pivot = array[high];
    steps.push({
      array: [...array],
      pivot: high,
      description: `Choosing pivot: ${pivot} at position ${high}`,
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...array],
        comparing: [j, high],
        pivot: high,
        description: `Comparing ${array[j]} with pivot ${pivot}`,
      });

      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        if (i !== j) {
          steps.push({
            array: [...array],
            swapping: [i, j],
            pivot: high,
            description: `Swapping ${array[i]} and ${array[j]}`,
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

  function quickSortHelper(low: number, high: number): void {
    if (low < high) {
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
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
    description: 'Starting Counting Sort',
  });

  const max = Math.max(...array);
  const min = Math.min(...array);
  const range = max - min + 1;
  const count = new Array(range).fill(0);

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

  let outputIndex = 0;
  for (let i = 0; i < range; i++) {
    while (count[i] > 0) {
      array[outputIndex] = i + min;
      steps.push({
        array: [...array],
        swapping: [outputIndex],
        description: `Placing ${i + min} in sorted position`,
      });
      outputIndex++;
      count[i]--;
    }
  }

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
  'radix-sort': countingSort,
  'bucket-sort': countingSort,
  'tim-sort': mergeSort,
  'intro-sort': quickSort,
};
