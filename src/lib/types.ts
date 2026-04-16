export type AlgorithmCategory = 'comparison' | 'linear' | 'hybrid' | 'data-structures';

export type BarState = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot';

export interface VisualizationStep {
  array: (number | string)[];
  comparing?: number[];
  swapping?: number[];
  pivot?: number;
  sorted?: number[];
  description: string;
  tree?: TreeNode | null;
  graph?: GraphState;
}

export interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  id: string;
  highlighted?: boolean;
  isNewNode?: boolean;
}

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  highlighted?: boolean;
  visited?: boolean;
  distance?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight: number;
  highlighted?: boolean;
  inPath?: boolean;
}

export interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  adjacencyList?: Record<string, { nodeId: string; weight: number }[]>;
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
