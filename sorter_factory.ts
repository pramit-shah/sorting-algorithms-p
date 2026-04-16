import { radixSort, quickSort, timSort } from '@/lib/sorting';
import { heapsort } from '@/lib/selection_and_insertion_sorts/heapsort';
import { shellSort, shellSortKnuth } from '@/lib/selection_and_insertion_sorts/shell_sort';
import { bitonicSort } from '@/lib/concurrent_sorts/bitonic_sort';
import { batcherOddEvenMergeSort } from '@/lib/concurrent_sorts/batcher_odd_even';
import { samplesort } from '@/lib/concurrent_sorts/samplesort';
import { topologicalSort, pancakeSort, spaghettiSort } from '@/lib/specialized_sorts/index';
import { bogoSort, slowSort, stoogeSort, cocktailShakerSort } from '@/lib/educational_sorts/index';
import { mergeSort, cascadeMergeSort, oscillatingMergeSort } from '@/lib/merge_sorts/index';
import { radixSortLSD, radixSortMSD, radixSortBinary, countingSortParallel } from '@/lib/distribution_sorts/index';
import { VisualizationStep } from '@/lib/types';

type SortFunction = (arr: number[]) => VisualizationStep[];

type SorterFactoryAvenue = 
  | 'ai_high_performance' 
  | 'general_production' 
  | 'memory_constrained_production'
  | 'concurrent_processing'
  | 'educational'
  | 'specialized';

interface FactoryMap {
  [key: string]: {
    [algorithmName: string]: SortFunction;
  };
}

const sorterFactory: FactoryMap = {
  ai_high_performance: {
    'Radix Sort LSD': radixSortLSD,
    'Radix Sort Binary': radixSortBinary,
    'Counting Sort Parallel': countingSortParallel,
    'Quicksort': quickSort,
  },
  general_production: {
    'Timsort': timSort,
    'Merge Sort': mergeSort,
  },
  memory_constrained_production: {
    'Heapsort': heapsort,
    'Shell Sort (Knuth)': shellSortKnuth,
    'Shell Sort': shellSort,
    'Quicksort': quickSort,
  },
  concurrent_processing: {
    'Bitonic Sort': bitonicSort,
    'Batcher Odd-Even Merge Sort': batcherOddEvenMergeSort,
    'Samplesort': samplesort,
    'Counting Sort Parallel': countingSortParallel,
  },
  educational: {
    'Bogosort': bogoSort,
    'Slowsort': slowSort,
    'Stooge Sort': stoogeSort,
    'Cocktail Shaker Sort': cocktailShakerSort,
  },
  specialized: {
    'Topological Sort': topologicalSort,
    'Pancake Sort': pancakeSort,
    'Spaghetti Sort': spaghettiSort,
    'Cascade Merge Sort': cascadeMergeSort,
    'Oscillating Merge Sort': oscillatingMergeSort,
  },
};

export function fetchSorters(avenue: SorterFactoryAvenue): { [algorithmName: string]: SortFunction } {
  if (!sorterFactory[avenue]) {
    throw new Error(
      `Invalid avenue: "${avenue}". Allowed avenues are: ${Object.keys(sorterFactory).join(', ')}`
    );
  }
  
  return sorterFactory[avenue];
}

export { sorterFactory };
export type { SorterFactoryAvenue, SortFunction };
