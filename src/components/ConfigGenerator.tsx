import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Download, Copy, Terminal } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { useKV } from '@github/spark/hooks';

type Avenue = 'ai_high_performance' | 'general_production';

interface SorterConfig {
  avenue: Avenue;
  allowedFunctions: string[];
  timestamp: string;
  description: string;
}

const avenueDetails: Record<Avenue, { description: string; functions: string[]; use_cases: string[] }> = {
  ai_high_performance: {
    description: 'Optimized for high-performance computing, AI workloads, and scenarios requiring maximum speed',
    functions: ['Radix Sort', 'Quicksort'],
    use_cases: [
      'Machine learning data preprocessing',
      'High-frequency trading systems',
      'Real-time data processing pipelines',
      'Scientific computing applications',
    ],
  },
  general_production: {
    description: 'Stable, reliable sorting for general production environments and enterprise applications',
    functions: ['Timsort'],
    use_cases: [
      'Enterprise application backends',
      'Database query result sorting',
      'General-purpose web services',
      'Data serialization and export',
    ],
  },
};

export function ConfigGenerator() {
  const [selectedAvenue, setSelectedAvenue] = useKV<Avenue | null>('selected-avenue', null);
  const [config, setConfig] = useState<SorterConfig | null>(null);

  const generateConfig = () => {
    if (!selectedAvenue) {
      toast.error('Please select an avenue first');
      return;
    }

    const newConfig: SorterConfig = {
      avenue: selectedAvenue,
      allowedFunctions: avenueDetails[selectedAvenue].functions,
      timestamp: new Date().toISOString(),
      description: avenueDetails[selectedAvenue].description,
    };

    setConfig(newConfig);
    toast.success('Configuration generated successfully!');
  };

  const downloadConfig = () => {
    if (!config) return;

    const jsonString = JSON.stringify(config, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sorter_config.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Configuration downloaded!');
  };

  const copyConfig = () => {
    if (!config) return;

    const jsonString = JSON.stringify(config, null, 2);
    navigator.clipboard.writeText(jsonString);
    toast.success('Configuration copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Terminal size={32} className="text-accent" weight="duotone" />
            <div>
              <CardTitle className="font-mono text-2xl">Sorter Configuration Generator</CardTitle>
              <CardDescription className="text-base mt-1">
                Interactive configuration tool for sorter_factory.ts avenue selection
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold font-mono uppercase tracking-wide text-muted-foreground">
              Select Your Avenue
            </h3>
            
            <RadioGroup
              value={selectedAvenue || ''}
              onValueChange={(value) => setSelectedAvenue(value as Avenue)}
            >
              <div className="grid gap-4">
                {(Object.keys(avenueDetails) as Avenue[]).map((avenue) => (
                  <Card
                    key={avenue}
                    className={`cursor-pointer transition-all ${
                      selectedAvenue === avenue
                        ? 'border-accent bg-accent/5 shadow-lg shadow-accent/20'
                        : 'hover:border-accent/50 hover:bg-accent/5'
                    }`}
                    onClick={() => setSelectedAvenue(avenue)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <RadioGroupItem value={avenue} id={avenue} className="mt-1" />
                        <div className="flex-1 space-y-3">
                          <Label
                            htmlFor={avenue}
                            className="text-base font-semibold font-mono cursor-pointer flex items-center gap-2"
                          >
                            {avenue}
                            {selectedAvenue === avenue && (
                              <CheckCircle size={20} className="text-accent" weight="fill" />
                            )}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {avenueDetails[avenue].description}
                          </p>
                          
                          <div className="space-y-2">
                            <p className="text-xs font-semibold font-mono uppercase tracking-wide text-muted-foreground">
                              Available Functions:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {avenueDetails[avenue].functions.map((func) => (
                                <Badge key={func} variant="secondary" className="font-mono">
                                  {func}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-semibold font-mono uppercase tracking-wide text-muted-foreground">
                              Use Cases:
                            </p>
                            <ul className="space-y-1">
                              {avenueDetails[avenue].use_cases.map((useCase, idx) => (
                                <li key={idx} className="text-xs text-foreground/70 flex items-start gap-2">
                                  <span className="text-accent mt-0.5">•</span>
                                  {useCase}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button
              onClick={generateConfig}
              disabled={!selectedAvenue}
              className="font-mono"
              size="lg"
            >
              <Terminal size={20} weight="bold" />
              Generate Configuration
            </Button>
            {config && (
              <>
                <Button
                  onClick={downloadConfig}
                  variant="secondary"
                  className="font-mono"
                  size="lg"
                >
                  <Download size={20} weight="bold" />
                  Download JSON
                </Button>
                <Button
                  onClick={copyConfig}
                  variant="outline"
                  className="font-mono"
                  size="lg"
                >
                  <Copy size={20} />
                  Copy
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {config && (
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="font-mono flex items-center gap-2">
              <CheckCircle size={24} className="text-accent" weight="fill" />
              Generated Configuration
            </CardTitle>
            <CardDescription>
              Save this as <code className="font-mono text-accent">sorter_config.json</code> in your project root
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-background p-4 rounded-lg overflow-x-auto font-mono text-sm border border-border">
              {JSON.stringify(config, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="font-mono text-lg">Integration Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold font-mono mb-2">Step 1: Generate Configuration</h4>
            <p className="text-muted-foreground">
              Select your avenue above and click "Generate Configuration" to create your sorter_config.json file.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold font-mono mb-2">Step 2: Save Configuration</h4>
            <p className="text-muted-foreground">
              Download the generated JSON file or copy it to your clipboard, then save it as{' '}
              <code className="font-mono text-accent">sorter_config.json</code> in your project root directory.
            </p>
          </div>

          <div>
            <h4 className="font-semibold font-mono mb-2">Step 3: Use in Code</h4>
            <p className="text-muted-foreground mb-2">
              Import and use the configuration with sorter_factory.ts:
            </p>
            <pre className="bg-background p-3 rounded-md font-mono text-xs overflow-x-auto border border-border">
{`import { fetchSorters } from './sorter_factory';
import config from './sorter_config.json';

const sorters = fetchSorters(config.avenue);
const allowedFunctions = Object.keys(sorters);
console.log('Available sorters:', allowedFunctions);`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
