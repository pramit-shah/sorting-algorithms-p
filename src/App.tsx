import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { VisualizationCanvas } from '@/components/VisualizationCanvas';
import { TreeVisualization } from '@/components/TreeVisualization';
import { GraphVisualization } from '@/components/GraphVisualization';
import { ControlPanel } from '@/components/ControlPanel';
import { MetricsDisplay } from '@/components/MetricsDisplay';
import { algorithms, getAlgorithmsByCategory } from '@/lib/algorithms';
import { sortingAlgorithms } from '@/lib/sorting';
import { bstInsert } from '@/lib/bst';
import { createGraph, dijkstraShortestPath, bfsTraversal } from '@/lib/graph';
import { VisualizationStep, AlgorithmCategory } from '@/lib/types';
import { SlidersHorizontal, ChartBar } from '@phosphor-icons/react';
import { Toaster, toast } from 'sonner';

function App() {
  const [category, setCategory] = useState<AlgorithmCategory>('comparison');
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState<string>('bubble-sort');
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(15);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [comparisons, setComparisons] = useState<number>(0);
  const [swaps, setSwaps] = useState<number>(0);
  const [configDialogOpen, setConfigDialogOpen] = useState<boolean>(false);

  const generateRandomArray = (size: number) => {
    const newArray = Array.from({ length: size }, () =>
      Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setComparisons(0);
    setSwaps(0);
  };

  useEffect(() => {
    generateRandomArray(arraySize);
  }, []);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 1000 / speed);
      return () => clearTimeout(timeout);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps.length, speed]);

  useEffect(() => {
    if (steps.length > 0) {
      const step = steps[currentStep];
      let compCount = 0;
      let swapCount = 0;

      for (let i = 0; i <= currentStep; i++) {
        if (steps[i].comparing && steps[i].comparing!.length > 0) {
          compCount++;
        }
        if (steps[i].swapping && steps[i].swapping!.length > 0) {
          swapCount++;
        }
      }

      setComparisons(compCount);
      setSwaps(swapCount);
    }
  }, [currentStep, steps]);

  const handleVisualize = () => {
    if (selectedAlgorithmId.startsWith('bst-')) {
      if (array.length < 1) {
        toast.error('Need at least 1 value for BST');
        return;
      }
      const visualizationSteps = bstInsert(array);
      setSteps(visualizationSteps);
      setCurrentStep(0);
      setComparisons(0);
      setSwaps(0);
      toast.success('BST Visualization ready!');
    } else if (selectedAlgorithmId.startsWith('graph-')) {
      const graph = createGraph(6);
      let visualizationSteps: VisualizationStep[] = [];

      if (selectedAlgorithmId === 'graph-dijkstra') {
        visualizationSteps = dijkstraShortestPath(graph, 'node-0', 'node-5');
      } else if (selectedAlgorithmId === 'graph-bfs') {
        visualizationSteps = bfsTraversal(graph, 'node-0');
      }

      setSteps(visualizationSteps);
      setCurrentStep(0);
      setComparisons(0);
      setSwaps(0);
      toast.success('Graph Visualization ready!');
    } else {
      if (array.length < 2) {
        toast.error('Array must have at least 2 elements');
        return;
      }

      const sortFunction = sortingAlgorithms[selectedAlgorithmId];
      if (sortFunction) {
        const visualizationSteps = sortFunction(array);
        setSteps(visualizationSteps);
        setCurrentStep(0);
        setComparisons(0);
        setSwaps(0);
        toast.success('Visualization ready!');
      } else {
        toast.error('Algorithm not implemented yet');
      }
    }
  };

  const handlePlay = () => {
    if (steps.length === 0) {
      toast.error('Generate visualization first');
      return;
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setComparisons(0);
    setSwaps(0);
  };

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory as AlgorithmCategory);
    const categoryAlgorithms = getAlgorithmsByCategory(newCategory);
    if (categoryAlgorithms.length > 0) {
      setSelectedAlgorithmId(categoryAlgorithms[0].id);
    }
    setSteps([]);
    setCurrentStep(0);
  };

  const handleApplyConfig = () => {
    generateRandomArray(arraySize);
    setConfigDialogOpen(false);
    toast.success('Array regenerated');
  };

  const selectedAlgorithm = algorithms.find(
    (algo) => algo.id === selectedAlgorithmId
  );

  const categoryAlgorithms = getAlgorithmsByCategory(category);
  const maxValue = Math.max(...array, 1);

  const renderVisualization = () => {
    if (steps.length === 0) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-2">
            <ChartBar size={48} className="mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              Select an algorithm and click Visualize to start
            </p>
          </div>
        </div>
      );
    }

    const currentStepData = steps[currentStep];

    if (currentStepData.tree !== undefined) {
      return (
        <TreeVisualization
          tree={currentStepData.tree}
          description={currentStepData.description}
        />
      );
    }

    if (currentStepData.graph) {
      return (
        <GraphVisualization
          graph={currentStepData.graph}
          description={currentStepData.description}
        />
      );
    }

    return (
      <VisualizationCanvas
        step={currentStepData}
        maxValue={maxValue}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <div className="container mx-auto p-6 space-y-6">
        <header className="text-center space-y-2 pb-4">
          <h1 className="text-4xl font-bold font-mono tracking-tight">
            Pylabs Algorithm Visualizer
          </h1>
          <p className="text-muted-foreground">
            Interactive visualization of sorting, data structures, and graph algorithms
          </p>
        </header>

        <Tabs value={category} onValueChange={handleCategoryChange}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="comparison">Comparison Sorts</TabsTrigger>
            <TabsTrigger value="linear">Linear Sorts</TabsTrigger>
            <TabsTrigger value="hybrid">Hybrid Sorts</TabsTrigger>
            <TabsTrigger value="data-structures">
              Data Structures
            </TabsTrigger>
          </TabsList>

          <TabsContent value={category} className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-mono">Algorithm Selection</CardTitle>
                        <CardDescription>
                          Choose an algorithm and configure the input
                        </CardDescription>
                      </div>
                      {!selectedAlgorithmId.startsWith('graph-') && (
                        <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                              <SlidersHorizontal />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="font-mono">
                                {selectedAlgorithmId.startsWith('bst-') ? 'Tree' : 'Array'} Configuration
                              </DialogTitle>
                              <DialogDescription>
                                Configure the {selectedAlgorithmId.startsWith('bst-') ? 'tree values' : 'array size'} and regenerate
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="array-size">
                                  {selectedAlgorithmId.startsWith('bst-') ? 'Value Count' : 'Array Size'}: {arraySize}
                                </Label>
                                <Slider
                                  id="array-size"
                                  value={[arraySize]}
                                  min={5}
                                  max={50}
                                  step={1}
                                  onValueChange={(value) => setArraySize(value[0])}
                                />
                              </div>
                              <Button onClick={handleApplyConfig} className="w-full">
                                Apply & Generate
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-3">
                      <Select
                        value={selectedAlgorithmId}
                        onValueChange={setSelectedAlgorithmId}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryAlgorithms.map((algo) => (
                            <SelectItem key={algo.id} value={algo.id}>
                              {algo.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={handleVisualize} disabled={isPlaying}>
                        <ChartBar className="mr-2" />
                        Visualize
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="h-96">
                  <CardContent className="h-full p-6">
                    {renderVisualization()}
                  </CardContent>
                </Card>

                {steps.length > 0 && (
                  <ControlPanel
                    isPlaying={isPlaying}
                    currentStep={currentStep}
                    totalSteps={steps.length}
                    speed={speed}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onReset={handleReset}
                    onStepForward={handleStepForward}
                    onStepBack={handleStepBack}
                    onSpeedChange={setSpeed}
                    onStepChange={setCurrentStep}
                  />
                )}
              </div>

              <div className="lg:col-span-1">
                {selectedAlgorithm && (
                  <MetricsDisplay
                    algorithm={selectedAlgorithm}
                    comparisons={comparisons}
                    swaps={swaps}
                  />
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
