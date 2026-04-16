import { VisualizationStep, GraphState, GraphNode, GraphEdge } from './types';

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  adjacencyList: Record<string, { nodeId: string; weight: number }[]>;
}

export function createGraph(nodeCount: number = 6): Graph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const adjacencyList: Record<string, { nodeId: string; weight: number }[]> = {};

  const radius = 200;
  const centerX = 300;
  const centerY = 250;

  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    const node: GraphNode = {
      id: `node-${i}`,
      label: String.fromCharCode(65 + i),
      x,
      y,
    };
    nodes.push(node);
    adjacencyList[node.id] = [];
  }

  const connections = [
    [0, 1, 4],
    [0, 2, 2],
    [1, 2, 1],
    [1, 3, 5],
    [2, 3, 8],
    [2, 4, 10],
    [3, 4, 2],
    [3, 5, 6],
    [4, 5, 3],
  ];

  for (const [from, to, weight] of connections) {
    if (from < nodeCount && to < nodeCount) {
      const edge: GraphEdge = {
        from: `node-${from}`,
        to: `node-${to}`,
        weight,
      };
      edges.push(edge);
      adjacencyList[`node-${from}`].push({ nodeId: `node-${to}`, weight });
      adjacencyList[`node-${to}`].push({ nodeId: `node-${from}`, weight });
    }
  }

  return { nodes, edges, adjacencyList };
}

export function dijkstraShortestPath(
  graph: Graph,
  startId: string,
  endId: string
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  for (const node of graph.nodes) {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
  }
  distances[startId] = 0;

  const cloneGraph = (): GraphState => ({
    nodes: graph.nodes.map((n) => ({ ...n })),
    edges: graph.edges.map((e) => ({ ...e })),
    adjacencyList: graph.adjacencyList,
  });

  const updateNodeState = (
    graphState: GraphState,
    nodeId: string,
    updates: Partial<GraphNode>
  ) => {
    const node = graphState.nodes.find((n) => n.id === nodeId);
    if (node) {
      Object.assign(node, updates);
    }
  };

  const updateEdgeState = (
    graphState: GraphState,
    fromId: string,
    toId: string,
    updates: Partial<GraphEdge>
  ) => {
    const edge = graphState.edges.find(
      (e) =>
        (e.from === fromId && e.to === toId) || (e.from === toId && e.to === fromId)
    );
    if (edge) {
      Object.assign(edge, updates);
    }
  };

  steps.push({
    array: [],
    graph: cloneGraph(),
    description: `Starting Dijkstra's algorithm from node ${
      graph.nodes.find((n) => n.id === startId)?.label
    }`,
  });

  const startGraphState = cloneGraph();
  updateNodeState(startGraphState, startId, { highlighted: true, distance: 0 });
  steps.push({
    array: [],
    graph: startGraphState,
    description: `Initialized start node with distance 0`,
  });

  while (unvisited.size > 0) {
    let currentId: string | null = null;
    let minDistance = Infinity;

    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        currentId = nodeId;
      }
    }

    if (currentId === null || minDistance === Infinity) {
      break;
    }

    const currentNode = graph.nodes.find((n) => n.id === currentId)!;

    const visitGraphState = cloneGraph();
    for (const node of visitGraphState.nodes) {
      if (!unvisited.has(node.id)) {
        node.visited = true;
      }
      if (node.id === currentId) {
        node.highlighted = true;
      }
      node.distance = distances[node.id] === Infinity ? undefined : distances[node.id];
    }

    steps.push({
      array: [],
      graph: visitGraphState,
      description: `Visiting node ${currentNode.label} with distance ${distances[currentId]}`,
    });

    unvisited.delete(currentId);

    if (currentId === endId) {
      break;
    }

    const neighbors = graph.adjacencyList[currentId];
    for (const { nodeId: neighborId, weight } of neighbors) {
      if (!unvisited.has(neighborId)) continue;

      const alt = distances[currentId] + weight;

      const exploreGraphState = cloneGraph();
      for (const node of exploreGraphState.nodes) {
        if (!unvisited.has(node.id)) {
          node.visited = true;
        }
        if (node.id === currentId) {
          node.highlighted = true;
        }
        if (node.id === neighborId) {
          node.highlighted = true;
        }
        node.distance = distances[node.id] === Infinity ? undefined : distances[node.id];
      }
      updateEdgeState(exploreGraphState, currentId, neighborId, { highlighted: true });

      const neighborNode = graph.nodes.find((n) => n.id === neighborId)!;
      steps.push({
        array: [],
        graph: exploreGraphState,
        description: `Checking path to ${neighborNode.label}: ${distances[currentId]} + ${weight} = ${alt} ${
          alt < distances[neighborId] ? '< ' + distances[neighborId] + ' (update!)' : '>= ' + distances[neighborId]
        }`,
      });

      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = currentId;
      }
    }
  }

  const path: string[] = [];
  let currentPathId: string | null = endId;
  while (currentPathId !== null) {
    path.unshift(currentPathId);
    currentPathId = previous[currentPathId];
  }

  if (path[0] === startId) {
    const finalGraphState = cloneGraph();
    for (let i = 0; i < finalGraphState.nodes.length; i++) {
      finalGraphState.nodes[i].distance =
        distances[finalGraphState.nodes[i].id] === Infinity
          ? undefined
          : distances[finalGraphState.nodes[i].id];
      finalGraphState.nodes[i].visited = true;
      if (path.includes(finalGraphState.nodes[i].id)) {
        finalGraphState.nodes[i].highlighted = true;
      }
    }

    for (let i = 0; i < path.length - 1; i++) {
      updateEdgeState(finalGraphState, path[i], path[i + 1], { inPath: true });
    }

    const pathLabels = path.map((id) => graph.nodes.find((n) => n.id === id)?.label);
    steps.push({
      array: [],
      graph: finalGraphState,
      description: `Shortest path found: ${pathLabels.join(' → ')} (Distance: ${distances[endId]})`,
    });
  } else {
    steps.push({
      array: [],
      graph: cloneGraph(),
      description: `No path found from ${
        graph.nodes.find((n) => n.id === startId)?.label
      } to ${graph.nodes.find((n) => n.id === endId)?.label}`,
    });
  }

  return steps;
}

