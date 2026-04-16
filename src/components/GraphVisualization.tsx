import { motion } from 'framer-motion';
import { GraphState } from '@/lib/types';

interface GraphVisualizationProps {
  graph: GraphState;
  description: string;
}

export function GraphVisualization({ graph, description }: GraphVisualizationProps) {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex-1 relative bg-muted/20 rounded-lg overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 600 500">
          {graph.edges.map((edge, idx) => {
            const fromNode = graph.nodes.find((n) => n.id === edge.from);
            const toNode = graph.nodes.find((n) => n.id === edge.to);
            
            if (!fromNode || !toNode) return null;

            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;

            return (
              <g key={idx}>
                <motion.line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  className={`${
                    edge.inPath
                      ? 'stroke-accent'
                      : edge.highlighted
                      ? 'stroke-comparing'
                      : 'stroke-border'
                  }`}
                  strokeWidth={edge.inPath ? '4' : edge.highlighted ? '3' : '2'}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <text
                  x={midX}
                  y={midY - 10}
                  textAnchor="middle"
                  className="text-xs font-mono fill-foreground font-semibold bg-background/80"
                  style={{
                    paintOrder: 'stroke',
                    stroke: 'oklch(0.18 0.02 265)',
                    strokeWidth: '3px',
                  }}
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}

          {graph.nodes.map((node) => (
            <g key={node.id}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="25"
                className={`${
                  node.highlighted
                    ? 'fill-comparing'
                    : node.visited
                    ? 'fill-success'
                    : 'fill-secondary'
                } stroke-background`}
                strokeWidth="3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-base font-mono fill-foreground font-bold pointer-events-none"
              >
                {node.label}
              </text>
              {node.distance !== undefined && (
                <text
                  x={node.x}
                  y={node.y + 40}
                  textAnchor="middle"
                  className="text-xs font-mono fill-accent font-semibold"
                >
                  d: {node.distance}
                </text>
              )}
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
