import { motion } from 'framer-motion';
import { VisualizationStep } from '@/lib/types';

interface VisualizationCanvasProps {
  step: VisualizationStep;
  maxValue: number;
}

export function VisualizationCanvas({
  step,
  maxValue,
}: VisualizationCanvasProps) {
  const getBarColor = (index: number): string => {
    if (step.sorted?.includes(index)) {
      return 'bg-success';
    }
    if (step.pivot === index) {
      return 'bg-destructive';
    }
    if (step.comparing?.includes(index)) {
      return 'bg-comparing';
    }
    if (step.swapping?.includes(index)) {
      return 'bg-swapping';
    }
    return 'bg-muted';
  };

  const barWidth = Math.max(20, Math.min(60, 800 / step.array.length));
  const gapWidth = Math.max(2, barWidth * 0.1);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex-1 flex items-end justify-center gap-0.5 px-4">
        {step.array.map((value, index) => {
          const height = (value / maxValue) * 100;
          return (
            <motion.div
              key={index}
              className={`rounded-t-sm ${getBarColor(index)} flex items-end justify-center relative`}
              style={{
                width: `${barWidth}px`,
                marginRight: index < step.array.length - 1 ? `${gapWidth}px` : '0',
              }}
              initial={{ height: `${height}%` }}
              animate={{
                height: `${height}%`,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            >
              {step.array.length <= 20 && (
                <span className="text-xs font-mono text-card-foreground mb-1">
                  {value}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
      <div className="px-4 py-3 bg-card rounded-lg border border-border">
        <p className="text-sm font-mono text-muted-foreground">
          {step.description}
        </p>
      </div>
    </div>
  );
}
