import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Play,
  Pause,
  ArrowClockwise,
  SkipForward,
  SkipBack,
} from '@phosphor-icons/react';

interface ControlPanelProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onSpeedChange: (speed: number) => void;
  onStepChange: (step: number) => void;
}

export function ControlPanel({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBack,
  onSpeedChange,
  onStepChange,
}: ControlPanelProps) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-card rounded-lg border border-border">
      <div className="flex items-center gap-3 justify-center flex-wrap">
        <Button
          size="icon"
          variant="outline"
          onClick={onStepBack}
          disabled={currentStep === 0 || isPlaying}
        >
          <SkipBack weight="fill" />
        </Button>

        {isPlaying ? (
          <Button size="icon" onClick={onPause}>
            <Pause weight="fill" />
          </Button>
        ) : (
          <Button size="icon" onClick={onPlay} disabled={currentStep >= totalSteps - 1}>
            <Play weight="fill" />
          </Button>
        )}

        <Button
          size="icon"
          variant="outline"
          onClick={onStepForward}
          disabled={currentStep >= totalSteps - 1 || isPlaying}
        >
          <SkipForward weight="fill" />
        </Button>

        <Separator orientation="vertical" className="h-8" />

        <Button
          size="icon"
          variant="outline"
          onClick={onReset}
          disabled={currentStep === 0 && !isPlaying}
        >
          <ArrowClockwise />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Progress
          </label>
          <span className="text-xs font-mono text-muted-foreground">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>
        <Slider
          value={[currentStep]}
          max={totalSteps - 1}
          step={1}
          onValueChange={(value) => onStepChange(value[0])}
          disabled={isPlaying}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Speed
          </label>
          <span className="text-xs font-mono text-muted-foreground">
            {speed}x
          </span>
        </div>
        <Slider
          value={[speed]}
          min={0.5}
          max={3}
          step={0.5}
          onValueChange={(value) => onSpeedChange(value[0])}
        />
      </div>
    </div>
  );
}
