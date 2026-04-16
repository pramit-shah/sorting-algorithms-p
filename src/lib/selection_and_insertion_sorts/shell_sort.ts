import { VisualizationStep } from '../types';

export const GAP_SEQUENCES = {
  shell: (n: number): number[] => {
    const gaps: number[] = [];
    let gap = Math.floor(n / 2);
    while (gap > 0) {
      gaps.push(gap);
      gap = Math.floor(gap / 2);
    }
    return gaps;
  },
  
  knuth: (n: number): number[] => {
    const gaps: number[] = [];
    let gap = 1;
    while (gap < n / 3) {
      gap = 3 * gap + 1;
    }
    while (gap > 0) {
      gaps.push(gap);
      gap = Math.floor((gap - 1) / 3);
    }
    return gaps;
  },
  
  sedgewick: (n: number): number[] => {
    const gaps: number[] = [];
    let k = 0;
    let gap = 0;
    
    while (gap < n) {
      if (k % 2 === 0) {
        gap = 9 * Math.pow(2, k) - 9 * Math.pow(2, k / 2) + 1;
      } else {
        gap = 8 * Math.pow(2, k) - 6 * Math.pow(2, Math.floor((k + 1) / 2)) + 1;
      }
      
      if (gap < n) {
        gaps.unshift(gap);
      }
      k++;
    }
    
    return gaps;
  },
  
  hibbard: (n: number): number[] => {
    const gaps: number[] = [];
    let k = 1;
    let gap = 0;
    
    while (gap < n) {
      gap = Math.pow(2, k) - 1;
      if (gap < n) {
        gaps.unshift(gap);
      }
      k++;
    }
    
    return gaps;
  },
  
  pratt: (n: number): number[] => {
    const gaps: number[] = [];
    
    let i = 0;
    while (Math.pow(2, i) < n) {
      let j = 0;
      while (Math.pow(2, i) * Math.pow(3, j) < n) {
        const gap = Math.pow(2, i) * Math.pow(3, j);
        if (gap > 0) {
          gaps.push(gap);
        }
        j++;
      }
      i++;
    }
    
    return gaps.sort((a, b) => b - a);
  },
  
  ciura: (n: number): number[] => {
    const baseGaps = [1, 4, 10, 23, 57, 132, 301, 701, 1750];
    const gaps: number[] = [];
    
    for (const gap of baseGaps) {
      if (gap >= n) break;
      gaps.unshift(gap);
    }
    
    if (gaps.length === 0 || gaps[0] < n / 3) {
      let lastGap = gaps.length > 0 ? gaps[0] : 1750;
      while (lastGap < n / 3) {
        lastGap = Math.floor(lastGap * 2.25);
        gaps.unshift(lastGap);
      }
    }
    
    return gaps;
  },
};

type GapSequenceName = keyof typeof GAP_SEQUENCES;

export function shellSort(
  arr: number[],
  gapSequence: GapSequenceName = 'knuth'
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  const n = array.length;
  
  const gaps = GAP_SEQUENCES[gapSequence](n);
  
  steps.push({
    array: [...array],
    description: `Starting Shell Sort with ${gapSequence.toUpperCase()} gap sequence: [${gaps.join(', ')}]`,
  });
  
  for (const gap of gaps) {
    steps.push({
      array: [...array],
      description: `Current gap: ${gap} - Sorting subarrays ${gap} elements apart`,
    });
    
    for (let i = gap; i < n; i++) {
      const temp = array[i];
      let j = i;
      
      steps.push({
        array: [...array],
        comparing: [i],
        description: `Gap ${gap}: Selecting element ${temp} at position ${i}`,
      });
      
      while (j >= gap && array[j - gap] > temp) {
        steps.push({
          array: [...array],
          comparing: [j, j - gap],
          description: `Comparing ${array[j - gap]} with ${temp} (gap: ${gap})`,
        });
        
        array[j] = array[j - gap];
        
        steps.push({
          array: [...array],
          swapping: [j, j - gap],
          description: `Shifting ${array[j]} forward by gap ${gap}`,
        });
        
        j -= gap;
      }
      
      if (j !== i) {
        array[j] = temp;
        
        steps.push({
          array: [...array],
          swapping: [j],
          description: `Inserting ${temp} at position ${j}`,
        });
      }
    }
    
    steps.push({
      array: [...array],
      description: `Completed pass with gap ${gap}`,
    });
  }
  
  steps.push({
    array: [...array],
    sorted: array.map((_, i) => i),
    description: `Shell Sort complete using ${gapSequence.toUpperCase()} sequence!`,
  });
  
  return steps;
}

export function shellSortShell(arr: number[]): VisualizationStep[] {
  return shellSort(arr, 'shell');
}

export function shellSortKnuth(arr: number[]): VisualizationStep[] {
  return shellSort(arr, 'knuth');
}

export function shellSortSedgewick(arr: number[]): VisualizationStep[] {
  return shellSort(arr, 'sedgewick');
}

export function shellSortHibbard(arr: number[]): VisualizationStep[] {
  return shellSort(arr, 'hibbard');
}

export function shellSortPratt(arr: number[]): VisualizationStep[] {
  return shellSort(arr, 'pratt');
}

export function shellSortCiura(arr: number[]): VisualizationStep[] {
  return shellSort(arr, 'ciura');
}
