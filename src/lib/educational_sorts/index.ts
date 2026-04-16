import { VisualizationStep } from '../types';

export function bogoSort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  let attempts = 0;
  const MAX_ATTEMPTS = 1000;
  
  steps.push({
    array: [...array],
    description: 'Starting Bogosort - Random permutation until sorted (EDUCATIONAL ONLY!)',
  });
  
  function isSorted(): boolean {
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] > array[i + 1]) {
        return false;
      }
    }
    return true;
  }
  
  function shuffle(): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  while (!isSorted() && attempts < MAX_ATTEMPTS) {
    shuffle();
    attempts++;
    
    steps.push({
      array: [...array],
      description: `Attempt ${attempts}: Random permutation ${isSorted() ? '✓ SORTED!' : '✗ Not sorted'}`,
    });
  }
  
  if (isSorted()) {
    steps.push({
      array: [...array],
      sorted: array.map((_, i) => i),
      description: `Bogosort complete after ${attempts} attempts! Average: O((n+1)!) time`,
    });
  } else {
    steps.push({
      array: [...array],
      description: `Gave up after ${MAX_ATTEMPTS} attempts. Bogosort is impractical!`,
    });
  }
  
  return steps;
}

export function slowSort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  
  steps.push({
    array: [...array],
    description: 'Starting Slowsort - Intentionally slow multiply-and-surrender algorithm',
  });
  
  function slowSortHelper(i: number, j: number): void {
    if (i >= j) return;
    
    const m = Math.floor((i + j) / 2);
    
    steps.push({
      array: [...array],
      comparing: Array.from({ length: j - i + 1 }, (_, idx) => i + idx),
      description: `Recursively sorting [${i}...${m}] and [${m + 1}...${j}]`,
    });
    
    slowSortHelper(i, m);
    slowSortHelper(m + 1, j);
    
    if (array[m] > array[j]) {
      [array[m], array[j]] = [array[j], array[m]];
      
      steps.push({
        array: [...array],
        swapping: [m, j],
        description: `Swapping maximum to end: ${array[j]} and ${array[m]}`,
      });
    }
    
    slowSortHelper(i, j - 1);
  }
  
  slowSortHelper(0, array.length - 1);
  
  steps.push({
    array: [...array],
    sorted: array.map((_, i) => i),
    description: 'Slowsort complete! Complexity: O(n^(log(n)/(2+ε))) - deliberately inefficient',
  });
  
  return steps;
}

export function stoogeSort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  
  steps.push({
    array: [...array],
    description: 'Starting Stooge Sort - Recursive sorting with 2/3 overlap',
  });
  
  function stoogeSortHelper(left: number, right: number): void {
    if (left >= right) return;
    
    if (array[left] > array[right]) {
      [array[left], array[right]] = [array[right], array[left]];
      
      steps.push({
        array: [...array],
        swapping: [left, right],
        description: `Swapping endpoints: ${array[right]} and ${array[left]}`,
      });
    }
    
    if (right - left + 1 > 2) {
      const third = Math.floor((right - left + 1) / 3);
      
      steps.push({
        array: [...array],
        comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        description: `Sorting first 2/3, last 2/3, then first 2/3 again`,
      });
      
      stoogeSortHelper(left, right - third);
      stoogeSortHelper(left + third, right);
      stoogeSortHelper(left, right - third);
    }
  }
  
  stoogeSortHelper(0, array.length - 1);
  
  steps.push({
    array: [...array],
    sorted: array.map((_, i) => i),
    description: 'Stooge Sort complete! Complexity: O(n^2.7095) - inefficient but interesting',
  });
  
  return steps;
}

export function cocktailShakerSort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  
  steps.push({
    array: [...array],
    description: 'Starting Cocktail Shaker Sort - Bidirectional Bubble Sort',
  });
  
  let swapped = true;
  let start = 0;
  let end = array.length - 1;
  
  while (swapped) {
    swapped = false;
    
    steps.push({
      array: [...array],
      description: `Forward pass from ${start} to ${end}`,
    });
    
    for (let i = start; i < end; i++) {
      steps.push({
        array: [...array],
        comparing: [i, i + 1],
        description: `Comparing ${array[i]} and ${array[i + 1]}`,
      });
      
      if (array[i] > array[i + 1]) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        swapped = true;
        
        steps.push({
          array: [...array],
          swapping: [i, i + 1],
          description: `Swapping ${array[i + 1]} and ${array[i]}`,
        });
      }
    }
    
    if (!swapped) break;
    
    swapped = false;
    end--;
    
    steps.push({
      array: [...array],
      description: `Backward pass from ${end} to ${start}`,
    });
    
    for (let i = end; i > start; i--) {
      steps.push({
        array: [...array],
        comparing: [i - 1, i],
        description: `Comparing ${array[i - 1]} and ${array[i]}`,
      });
      
      if (array[i - 1] > array[i]) {
        [array[i - 1], array[i]] = [array[i], array[i - 1]];
        swapped = true;
        
        steps.push({
          array: [...array],
          swapping: [i - 1, i],
          description: `Swapping ${array[i]} and ${array[i - 1]}`,
        });
      }
    }
    
    start++;
  }
  
  steps.push({
    array: [...array],
    sorted: array.map((_, i) => i),
    description: 'Cocktail Shaker Sort complete! Slightly better than Bubble Sort on some inputs',
  });
  
  return steps;
}
