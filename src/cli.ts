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
  console.log('2. Analyze codebase for recommendations');
  console.log('3. Exit\n');

  const mainChoice = await question(rl, 'Enter your choice (1-3): ');

  if (mainChoice === '1') {
    await generateConfig(rl);
  } else if (mainChoice === '2') {
    await analyzeCodebase();
  } else if (mainChoice === '3') {
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
