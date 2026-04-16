import { AlgorithmInfo } from './types';

export const algorithms: AlgorithmInfo[] = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'comparison',
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    stable: true,
    useCase: 'Educational purposes, small datasets, nearly sorted data',
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'comparison',
    description: 'Optimized with median-of-three pivot selection and insertion sort for small subarrays. Divides the array using a pivot element, partitions around the pivot, and recursively sorts the sub-arrays.',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(log n)',
    stable: false,
    useCase: 'General-purpose sorting, large datasets, average-case performance critical',
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'comparison',
    description: 'Divides the array into halves, recursively sorts them, and merges the sorted halves back together.',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    spaceComplexity: 'O(n)',
    stable: true,
    useCase: 'Guaranteed O(n log n), stable sorting, linked lists, external sorting',
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'comparison',
    description: 'Builds a max heap from the input data, then repeatedly extracts the maximum element.',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    spaceComplexity: 'O(1)',
    stable: false,
    useCase: 'Memory-constrained environments, guaranteed O(n log n), priority queues',
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'comparison',
    description: 'Builds the sorted array one item at a time by inserting each element into its correct position.',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    stable: true,
    useCase: 'Small datasets, nearly sorted data, online sorting',
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'comparison',
    description: 'Repeatedly finds the minimum element from the unsorted portion and moves it to the beginning.',
    timeComplexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    stable: false,
    useCase: 'Small datasets, minimizing swaps, memory writes are expensive',
  },
  {
    id: 'counting-sort',
    name: 'Counting Sort',
    category: 'linear',
    description: 'Stable counting sort with support for negative numbers. Counts the occurrences of each unique element and uses arithmetic to determine positions.',
    timeComplexity: {
      best: 'O(n + k)',
      average: 'O(n + k)',
      worst: 'O(n + k)',
    },
    spaceComplexity: 'O(k)',
    stable: true,
    useCase: 'Small range of integers, counting occurrences, as subroutine in radix sort',
  },
  {
    id: 'radix-sort',
    name: 'Radix Sort',
    category: 'linear',
    description: 'LSD (Least Significant Digit) radix sort optimized for integers. Sorts numbers by processing individual digits from least to most significant.',
    timeComplexity: {
      best: 'O(d × (n + k))',
      average: 'O(d × (n + k))',
      worst: 'O(d × (n + k))',
    },
    spaceComplexity: 'O(n + k)',
    stable: true,
    useCase: 'Fixed-length integers or strings, large datasets with small digit range',
  },
  {
    id: 'bucket-sort',
    name: 'Bucket Sort',
    category: 'linear',
    description: 'Distributes elements into buckets, sorts each bucket individually, then concatenates them.',
    timeComplexity: {
      best: 'O(n + k)',
      average: 'O(n + k)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(n + k)',
    stable: true,
    useCase: 'Uniformly distributed data, floating-point numbers, external sorting',
  },
  {
    id: 'tim-sort',
    name: 'Tim Sort',
    category: 'hybrid',
    description: 'Production-grade hybrid combining merge sort and binary insertion sort. Features natural run detection and galloping mode optimization for real-world data patterns.',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    spaceComplexity: 'O(n)',
    stable: true,
    useCase: 'Python and Java standard library, real-world data with patterns',
  },
  {
    id: 'intro-sort',
    name: 'Intro Sort',
    category: 'hybrid',
    description: 'Adaptive hybrid algorithm using quicksort with depth limit monitoring. Automatically switches to heapsort when recursion depth is excessive, with insertion sort for small subarrays.',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    spaceComplexity: 'O(log n)',
    stable: false,
    useCase: 'C++ STL sort, general-purpose with worst-case guarantee',
  },
];

export const getAlgorithmsByCategory = (category: string) => {
  return algorithms.filter((algo) => algo.category === category);
};

export const getAlgorithmById = (id: string) => {
  return algorithms.find((algo) => algo.id === id);
};
