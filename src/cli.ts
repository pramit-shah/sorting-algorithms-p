#!/usr/bin/env node

import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

interface SorterConfig {
  avenue: 'ai_high_performance' | 'general_production';
  allowedFunctions: string[];
  timestamp: string;
  description: string;
}

interface LanguageDetection {
  language: string;
  count: number;
  percentage: number;
}

interface DataStructureDetection {
  type: string;
  confidence: number;
  foundIn: string[];
  keywords: string[];
}

interface AnalysisResult {
  primaryLanguage: string;
  languageBreakdown: LanguageDetection[];
  dataStructures: DataStructureDetection[];
  recommendedSort: string;
  recommendedKit: string;
  idePrompt: string;
  codeSnippet?: string;
}

const avenueDetails = {
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

const LANGUAGE_EXTENSIONS: Record<string, string[]> = {
  'C++': ['.cpp', '.cc', '.cxx', '.hpp', '.h', '.hh', '.hxx'],
  'Java': ['.java'],
  'Python': ['.py'],
  'TypeScript': ['.ts', '.tsx'],
  'JavaScript': ['.js', '.jsx'],
  'C': ['.c', '.h'],
  'C#': ['.cs'],
  'Kotlin': ['.kt', '.kts'],
  'Swift': ['.swift'],
  'Go': ['.go'],
  'Rust': ['.rs'],
};

const DATA_STRUCTURE_PATTERNS = {
  binarySearchTree: {
    keywords: ['BST', 'BinarySearchTree', 'TreeNode', 'binary search tree', 'left child', 'right child', 'tree traversal', 'inorder', 'preorder', 'postorder'],
    classification: 'AI/Machine Learning (Decision Trees)',
    recommendedKit: 'Linear-time Sorts Kit (Radix/Counting Sort)',
  },
  trie: {
    keywords: ['Trie', 'TrieNode', 'prefix tree', 'autocomplete', 'dictionary', 'prefix search'],
    classification: 'AI/Machine Learning (Autocomplete/NLP)',
    recommendedKit: 'Linear-time Sorts Kit (Radix/Counting Sort)',
  },
  adjacencyMatrix: {
    keywords: ['adjacency matrix', 'adjacencyMatrix', 'AdjacencyMatrix', 'graph matrix', 'matrix[i][j]'],
    classification: 'Graph (Mapping/Navigation/Routing)',
    recommendedKit: 'BFS/DFS Paradigms',
  },
  adjacencyList: {
    keywords: ['adjacency list', 'adjacencyList', 'AdjacencyList', 'graph list', 'neighbors', 'edges', 'vertices', 'Graph'],
    classification: 'Graph (Mapping/Navigation/Routing)',
    recommendedKit: 'BFS/DFS Paradigms',
  },
  directedGraph: {
    keywords: ['DAG', 'directed acyclic graph', 'topological', 'dependency graph', 'task scheduler', 'build system', 'package manager'],
    classification: 'Directed Graph (Dependency Resolution)',
    recommendedKit: 'Topological Sort (Specialized Sorts)',
  },
  concurrentProcessing: {
    keywords: ['Worker', 'WebWorker', 'parallel', 'thread', 'multithread', 'concurrent', 'Promise.all', 'async/await'],
    classification: 'Concurrent/Parallel Processing',
    recommendedKit: 'Concurrent Sorts Kit (Bitonic/Batcher/Samplesort)',
  },
  stringProcessing: {
    keywords: ['string sort', 'lexicographic', 'alphabetical', 'String.sort', 'localeCompare', 'text processing'],
    classification: 'String Sorting',
    recommendedKit: 'Radix Sort MSD (Distribution Sorts)',
  },
  standardCollections: {
    keywords: ['Array', 'List', 'HashMap', 'HashTable', 'Dictionary', 'vector', 'ArrayList', 'LinkedList', 'cache', 'database', 'index'],
    classification: 'Standard Collections (Database/Cache)',
    recommendedKit: 'Hybrid Sorts Kit (Timsort/Introsort)',
  },
};

function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function question(rl: readline.Interface, query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

function detectLanguageFromExtensions(directory: string): LanguageDetection[] {
  const languageCounts: Record<string, number> = {};
  let totalFiles = 0;

  function scanDirectory(dir: string, depth = 0): void {
    if (depth > 5) return;

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          if (!entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== 'build') {
            scanDirectory(fullPath, depth + 1);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          for (const [lang, extensions] of Object.entries(LANGUAGE_EXTENSIONS)) {
            if (extensions.includes(ext)) {
              languageCounts[lang] = (languageCounts[lang] || 0) + 1;
              totalFiles++;
              break;
            }
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }

  scanDirectory(directory);

  return Object.entries(languageCounts)
    .map(([language, count]) => ({
      language,
      count,
      percentage: Math.round((count / totalFiles) * 100)
    }))
    .sort((a, b) => b.count - a.count);
}

function scanFileContent(filePath: string): { patterns: string[], content: string } {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const patterns: string[] = [];

    for (const [structureType, config] of Object.entries(DATA_STRUCTURE_PATTERNS)) {
      for (const keyword of config.keywords) {
        if (content.toLowerCase().includes(keyword.toLowerCase())) {
          if (!patterns.includes(structureType)) {
            patterns.push(structureType);
          }
        }
      }
    }

    return { patterns, content };
  } catch (error) {
    return { patterns: [], content: '' };
  }
}

function detectDataStructures(directory: string): DataStructureDetection[] {
  const structureMatches: Record<string, { files: Set<string>, keywords: Set<string> }> = {};

  function scanDirectory(dir: string, depth = 0): void {
    if (depth > 5) return;

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          if (!entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== 'build') {
            scanDirectory(fullPath, depth + 1);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          const validExtensions = Object.values(LANGUAGE_EXTENSIONS).flat();
          
          if (validExtensions.includes(ext)) {
            const { patterns } = scanFileContent(fullPath);
            
            for (const pattern of patterns) {
              if (!structureMatches[pattern]) {
                structureMatches[pattern] = { files: new Set(), keywords: new Set() };
              }
              structureMatches[pattern].files.add(path.relative(directory, fullPath));
              
              const config = DATA_STRUCTURE_PATTERNS[pattern as keyof typeof DATA_STRUCTURE_PATTERNS];
              config.keywords.forEach(kw => structureMatches[pattern].keywords.add(kw));
            }
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }

  scanDirectory(directory);

  return Object.entries(structureMatches).map(([type, data]) => ({
    type,
    confidence: Math.min(100, data.files.size * 20),
    foundIn: Array.from(data.files).slice(0, 5),
    keywords: Array.from(data.keywords).slice(0, 8)
  }));
}

function generateCodeSnippet(language: string, sortType: string): string {
  const snippets: Record<string, Record<string, string>> = {
    'C++': {
      'Introsort': `#include <vector>
#include <algorithm>
#include <iterator>

template<typename RandomAccessIterator>
void introsort(RandomAccessIterator first, RandomAccessIterator last) {
    using value_type = typename std::iterator_traits<RandomAccessIterator>::value_type;
    const auto size = std::distance(first, last);
    const auto depth_limit = 2 * static_cast<int>(std::log2(size));
    
    introsort_impl(first, last, depth_limit);
}

// Usage:
std::vector<int> data = {5, 2, 8, 1, 9};
introsort(data.begin(), data.end());`,
      'BFS': `#include <queue>
#include <vector>
#include <unordered_set>

void bfs(const std::vector<std::vector<int>>& graph, int start) {
    std::queue<int> q;
    std::unordered_set<int> visited;
    
    q.push(start);
    visited.insert(start);
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        
        for (int neighbor : graph[node]) {
            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
}`
    },
    'Java': {
      'Timsort': `import java.util.Arrays;

public class SortingExample {
    public static void main(String[] args) {
        Integer[] data = {5, 2, 8, 1, 9};
        
        // Java's Arrays.sort() uses Timsort for objects
        Arrays.sort(data);
        
        // Custom comparator
        Arrays.sort(data, (a, b) -> b - a);
    }
}`,
      'BFS': `import java.util.*;

public class GraphTraversal {
    public void bfs(List<List<Integer>> graph, int start) {
        Queue<Integer> queue = new LinkedList<>();
        Set<Integer> visited = new HashSet<>();
        
        queue.offer(start);
        visited.add(start);
        
        while (!queue.isEmpty()) {
            int node = queue.poll();
            
            for (int neighbor : graph.get(node)) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.offer(neighbor);
                }
            }
        }
    }
}`
    },
    'Python': {
      'Timsort': `# Python's built-in sort uses Timsort
data = [5, 2, 8, 1, 9]

# In-place sort
data.sort()

# Return new sorted list
sorted_data = sorted(data)

# Custom key function
data.sort(key=lambda x: -x)`,
      'Radix Sort': `def radix_sort(arr):
    max_val = max(arr)
    exp = 1
    
    while max_val // exp > 0:
        counting_sort_by_digit(arr, exp)
        exp *= 10
    
    return arr

# Usage for ML preprocessing
features = [64, 34, 25, 12, 22, 11, 90]
sorted_features = radix_sort(features)`
    },
    'TypeScript': {
      'Timsort': `function timsort<T>(arr: T[], compare?: (a: T, b: T) => number): T[] {
    // Implementation using insertion sort + merge
    const minRun = 32;
    
    for (let i = 0; i < arr.length; i += minRun) {
        insertionSort(arr, i, Math.min(i + minRun, arr.length), compare);
    }
    
    return arr;
}

// Usage
const data = [5, 2, 8, 1, 9];
timsort(data);`,
      'BFS': `function bfs(graph: number[][], start: number): void {
    const queue: number[] = [start];
    const visited = new Set<number>([start]);
    
    while (queue.length > 0) {
        const node = queue.shift()!;
        
        for (const neighbor of graph[node]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
}`
    }
  };

  return snippets[language]?.[sortType] || `// ${sortType} implementation for ${language}`;
}

async function analyzeCodebaseEnhanced(): Promise<AnalysisResult | null> {
  console.log('\n🔍 Analyzing Codebase...\n');
  console.log('⏳ Scanning file extensions...');

  const cwd = process.cwd();

  try {
    const languageBreakdown = detectLanguageFromExtensions(cwd);
    
    if (languageBreakdown.length === 0) {
      console.log('❌ No source code files detected in this directory.');
      return null;
    }

    const primaryLanguage = languageBreakdown[0].language;
    
    console.log('⏳ Analyzing file contents for data structures...');
    const dataStructures = detectDataStructures(cwd);

    let recommendedSort = '';
    let recommendedKit = '';
    let idePrompt = '';
    let codeSnippet = '';

    if (dataStructures.some(ds => ds.type === 'binarySearchTree' || ds.type === 'trie')) {
      const dsType = dataStructures.find(ds => ds.type === 'binarySearchTree' || ds.type === 'trie')!;
      const config = DATA_STRUCTURE_PATTERNS[dsType.type as keyof typeof DATA_STRUCTURE_PATTERNS];
      
      recommendedKit = config.recommendedKit;
      recommendedSort = 'Radix Sort / Counting Sort';
      
      idePrompt = `Detected a ${primaryLanguage} project with ${config.classification}. Would you like to inject the ${recommendedSort} optimized for ${primaryLanguage}?`;
      codeSnippet = generateCodeSnippet(primaryLanguage, 'Radix Sort');
      
    } else if (dataStructures.some(ds => ds.type === 'adjacencyMatrix' || ds.type === 'adjacencyList')) {
      const dsType = dataStructures.find(ds => ds.type === 'adjacencyMatrix' || ds.type === 'adjacencyList')!;
      const config = DATA_STRUCTURE_PATTERNS[dsType.type as keyof typeof DATA_STRUCTURE_PATTERNS];
      
      recommendedKit = config.recommendedKit;
      recommendedSort = 'BFS/DFS';
      
      const structType = dsType.type === 'adjacencyMatrix' ? 'Adjacency Matrix' : 'Adjacency List';
      idePrompt = `Detected a ${primaryLanguage} routing algorithm utilizing ${structType}. Would you like to inject the BFS/DFS paradigm optimized for ${primaryLanguage}?`;
      codeSnippet = generateCodeSnippet(primaryLanguage, 'BFS');
      
    } else if (dataStructures.some(ds => ds.type === 'standardCollections')) {
      const config = DATA_STRUCTURE_PATTERNS.standardCollections;
      recommendedKit = config.recommendedKit;
      
      if (primaryLanguage === 'C++') {
        recommendedSort = 'Introsort';
        idePrompt = `Detected a ${primaryLanguage} project with standard collections. Would you like to inject the Introsort O(n log n) algorithm optimized for C++ STL?`;
        codeSnippet = generateCodeSnippet('C++', 'Introsort');
      } else if (primaryLanguage === 'Java') {
        recommendedSort = 'Timsort';
        idePrompt = `Detected a ${primaryLanguage} project with standard collections. Would you like to inject the Timsort algorithm matching Java's Arrays.sort()?`;
        codeSnippet = generateCodeSnippet('Java', 'Timsort');
      } else if (primaryLanguage === 'Python') {
        recommendedSort = 'Timsort (Built-in)';
        idePrompt = `Detected a ${primaryLanguage} project with standard collections. Python's built-in sort() uses Timsort. Would you like to see usage examples?`;
        codeSnippet = generateCodeSnippet('Python', 'Timsort');
      } else if (primaryLanguage === 'TypeScript' || primaryLanguage === 'JavaScript') {
        recommendedSort = 'Timsort (Custom Implementation)';
        idePrompt = `Detected a ${primaryLanguage} project with standard collections. Would you like to inject a custom Timsort implementation using sorter_factory.ts logic?`;
        codeSnippet = generateCodeSnippet('TypeScript', 'Timsort');
      } else {
        recommendedSort = 'Hybrid Sort';
        idePrompt = `Detected a ${primaryLanguage} project with standard collections. Would you like to inject an optimized hybrid sorting algorithm?`;
      }
    } else {
      if (primaryLanguage === 'C++') {
        recommendedSort = 'Introsort';
        recommendedKit = 'C++ STL Native Sort';
        idePrompt = `Detected a ${primaryLanguage} project. Would you like to inject the Introsort algorithm (C++ STL sort() backbone)?`;
        codeSnippet = generateCodeSnippet('C++', 'Introsort');
      } else if (primaryLanguage === 'Java') {
        recommendedSort = 'Timsort';
        recommendedKit = 'Java Arrays.sort()';
        idePrompt = `Detected a ${primaryLanguage} project. Would you like to inject the Timsort algorithm (Java's Arrays.sort())?`;
        codeSnippet = generateCodeSnippet('Java', 'Timsort');
      } else if (primaryLanguage === 'Python') {
        recommendedSort = 'Timsort';
        recommendedKit = 'Python Built-in';
        idePrompt = `Detected a ${primaryLanguage} project. Python uses Timsort in its built-in sorted(). Would you like to see integration examples?`;
        codeSnippet = generateCodeSnippet('Python', 'Timsort');
      } else {
        recommendedSort = 'Timsort';
        recommendedKit = 'sorter_factory.ts';
        idePrompt = `Detected a ${primaryLanguage} project. Would you like to inject the Timsort algorithm using sorter_factory.ts logic?`;
        codeSnippet = generateCodeSnippet('TypeScript', 'Timsort');
      }
    }

    return {
      primaryLanguage,
      languageBreakdown,
      dataStructures,
      recommendedSort,
      recommendedKit,
      idePrompt,
      codeSnippet
    };

  } catch (error) {
    console.error('❌ Error analyzing codebase:', error);
    return null;
  }
}

async function displayAnalysisResults(result: AnalysisResult, rl: readline.Interface): Promise<void> {
  console.log('\n╭─────────────────────────────────────────────────────────╮');
  console.log('│              ENHANCED ANALYSIS RESULTS                  │');
  console.log('╰─────────────────────────────────────────────────────────╯\n');

  console.log('📁 Language Distribution:\n');
  result.languageBreakdown.forEach((lang, idx) => {
    const bar = '█'.repeat(Math.floor(lang.percentage / 2));
    console.log(`   ${idx + 1}. ${lang.language.padEnd(15)} ${lang.percentage}% ${bar} (${lang.count} files)`);
  });

  console.log(`\n🎯 Primary Language: ${result.primaryLanguage}`);

  if (result.dataStructures.length > 0) {
    console.log('\n🔍 Detected Data Structures:\n');
    result.dataStructures.forEach((ds, idx) => {
      const config = DATA_STRUCTURE_PATTERNS[ds.type as keyof typeof DATA_STRUCTURE_PATTERNS];
      console.log(`   ${idx + 1}. ${config.classification}`);
      console.log(`      Confidence: ${ds.confidence}%`);
      console.log(`      Found in: ${ds.foundIn.slice(0, 3).join(', ')}${ds.foundIn.length > 3 ? '...' : ''}`);
      console.log(`      Keywords: ${ds.keywords.slice(0, 5).join(', ')}\n`);
    });
  }

  console.log('─────────────────────────────────────────────────────────\n');
  console.log('💡 IDE INTEGRATION PROMPT:\n');
  console.log(`   ${result.idePrompt}\n`);
  console.log('─────────────────────────────────────────────────────────\n');
  console.log(`📊 Recommended: ${result.recommendedSort}`);
  console.log(`📦 Kit: ${result.recommendedKit}\n`);

  const inject = await question(rl, 'Would you like to inject this code? (yes/no): ');

  if (inject.toLowerCase() === 'yes' || inject.toLowerCase() === 'y') {
    console.log('\n✅ CODE INJECTION:\n');
    console.log('─────────────────────────────────────────────────────────');
    console.log(result.codeSnippet);
    console.log('─────────────────────────────────────────────────────────\n');
    
    const filename = await question(rl, 'Enter filename to save (or press Enter to skip): ');
    
    if (filename && filename.trim()) {
      const filepath = path.join(process.cwd(), filename.trim());
      fs.writeFileSync(filepath, result.codeSnippet);
      console.log(`\n✅ Code saved to: ${filepath}\n`);
    } else {
      console.log('\n📋 Code copied to output above. You can manually integrate it into your IDE.\n');
    }
  } else {
    console.log('\n👍 Skipped code injection.\n');
  }
}

async function analyzeCodebase(): Promise<void> {
  console.log('\n🔍 Analyzing Codebase...\n');

  const cwd = process.cwd();
  let recommendation = '';
  let reason = '';

  try {
    const packageJsonPath = path.join(cwd, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

      if (
        dependencies['tensorflow'] ||
        dependencies['@tensorflow/tfjs'] ||
        dependencies['pytorch'] ||
        dependencies['numpy'] ||
        dependencies['pandas'] ||
        dependencies['scikit-learn']
      ) {
        recommendation = '🚀 Linear-time Sorts Kit (Radix Sort + Counting Sort)';
        reason = `Detected AI/data science dependencies. Linear-time sorts offer O(n + k) performance, bypassing comparison limits. Ideal for heavy integer/string processing in ML pipelines.`;
      } else if (
        dependencies['express'] ||
        dependencies['fastify'] ||
        dependencies['koa'] ||
        dependencies['next'] ||
        dependencies['react']
      ) {
        recommendation = '🏆 Hybrid Sorts Kit (Timsort)';
        reason = `Detected web production framework. Timsort is optimized for real-world data patterns with stable O(n log n) performance, matching Java's Arrays.sort() and Python's sorted().`;
      } else {
        recommendation = '⚡ Quicksort (ai_high_performance)';
        reason = `Default recommendation for general use. Quicksort provides cache-efficient, in-place O(1) space complexity with excellent performance on random data.`;
      }
    } else {
      recommendation = '⚡ Quicksort (ai_high_performance)';
      reason = `No package.json detected. Quicksort is a solid default choice for memory-constrained environments with its in-place O(1) space complexity.`;
    }

    console.log('╭─────────────────────────────────────────────────────────╮');
    console.log('│                  ANALYSIS RESULTS                       │');
    console.log('╰─────────────────────────────────────────────────────────╯\n');
    console.log(`📊 Recommendation: ${recommendation}\n`);
    console.log(`💡 Reason:\n${reason}\n`);
    console.log('─────────────────────────────────────────────────────────\n');

  } catch (error) {
    console.error('❌ Error analyzing codebase:', error);
  }
}

async function generateConfig(rl: readline.Interface): Promise<void> {
  console.log('\n╭─────────────────────────────────────────────────────────╮');
  console.log('│         PYLABS SORTER CONFIGURATION GENERATOR          │');
  console.log('╰─────────────────────────────────────────────────────────╯\n');

  console.log('Available Avenues:\n');
  console.log('1. ai_high_performance');
  console.log('   → Optimized for AI workloads and maximum speed');
  console.log('   → Functions: Radix Sort, Quicksort\n');
  
  console.log('2. general_production');
  console.log('   → Stable, reliable sorting for production environments');
  console.log('   → Functions: Timsort\n');

  const choice = await question(rl, 'Select avenue (1 or 2): ');

  let selectedAvenue: 'ai_high_performance' | 'general_production';

  if (choice === '1') {
    selectedAvenue = 'ai_high_performance';
  } else if (choice === '2') {
    selectedAvenue = 'general_production';
  } else {
    console.log('❌ Invalid choice. Please run the command again.');
    return;
  }

  const config: SorterConfig = {
    avenue: selectedAvenue,
    allowedFunctions: avenueDetails[selectedAvenue].functions,
    timestamp: new Date().toISOString(),
    description: avenueDetails[selectedAvenue].description,
  };

  const configPath = path.join(process.cwd(), 'sorter_config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  console.log('\n✅ Configuration saved to sorter_config.json\n');
  console.log('─────────────────────────────────────────────────────────');
  console.log(JSON.stringify(config, null, 2));
  console.log('─────────────────────────────────────────────────────────\n');
}

async function main() {
  const rl = createInterface();

  console.log('\n╔═════════════════════════════════════════════════════════╗');
  console.log('║              PYLABS SORTING MODULE CLI                  ║');
  console.log('╚═════════════════════════════════════════════════════════╝\n');

  console.log('What would you like to do?\n');
  console.log('1. Generate sorter_config.json');
  console.log('2. Analyze codebase (basic - dependencies only)');
  console.log('3. Enhanced analysis (language + data structures + IDE integration)');
  console.log('4. Exit\n');

  const mainChoice = await question(rl, 'Enter your choice (1-4): ');

  if (mainChoice === '1') {
    await generateConfig(rl);
  } else if (mainChoice === '2') {
    await analyzeCodebase();
  } else if (mainChoice === '3') {
    const result = await analyzeCodebaseEnhanced();
    if (result) {
      await displayAnalysisResults(result, rl);
    }
  } else if (mainChoice === '4') {
    console.log('👋 Goodbye!\n');
  } else {
    console.log('❌ Invalid choice.\n');
  }

  rl.close();
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
