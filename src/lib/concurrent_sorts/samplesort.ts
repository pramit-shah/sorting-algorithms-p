import { VisualizationStep } from '../types';

export function samplesort(arr: number[], numProcessors: number = 4): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  const n = array.length;
  
  steps.push({
    array: [...array],
    description: `Starting Samplesort with ${numProcessors} parallel processors - Divide-and-conquer for distributed systems`,
  });
  
  if (n <= 1) {
    steps.push({
      array: [...array],
      sorted: array.map((_, i) => i),
      description: 'Array already sorted',
    });
    return steps;
  }
  
  const sampleSize = Math.min(numProcessors * Math.log2(n), n);
  const samples: number[] = [];
  const sampleIndices: number[] = [];
  
  for (let i = 0; i < sampleSize; i++) {
    const idx = Math.floor((i * n) / sampleSize);
    samples.push(array[idx]);
    sampleIndices.push(idx);
  }
  
  steps.push({
    array: [...array],
    comparing: sampleIndices,
    description: `Selecting ${sampleSize} samples for pivot selection`,
  });
  
  samples.sort((a, b) => a - b);
  
  const pivots: number[] = [];
  for (let i = 1; i < numProcessors; i++) {
    const pivotIdx = Math.floor((i * samples.length) / numProcessors);
    pivots.push(samples[pivotIdx]);
  }
  
  steps.push({
    array: [...array],
    description: `Selected pivots: [${pivots.join(', ')}]`,
  });
  
  const buckets: number[][] = Array.from({ length: numProcessors }, () => []);
  
  for (let i = 0; i < n; i++) {
    const value = array[i];
    let bucketIdx = 0;
    
    for (let j = 0; j < pivots.length; j++) {
      if (value <= pivots[j]) {
        bucketIdx = j;
        break;
      }
      bucketIdx = j + 1;
    }
    
    buckets[bucketIdx].push(value);
    
    steps.push({
      array: [...array],
      comparing: [i],
      description: `Partitioning ${value} into bucket ${bucketIdx}`,
    });
  }
  
  steps.push({
    array: [...array],
    description: `Partitioned into ${numProcessors} buckets - ready for parallel sorting`,
  });
  
  const sortedBuckets: number[][] = [];
  
  for (let i = 0; i < buckets.length; i++) {
    if (buckets[i].length > 0) {
      steps.push({
        array: [...array],
        description: `Processor ${i} sorting bucket of size ${buckets[i].length}`,
      });
      
      const sorted = buckets[i].sort((a, b) => a - b);
      sortedBuckets.push(sorted);
      
      steps.push({
        array: [...array],
        description: `Processor ${i} completed: [${sorted.slice(0, 5).join(', ')}${sorted.length > 5 ? '...' : ''}]`,
      });
    } else {
      sortedBuckets.push([]);
    }
  }
  
  const result: number[] = [];
  for (const bucket of sortedBuckets) {
    result.push(...bucket);
  }
  
  for (let i = 0; i < result.length; i++) {
    array[i] = result[i];
  }
  
  steps.push({
    array: [...array],
    sorted: array.map((_, i) => i),
    description: `Samplesort complete! Merged ${numProcessors} sorted buckets`,
  });
  
  return steps;
}
