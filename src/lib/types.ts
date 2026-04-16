export type AlgorithmCategory = 'comparison' | 'linear' | 'hybrid' | 'data-structures';

export type BarState = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot';

export interface VisualizationStep {
  array: number[];
  comparing?: number[];
  swapping?: number[];
  pivot?: number;
  sorted?: number[];
  description: string;
}

export interface AlgorithmMetrics {
  comparisons: number;
  swaps: number;
  timeComplexity: string;
  spaceComplexity: string;
  executionTime?: number;
}

export interface AlgorithmInfo {
  id: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  stable: boolean;
  useCase: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentStep: number;
  speed: number;
  steps: VisualizationStep[];
}
