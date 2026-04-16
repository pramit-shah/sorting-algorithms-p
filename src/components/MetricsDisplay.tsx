import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlgorithmInfo } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

interface MetricsDisplayProps {
  algorithm: AlgorithmInfo;
  comparisons: number;
  swaps: number;
  executionTime?: number;
}

export function MetricsDisplay({
  algorithm,
  comparisons,
  swaps,
  executionTime,
}: MetricsDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-mono">{algorithm.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{algorithm.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Comparisons
            </p>
            <p className="text-2xl font-mono font-bold text-accent">
              {comparisons.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Swaps
            </p>
            <p className="text-2xl font-mono font-bold text-accent">
              {swaps.toLocaleString()}
            </p>
          </div>
        </div>

        {executionTime !== undefined && (
          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Execution Time
            </p>
            <p className="text-lg font-mono font-bold">
              {executionTime.toFixed(2)}ms
            </p>
          </div>
        )}

        <Separator />

        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Time Complexity
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="font-mono">
              Best: {algorithm.timeComplexity.best}
            </Badge>
            <Badge variant="outline" className="font-mono">
              Avg: {algorithm.timeComplexity.average}
            </Badge>
            <Badge variant="outline" className="font-mono">
              Worst: {algorithm.timeComplexity.worst}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Space Complexity
          </p>
          <Badge variant="outline" className="font-mono">
            {algorithm.spaceComplexity}
          </Badge>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Properties
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant={algorithm.stable ? 'default' : 'secondary'}>
              {algorithm.stable ? 'Stable' : 'Unstable'}
            </Badge>
            <Badge variant="secondary" className="capitalize">
              {algorithm.category}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Use Cases
          </p>
          <p className="text-sm text-muted-foreground">{algorithm.useCase}</p>
        </div>
      </CardContent>
    </Card>
  );
}
