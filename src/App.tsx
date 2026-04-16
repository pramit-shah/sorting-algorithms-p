import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/CodeBlock';
import { translations } from '@/lib/translations';
import { Code, ArrowsLeftRight, CheckCircle } from '@phosphor-icons/react';
import { Toaster } from 'sonner';

function App() {
  const [selectedTranslation, setSelectedTranslation] = useState(translations[0].id);

  const currentTranslation = translations.find(t => t.id === selectedTranslation);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <div className="container mx-auto p-6 space-y-6 max-w-[1800px]">
        <header className="text-center space-y-3 pb-4">
          <div className="flex items-center justify-center gap-3">
            <Code size={40} className="text-accent" weight="duotone" />
            <h1 className="text-4xl font-bold font-mono tracking-tight">
              Pylabs Code Translator
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Professional algorithm translations optimized for C++ STL and Java production environments
          </p>
        </header>

        <Tabs value={selectedTranslation} onValueChange={setSelectedTranslation}>
          <TabsList className="grid w-full grid-cols-2">
            {translations.map((translation) => (
              <TabsTrigger key={translation.id} value={translation.id} className="font-mono">
                {translation.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {translations.map((translation) => (
            <TabsContent key={translation.id} value={translation.id} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-mono">
                    <ArrowsLeftRight className="text-accent" weight="bold" />
                    {translation.name}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {translation.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold font-mono uppercase tracking-wide text-muted-foreground">
                      Optimizations Applied
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {translation.optimizations.map((opt, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle size={16} className="text-accent flex-shrink-0 mt-0.5" weight="fill" />
                          <span className="text-foreground/80">{opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid lg:grid-cols-2 gap-6">
                <CodeBlock
                  code={translation.sourceCode}
                  language={translation.sourceLanguage}
                  title={`Source: ${translation.sourceLanguage.toUpperCase()}`}
                />
                <CodeBlock
                  code={translation.targetCode}
                  language={translation.targetLanguage}
                  title={`Target: ${translation.targetLanguage.toUpperCase()}`}
                />
              </div>

              <Card className="bg-accent/5 border-accent/20">
                <CardHeader>
                  <CardTitle className="text-base font-mono">Implementation Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {translation.id === 'introsort-cpp' ? (
                    <>
                      <div>
                        <h4 className="font-semibold mb-1 font-mono">In-Place Algorithm</h4>
                        <p className="text-muted-foreground">
                          Uses O(log n) space for recursion stack only. All sorting operations modify the original container via iterators without allocating additional arrays.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 font-mono">STL Compatibility</h4>
                        <p className="text-muted-foreground">
                          Follows STL conventions with RandomAccessIterator requirements. Compatible with std::vector, std::array, std::deque, and C-style arrays.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 font-mono">Usage Example</h4>
                        <pre className="bg-background p-3 rounded-md mt-2 font-mono text-xs overflow-x-auto">
{`std::vector<int> vec = {5, 2, 8, 1, 9, 3};
introsort(vec.begin(), vec.end());

// Custom comparator
introsort(vec.begin(), vec.end(), std::greater<int>());`}
                        </pre>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h4 className="font-semibold mb-1 font-mono">Java Arrays.sort() Style</h4>
                        <p className="text-muted-foreground">
                          Mirrors the production implementation used in Java's standard library. Includes run stack management, adaptive galloping, and merge strategies.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 font-mono">Stable Sorting Guarantee</h4>
                        <p className="text-muted-foreground">
                          Maintains relative order of equal elements, crucial for multi-level sorting operations and database-style queries.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 font-mono">Usage Example</h4>
                        <pre className="bg-background p-3 rounded-md mt-2 font-mono text-xs overflow-x-auto">
{`Integer[] arr = {5, 2, 8, 1, 9, 3};
TimSort.sort(arr);

// Custom comparator
TimSort.sort(arr, Comparator.reverseOrder());`}
                        </pre>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="font-mono">About These Translations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              These translations are production-ready implementations based on the TypeScript algorithms from the Pylabs sorting module. 
              Each translation has been carefully optimized to follow the conventions and best practices of the target language.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2 font-mono">C++ Introsort</h4>
                <p>
                  Optimized for the C++ Standard Template Library with iterator-based design, template metaprogramming, 
                  and in-place sorting. Uses std::iter_swap and std::distance for maximum efficiency.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2 font-mono">Java Timsort</h4>
                <p>
                  Enterprise-grade implementation mirroring Java's Arrays.sort() with run stack management, 
                  galloping mode optimization, and adaptive merge strategies for real-world data patterns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
