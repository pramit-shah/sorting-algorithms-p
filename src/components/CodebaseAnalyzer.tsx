import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MagnifyingGlass, CheckCircle, Warning, Info, Sparkle, FileCode, Database, TreeStructure, GitBranch } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface LanguageDetection {
  language: string;
  count: number;
  percentage: number;
}

interface DataStructureDetection {
  type: string;
  classification: string;
  confidence: number;
  foundIn: string[];
  keywords: string[];
}

interface AnalysisResult {
  recommendation: 'quicksort' | 'hybrid_sorts' | 'linear_time_sorts' | 'bfs_dfs' | 'introsort' | 'timsort';
  confidence: 'high' | 'medium' | 'low';
  detectedPatterns: string[];
  reasoning: string[];
  suggestedAvenue: 'ai_high_performance' | 'general_production';
  primaryLanguage?: string;
  languageBreakdown?: LanguageDetection[];
  dataStructures?: DataStructureDetection[];
  idePrompt?: string;
}

interface RecommendationDetails {
  name: string;
  description: string;
  benefits: string[];
  avenue: 'ai_high_performance' | 'general_production';
}

const recommendations: Record<string, RecommendationDetails> = {
  quicksort: {
    name: 'Quicksort',
    description: 'Cache-efficient in-place sorting with O(1) space complexity',
    benefits: [
      'In-place algorithm with O(1) space complexity',
      'Excellent cache performance for large datasets',
      'Optimal for memory-constrained environments',
      'Fast average-case O(n log n) performance',
    ],
    avenue: 'ai_high_performance',
  },
  hybrid_sorts: {
    name: 'Hybrid Sorts Kit (Timsort)',
    description: 'Stable O(n log n) performance optimized for real-world data',
    benefits: [
      'Optimized for real-world data patterns',
      'Stable sorting preserves element order',
      'Adaptive algorithm performs well on partially sorted data',
      'Production-proven in Python and Java standard libraries',
    ],
    avenue: 'general_production',
  },
  linear_time_sorts: {
    name: 'Linear-time Sorts Kit (Radix Sort, Counting Sort)',
    description: 'O(n + k) linear time performance bypassing comparison limits',
    benefits: [
      'O(n + k) linear time complexity',
      'Bypasses comparison-based sorting lower bound',
      'Ideal for integer and string processing',
      'Exceptional performance for AI and data science workloads',
    ],
    avenue: 'ai_high_performance',
  },
  bfs_dfs: {
    name: 'BFS/DFS Paradigms',
    description: 'Graph traversal algorithms for routing and navigation',
    benefits: [
      'Optimal for graph-based data structures',
      'Essential for routing and navigation algorithms',
      'Breadth-first search for shortest paths',
      'Depth-first search for topological sorting',
    ],
    avenue: 'ai_high_performance',
  },
  introsort: {
    name: 'Introsort (C++ STL)',
    description: 'Hybrid algorithm combining quicksort, heapsort, and insertion sort',
    benefits: [
      'Native backbone for C++ std::sort()',
      'O(n log n) worst-case guarantee',
      'In-place with minimal overhead',
      'Optimized for STL iterators',
    ],
    avenue: 'ai_high_performance',
  },
  timsort: {
    name: 'Timsort',
    description: 'Adaptive stable sort used in Python and Java',
    benefits: [
      'Native to Python sorted() and Java Arrays.sort()',
      'Stable sorting guarantee',
      'Excellent on partially sorted data',
      'Industry-proven algorithm',
    ],
    avenue: 'general_production',
  },
};

