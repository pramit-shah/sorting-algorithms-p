import { VisualizationStep, TreeNode } from './types';

function createTreeNode(value: number): TreeNode {
  return {
    value,
    left: null,
    right: null,
    id: `node-${value}-${Date.now()}-${Math.random()}`,
  };
}

function cloneTree(node: TreeNode | null): TreeNode | null {
  if (!node) return null;
  return {
    value: node.value,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
    id: node.id,
    highlighted: node.highlighted,
    isNewNode: node.isNewNode,
  };
}

function clearHighlights(node: TreeNode | null): void {
  if (!node) return;
  node.highlighted = false;
  node.isNewNode = false;
  clearHighlights(node.left);
  clearHighlights(node.right);
}

export function bstInsert(values: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let root: TreeNode | null = null;

  steps.push({
    array: values,
    tree: null,
    description: 'Starting Binary Search Tree insertion',
  });

  function insertNode(
    node: TreeNode | null,
    value: number,
    path: string = 'root'
  ): TreeNode {
    if (node === null) {
      const newNode = createTreeNode(value);
      newNode.isNewNode = true;
      steps.push({
        array: values,
        tree: cloneTree(root) || newNode,
        description: `Inserting ${value} at ${path}`,
      });
      return newNode;
    }

    const clonedNode = {
      ...node,
      highlighted: true,
    };

    steps.push({
      array: values,
      tree: cloneTree(root),
      description: `Comparing ${value} with ${node.value} at ${path}`,
    });

    if (value < node.value) {
      node.left = insertNode(node.left, value, `${path} → left`);
    } else if (value > node.value) {
      node.right = insertNode(node.right, value, `${path} → right`);
    } else {
      steps.push({
        array: values,
        tree: cloneTree(root),
        description: `Value ${value} already exists, skipping`,
      });
    }

    clearHighlights(root);
    return node;
  }

  for (const value of values) {
    if (root === null) {
      root = createTreeNode(value);
      root.isNewNode = true;
      steps.push({
        array: values,
        tree: cloneTree(root),
        description: `Creating root node with value ${value}`,
      });
      clearHighlights(root);
    } else {
      clearHighlights(root);
      insertNode(root, value);
    }
  }

  steps.push({
    array: values,
    tree: cloneTree(root),
    description: 'Binary Search Tree construction complete',
  });

  return steps;
}

export function bstSearch(tree: TreeNode | null, target: number): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  
  steps.push({
    array: [target],
    tree: cloneTree(tree),
    description: `Searching for value ${target}`,
  });

  function search(node: TreeNode | null, path: string = 'root'): boolean {
    if (node === null) {
      steps.push({
        array: [target],
        tree: cloneTree(tree),
        description: `Reached null node at ${path} - value ${target} not found`,
      });
      return false;
    }

    const tempTree = cloneTree(tree);
    const findAndHighlight = (n: TreeNode | null, id: string): void => {
      if (!n) return;
      if (n.id === node.id) {
        n.highlighted = true;
      }
      findAndHighlight(n.left, id);
      findAndHighlight(n.right, id);
    };
    findAndHighlight(tempTree, node.id);

    steps.push({
      array: [target],
      tree: tempTree,
      description: `Visiting node ${node.value} at ${path}`,
    });

    if (target === node.value) {
      steps.push({
        array: [target],
        tree: tempTree,
        description: `Found ${target} at ${path}!`,
      });
      return true;
    }

    if (target < node.value) {
      return search(node.left, `${path} → left`);
    } else {
      return search(node.right, `${path} → right`);
    }
  }

  search(tree);
  return steps;
}

export function bstInOrderTraversal(tree: TreeNode | null): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const result: number[] = [];

  steps.push({
    array: [],
    tree: cloneTree(tree),
    description: 'Starting in-order traversal (Left → Root → Right)',
  });

  function traverse(node: TreeNode | null, path: string = 'root'): void {
    if (node === null) return;

    traverse(node.left, `${path} → left`);

    const tempTree = cloneTree(tree);
    const findAndHighlight = (n: TreeNode | null): void => {
      if (!n) return;
      if (n.id === node.id) {
        n.highlighted = true;
      }
      findAndHighlight(n.left);
      findAndHighlight(n.right);
    };
    findAndHighlight(tempTree);

    result.push(node.value);
    steps.push({
      array: [...result],
      tree: tempTree,
      description: `Visiting node ${node.value} at ${path}`,
    });

    traverse(node.right, `${path} → right`);
  }

  traverse(tree);

  steps.push({
    array: result,
    tree: cloneTree(tree),
    description: `Traversal complete: [${result.join(', ')}]`,
  });

  return steps;
}

export function bstBalance(tree: TreeNode | null): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const values: number[] = [];

  steps.push({
    array: [],
    tree: cloneTree(tree),
    description: 'Collecting values from tree via in-order traversal',
  });

  function collectInOrder(node: TreeNode | null): void {
    if (!node) return;
    collectInOrder(node.left);
    values.push(node.value);
    collectInOrder(node.right);
  }

  collectInOrder(tree);

  steps.push({
    array: values,
    tree: cloneTree(tree),
    description: `Collected sorted values: [${values.join(', ')}]`,
  });

  function buildBalancedTree(arr: number[], start: number, end: number): TreeNode | null {
    if (start > end) return null;

    const mid = Math.floor((start + end) / 2);
    const node = createTreeNode(arr[mid]);
    
    node.left = buildBalancedTree(arr, start, mid - 1);
    node.right = buildBalancedTree(arr, mid + 1, end);

    return node;
  }

  const balancedTree = buildBalancedTree(values, 0, values.length - 1);

  steps.push({
    array: values,
    tree: cloneTree(balancedTree),
    description: 'Rebuilt tree as balanced BST',
  });

  return steps;
}

export const bstAlgorithms: Record<string, (data: any) => VisualizationStep[]> = {
  'bst-insert': (values: number[]) => bstInsert(values),
  'bst-search': ({ tree, target }: { tree: TreeNode | null; target: number }) =>
    bstSearch(tree, target),
  'bst-traverse': (tree: TreeNode | null) => bstInOrderTraversal(tree),
  'bst-balance': (tree: TreeNode | null) => bstBalance(tree),
};
