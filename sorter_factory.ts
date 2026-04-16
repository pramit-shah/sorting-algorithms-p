import { radixSort, quickSort, timSort } from '@/lib/sorting';
import { VisualizationStep } from '@/lib/types';

type SortFunction = (arr: number[]) => VisualizationStep[];

type SorterFactoryAvenue = 'ai_high_performance' | 'general_production';

interface FactoryMap {
  [key: string]: {
    [algorithmName: string]: SortFunction;
  };
}

const sorterFactory: FactoryMap = {
  ai_high_performance: {
    'Radix Sort': radixSort,
    'Quicksort': quickSort,
  },
  general_production: {
    'Timsort': timSort,
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
