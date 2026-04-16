import { motion } from 'framer-motion';
import { TreeNode } from '@/lib/types';

interface TreeVisualizationProps {
  tree: TreeNode | null;
  description: string;
}

interface NodePosition {
  x: number;
  y: number;
  node: TreeNode;
}

export function TreeVisualization({ tree, description }: TreeVisualizationProps) {
  if (!tree) {
    return (
      <div className="w-full h-full flex flex-col gap-4">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">No tree to display</p>
        </div>
        <div className="px-4 py-3 bg-card rounded-lg border border-border">
          <p className="text-sm font-mono text-muted-foreground">{description}</p>
        </div>
      </div>
    );
  }

  const calculatePositions = (
    node: TreeNode | null,
    x: number,
    y: number,
    horizontalSpacing: number
  ): NodePosition[] => {
    if (!node) return [];

    const positions: NodePosition[] = [{ x, y, node }];

    if (node.left) {
      positions.push(
        ...calculatePositions(node.left, x - horizontalSpacing, y + 80, horizontalSpacing / 2)
      );
    }

    if (node.right) {
      positions.push(
        ...calculatePositions(node.right, x + horizontalSpacing, y + 80, horizontalSpacing / 2)
      );
    }

    return positions;
  };

  const positions = calculatePositions(tree, 300, 50, 100);

  const edges: Array<{ from: NodePosition; to: NodePosition }> = [];
  const processEdges = (node: TreeNode | null, currentPos: NodePosition) => {
    if (!node) return;

    if (node.left) {
      const leftPos = positions.find((p) => p.node.id === node.left!.id);
      if (leftPos) {
        edges.push({ from: currentPos, to: leftPos });
        processEdges(node.left, leftPos);
      }
    }

    if (node.right) {
      const rightPos = positions.find((p) => p.node.id === node.right!.id);
      if (rightPos) {
        edges.push({ from: currentPos, to: rightPos });
        processEdges(node.right, rightPos);
      }
    }
  };

  const rootPos = positions.find((p) => p.node.id === tree.id);
  if (rootPos) {
    processEdges(tree, rootPos);
  }

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex-1 relative bg-muted/20 rounded-lg overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 600 400">
          {edges.map((edge, idx) => (
            <motion.line
              key={idx}
              x1={edge.from.x}
              y1={edge.from.y}
              x2={edge.to.x}
              y2={edge.to.y}
              stroke="currentColor"
              strokeWidth="2"
              className="text-border"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
          ))}

          {positions.map((pos) => (
            <g key={pos.node.id}>
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r="20"
                className={`${
                  pos.node.highlighted
                    ? 'fill-comparing'
                    : pos.node.isNewNode
                    ? 'fill-accent'
                    : 'fill-primary'
                } stroke-background`}
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-sm font-mono fill-primary-foreground font-bold"
              >
                {pos.node.value}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="px-4 py-3 bg-card rounded-lg border border-border">
        <p className="text-sm font-mono text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
