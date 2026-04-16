import { VisualizationStep } from '../types';

export function topologicalSort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  
  steps.push({
    array: [...arr],
    description: 'Topological Sort - For dependency resolution and DAG ordering',
  });
  
  const n = arr.length;
  const graph: Map<number, number[]> = new Map();
  const inDegree: Map<number, number> = new Map();
  
  for (let i = 0; i < n; i++) {
    graph.set(arr[i], []);
    inDegree.set(arr[i], 0);
  }
  
  for (let i = 0; i < n - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      if (!graph.get(arr[i])?.includes(arr[i + 1])) {
        graph.get(arr[i])!.push(arr[i + 1]);
        inDegree.set(arr[i + 1], (inDegree.get(arr[i + 1]) || 0) + 1);
      }
    }
  }
  
  const queue: number[] = [];
  const result: number[] = [];
  
  for (const [node, degree] of inDegree.entries()) {
    if (degree === 0) {
      queue.push(node);
    }
  }
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    result.push(current);
    
    steps.push({
      array: [...result, ...arr.filter(x => !result.includes(x))],
      comparing: [result.length - 1],
      description: `Processing node ${current} (in-degree 0)`,
    });
    
    const neighbors = graph.get(current) || [];
    for (const neighbor of neighbors) {
      inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
      
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }
  
  if (result.length !== n) {
    steps.push({
      array: [...arr],
      description: 'Cycle detected! Topological sort not possible',
    });
    return steps;
  }
  
  steps.push({
    array: result,
    sorted: result.map((_, i) => i),
    description: 'Topological ordering complete - Dependencies resolved',
  });
  
  return steps;
}

export function pancakeSort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  const n = array.length;
  
  steps.push({
    array: [...array],
    description: 'Starting Pancake Sort - Only flip operations allowed!',
  });
  
  function flip(k: number): void {
    let left = 0;
    let right = k;
    
    while (left < right) {
      [array[left], array[right]] = [array[right], array[left]];
      left++;
      right--;
    }
    
    steps.push({
      array: [...array],
      swapping: Array.from({ length: k + 1 }, (_, i) => i),
      description: `Flipped subarray from index 0 to ${k}`,
    });
  }
  
  function findMax(k: number): number {
    let maxIdx = 0;
    for (let i = 0; i <= k; i++) {
      if (array[i] > array[maxIdx]) {
        maxIdx = i;
      }
    }
    return maxIdx;
  }
  
  for (let currSize = n - 1; currSize > 0; currSize--) {
    const maxIdx = findMax(currSize);
    
    steps.push({
      array: [...array],
      comparing: [maxIdx],
      description: `Found maximum ${array[maxIdx]} at index ${maxIdx}`,
    });
    
    if (maxIdx !== currSize) {
      if (maxIdx !== 0) {
        flip(maxIdx);
      }
      
      flip(currSize);
    }
  }
  
  steps.push({
    array: [...array],
    sorted: array.map((_, i) => i),
    description: 'Pancake Sort complete! Only used flip operations',
  });
  
  return steps;
}

export function spaghettiSort(arr: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const array = [...arr];
  
  steps.push({
    array: [...array],
    description: 'Starting Spaghetti Sort - Analog/physical sorting simulation',
  });
  
  const rods: Array<{ value: number; originalIndex: number }> = array.map((value, idx) => ({
    value,
    originalIndex: idx,
  }));
  
  steps.push({
    array: [...array],
    description: 'Simulating physical rods of different lengths',
  });
  
  rods.sort((a, b) => b.value - a.value);
  
  const result: number[] = [];
  
  for (let i = 0; i < rods.length; i++) {
    result.push(rods[i].value);
    
    steps.push({
      array: [...result, ...array.slice(result.length)],
      comparing: [i],
      description: `"Grasping" tallest remaining rod: ${rods[i].value}`,
    });
  }
  
  steps.push({
    array: result.reverse(),
    sorted: result.map((_, i) => i),
    description: 'Spaghetti Sort complete! O(1) time with analog hardware',
  });
  
  return steps;
}