export function bfsTraversal(graph: Graph, startId: string): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const visited = new Set<string>();
  const queue: string[] = [startId];

  const cloneGraph = (): GraphState => ({
    nodes: graph.nodes.map((n) => ({ ...n })),
    edges: graph.edges.map((e) => ({ ...e })),
    adjacencyList: graph.adjacencyList,
  });

  steps.push({
    array: [],
    graph: cloneGraph(),
    description: 'Starting Breadth-First Search (BFS)',
  });

  visited.add(startId);

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const currentNode = graph.nodes.find((n) => n.id === currentId)!;

    const graphState = cloneGraph();
    for (const node of graphState.nodes) {
      if (visited.has(node.id)) {
        node.visited = true;
      }
      if (node.id === currentId) {
        node.highlighted = true;
      }
    }

    steps.push({
      array: Array.from(visited).map((id) => graph.nodes.find((n) => n.id === id)?.label || ''),
      graph: graphState,
      description: `Visiting node ${currentNode.label}`,
    });

    const neighbors = graph.adjacencyList[currentId];
    for (const { nodeId: neighborId } of neighbors) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push(neighborId);

        const neighborGraphState = cloneGraph();
        for (const node of neighborGraphState.nodes) {
          if (visited.has(node.id)) {
            node.visited = true;
          }
        }

        const neighborNode = graph.nodes.find((n) => n.id === neighborId)!;
        steps.push({
          array: Array.from(visited).map((id) => graph.nodes.find((n) => n.id === id)?.label || ''),
          graph: neighborGraphState,
          description: `Added ${neighborNode.label} to queue`,
        });
      }
    }
  }

  const finalGraphState = cloneGraph();
  for (const node of finalGraphState.nodes) {
    node.visited = true;
  }

  steps.push({
    array: Array.from(visited).map((id) => graph.nodes.find((n) => n.id === id)?.label || ''),
    graph: finalGraphState,
    description: 'BFS traversal complete',
  });

  return steps;
}

export const graphAlgorithms: Record<string, (data: any) => VisualizationStep[]> = {
  'graph-dijkstra': ({ graph, startId, endId }: { graph: Graph; startId: string; endId: string }) =>
    dijkstraShortestPath(graph, startId, endId),
  'graph-bfs': ({ graph, startId }: { graph: Graph; startId: string }) =>
    bfsTraversal(graph, startId),
};