export function CodebaseAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeCodebase = async () => {
    setIsAnalyzing(true);
    toast.info('Analyzing codebase...');

    try {
      const packageJson = await fetch('/package.json').then(res => res.json());
      
      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      const detectedPatterns: string[] = [];
      const reasoning: string[] = [];
      let recommendation: AnalysisResult['recommendation'] = 'hybrid_sorts';
      let confidence: AnalysisResult['confidence'] = 'medium';

      const aiDataSciencePackages = [
        'tensorflow', '@tensorflow/tfjs', 'brain.js', 'ml.js', 'synaptic',
        'natural', 'compromise', 'wink-nlp', 'sentiment',
        'd3', 'chart.js', 'recharts', 'victory', 'nivo',
        'mathjs', 'numeric', 'ndarray', 'ml-matrix',
      ];

      const memoryConstrainedIndicators = [
        'node-cache', 'lru-cache', 'redis', 'memcached',
        'ioredis', 'memory-cache', 'cache-manager',
      ];

      const webProductionIndicators = [
        'express', 'next', 'react', 'vue', 'angular',
        'fastify', 'koa', 'hapi', 'nestjs',
        'mongodb', 'mongoose', 'prisma', 'typeorm', 'sequelize',
      ];

      const hasAIDataScience = aiDataSciencePackages.some(pkg => 
        dependencies[pkg] || Object.keys(dependencies).some(dep => dep.includes(pkg))
      );

      const hasMemoryConstraints = memoryConstrainedIndicators.some(pkg => dependencies[pkg]);

      const hasWebProduction = webProductionIndicators.some(pkg => dependencies[pkg]);

      const hasStringProcessing = Object.keys(dependencies).some(pkg => 
        pkg.includes('string') || pkg.includes('text') || pkg.includes('natural') || pkg.includes('nlp')
      );

      const hasNumericProcessing = Object.keys(dependencies).some(pkg => 
        pkg.includes('math') || pkg.includes('numeric') || pkg.includes('matrix') || pkg.includes('tensor')
      );

      if (hasAIDataScience || hasStringProcessing || hasNumericProcessing) {
        detectedPatterns.push('AI/Data Science Libraries');
        reasoning.push('Detected machine learning, NLP, or data processing libraries');
        
        if (hasNumericProcessing) {
          detectedPatterns.push('Heavy Integer Processing');
          reasoning.push('Found numeric computation libraries optimized for large integer arrays');
        }
        
        if (hasStringProcessing) {
          detectedPatterns.push('String Processing');
          reasoning.push('Identified text processing libraries requiring efficient string sorting');
        }
        
        recommendation = 'linear_time_sorts';
        confidence = 'high';
        reasoning.push('Linear-time sorts (Radix, Counting) provide O(n + k) performance, bypassing comparison limits');
      } else if (hasMemoryConstraints) {
        detectedPatterns.push('Memory-Constrained Environment');
        reasoning.push('Detected caching libraries indicating memory optimization concerns');
        recommendation = 'quicksort';
        confidence = 'high';
        reasoning.push('Quicksort offers in-place sorting with O(1) space complexity and excellent cache efficiency');
      } else if (hasWebProduction) {
        detectedPatterns.push('Web Production Environment');
        reasoning.push('Identified web frameworks and databases typical of production systems');
        recommendation = 'hybrid_sorts';
        confidence = 'high';
        reasoning.push('Timsort provides stable O(n log n) performance optimized for real-world data patterns');
      } else {
        detectedPatterns.push('General Purpose Application');
        reasoning.push('No specific performance patterns detected');
        recommendation = 'hybrid_sorts';
        confidence = 'medium';
        reasoning.push('Timsort recommended as a safe default for general production use');
      }

      const analysisResult: AnalysisResult = {
        recommendation,
        confidence,
        detectedPatterns,
        reasoning,
        suggestedAvenue: recommendations[recommendation].avenue,
      };

      setResult(analysisResult);
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error('Failed to analyze codebase. Using default recommendation.');
      
      const fallbackResult: AnalysisResult = {
        recommendation: 'hybrid_sorts',
        confidence: 'low',
        detectedPatterns: ['Unable to analyze dependencies'],
        reasoning: ['Using general production settings as default'],
        suggestedAvenue: 'general_production',
      };
      
      setResult(fallbackResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-success';
      case 'medium': return 'text-comparing';
      case 'low': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'high': return <CheckCircle weight="fill" />;
      case 'medium': return <Info weight="fill" />;
      case 'low': return <Warning weight="fill" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-accent/30 bg-accent/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Sparkle size={32} className="text-accent" weight="duotone" />
            <div>
              <CardTitle className="font-mono text-2xl">Analyze Codebase</CardTitle>
              <CardDescription className="text-base mt-1">
                Intelligent recommendation engine that scans your dependencies and suggests optimal sorting settings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click below to analyze your <code className="font-mono text-accent">package.json</code> dependencies 
            and receive a personalized sorting algorithm recommendation based on your project's characteristics.
          </p>
          
          <Button
            onClick={analyzeCodebase}
            disabled={isAnalyzing}
            size="lg"
            className="font-mono"
          >
            <MagnifyingGlass size={20} weight="bold" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Codebase'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card className="bg-card border-2 border-accent shadow-lg shadow-accent/20">
            <CardHeader>
              <CardTitle className="font-mono flex items-center gap-2">
                <CheckCircle size={24} className="text-accent" weight="fill" />
                Recommendation: {recommendations[result.recommendation].name}
              </CardTitle>
              <CardDescription className="text-base">
                {recommendations[result.recommendation].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold font-mono uppercase tracking-wide text-muted-foreground">
                  Confidence:
                </span>
                <Badge 
                  variant="outline" 
                  className={`font-mono flex items-center gap-1.5 ${getConfidenceColor(result.confidence)}`}
                >
                  {getConfidenceIcon(result.confidence)}
                  {result.confidence.toUpperCase()}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-semibold font-mono uppercase tracking-wide text-muted-foreground">
                  Detected Patterns
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.detectedPatterns.map((pattern, idx) => (
                    <Badge key={idx} variant="secondary" className="font-mono">
                      {pattern}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold font-mono uppercase tracking-wide text-muted-foreground">
                  Key Benefits
                </h4>
                <div className="space-y-2">
                  {recommendations[result.recommendation].benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle size={16} className="text-accent flex-shrink-0 mt-0.5" weight="fill" />
                      <span className="text-foreground/80">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-semibold font-mono uppercase tracking-wide text-muted-foreground">
                  Analysis Reasoning
                </h4>
                <div className="space-y-2">
                  {result.reasoning.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-accent mt-0.5">•</span>
                      <span className="text-foreground/70">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                <p className="text-sm font-semibold font-mono mb-2">
                  Suggested Avenue: <code className="text-accent">{result.suggestedAvenue}</code>
                </p>
                <p className="text-sm text-muted-foreground">
                  Use this avenue when generating your sorter configuration to access the recommended algorithms.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="font-mono text-lg">Terminal Output</CardTitle>
              <CardDescription>
                CLI-style analysis results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-background p-4 rounded-lg font-mono text-sm border border-border overflow-x-auto">
{`$ pylabs analyze-codebase

🔍 Scanning project dependencies...
📦 Found ${result.detectedPatterns.length} pattern(s)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ANALYSIS RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Detected Patterns:
${result.detectedPatterns.map(p => `  • ${p}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ RECOMMENDATION: ${recommendations[result.recommendation].name}

${recommendations[result.recommendation].description}

Key Benefits:
${recommendations[result.recommendation].benefits.map((b, i) => `  ${i + 1}. ${b}`).join('\n')}

Reasoning:
${result.reasoning.map(r => `  • ${r}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Next Steps:
  1. Use avenue: ${result.suggestedAvenue}
  2. Generate configuration with recommended settings
  3. Integrate sorter_factory.ts in your project

Confidence: ${result.confidence.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`}
              </pre>
            </CardContent>
          </Card>
        </>
      )}

      <Card className="bg-gradient-to-br from-accent/10 to-primary/5 border-accent/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileCode size={32} className="text-accent" weight="duotone" />
            <div>
              <CardTitle className="font-mono text-2xl">Enhanced CLI Analyzer</CardTitle>
              <CardDescription className="text-base mt-1">
                Advanced language detection, data structure scanning, and IDE integration
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-background/50 border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <FileCode className="text-accent" size={24} weight="duotone" />
                <h3 className="font-mono font-semibold">Language Detection</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Scans file extensions to detect the primary programming language of your codebase
              </p>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-accent">•</span>
                  <span>C++ → Introsort (STL native)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent">•</span>
                  <span>Java/Android → Timsort</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent">•</span>
                  <span>Python → Built-in Timsort</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent">•</span>
                  <span>TypeScript/JavaScript → sorter_factory.ts</span>
                </div>
              </div>
            </div>

            <div className="bg-background/50 border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <TreeStructure className="text-accent" size={24} weight="duotone" />
                <h3 className="font-mono font-semibold">Data Structure Scanning</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Reads source file contents to detect implemented data structures
              </p>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-accent">•</span>
                  <span>BST/Trie → Linear-time Sorts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent">•</span>
                  <span>Graphs → BFS/DFS Paradigms</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent">•</span>
                  <span>Arrays/Lists → Hybrid Sorts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background border border-accent/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <GitBranch className="text-accent" size={24} weight="duotone" />
              <h3 className="font-mono font-semibold">IDE Integration Example</h3>
            </div>
            <div className="bg-muted/50 rounded-md p-3 space-y-2">
              <p className="text-sm font-mono text-accent">
                💡 IDE PROMPT:
              </p>
              <p className="text-sm">
                "Detected a <span className="text-accent font-semibold">C++</span> routing algorithm utilizing <span className="text-accent font-semibold">Adjacency Lists</span>. 
                Would you like to inject the <span className="text-accent font-semibold">Introsort O(n log n)</span> algorithm optimized for C++ STL?"
              </p>
              <div className="flex gap-2 mt-3">
                <Badge className="bg-success text-success-foreground hover:bg-success/90">Accept</Badge>
                <Badge variant="outline">Decline</Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="text-sm font-semibold font-mono uppercase tracking-wide text-muted-foreground flex items-center gap-2">
              <Database size={18} className="text-accent" />
              Feature Highlights
            </h4>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle size={16} className="text-accent flex-shrink-0 mt-0.5" weight="fill" />
                <span>Contextual code scanner reads source file contents</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle size={16} className="text-accent flex-shrink-0 mt-0.5" weight="fill" />
                <span>Automated IDE prompts for code injection</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle size={16} className="text-accent flex-shrink-0 mt-0.5" weight="fill" />
                <span>Language-specific algorithm recommendations</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle size={16} className="text-accent flex-shrink-0 mt-0.5" weight="fill" />
                <span>Data structure pattern matching</span>
              </div>
            </div>
          </div>

          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
            <p className="text-sm font-semibold font-mono mb-2">
              🚀 CLI Command
            </p>
            <code className="text-sm bg-background px-3 py-1.5 rounded border border-border block font-mono">
              $ npx pylabs-sort analyze --enhanced
            </code>
            <p className="text-xs text-muted-foreground mt-2">
              Run the enhanced analyzer with language detection and data structure scanning
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
