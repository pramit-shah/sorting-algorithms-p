# Pylabs Code Translator - CLI Tool

A comprehensive code translation and analysis tool for sorting algorithms, featuring algorithm translations, configuration generation, and codebase analysis.

## 🚀 Features

- **Algorithm Translations**: Professional C++ and Java implementations of sorting algorithms
- **Configuration Generator**: Interactive tool for creating sorter configurations
- **Codebase Analyzer**: Smart recommendations based on your project dependencies
- **CLI Tool**: Run globally via `npx pylabs-sort`

## 📦 Installation & Usage

### Run via npx (Recommended)

```bash
npx pylabs-sort
```

### Install Globally

```bash
npm install -g pylabs-sort
pylabs-sort
```

### Build the CLI

To build the CLI tool from source:

```bash
npm run build:cli
```

This will:
1. Compile the TypeScript CLI to JavaScript
2. Add the shebang (`#!/usr/bin/env node`) to the output
3. Make the file executable
4. Place the compiled CLI in `./dist/cli.js`

### Test Locally

After building, you can test the CLI locally:

```bash
node dist/cli.js
```

Or link it globally for testing:

```bash
npm link
pylabs-sort
```

## 🛠️ CLI Features

When you run `pylabs-sort`, you'll be presented with three options:

### 1. Generate sorter_config.json

Create a configuration file for your sorting avenue:

- **ai_high_performance**: Optimized for AI workloads and maximum speed
  - Functions: Radix Sort, Quicksort
  - Use cases: ML preprocessing, high-frequency trading, real-time data processing

- **general_production**: Stable, reliable sorting for production environments
  - Functions: Timsort
  - Use cases: Enterprise backends, database sorting, general web services

### 2. Analyze Codebase

Automatically scans your project to recommend the best sorting configuration:

- **AI/Data Science Detection**: Recommends Linear-time Sorts (Radix Sort, Counting Sort)
  - Detects: tensorflow, pytorch, numpy, pandas, scikit-learn
  - Benefit: O(n + k) linear time performance

- **Web Production Detection**: Recommends Hybrid Sorts (Timsort)
  - Detects: express, fastify, koa, next, react
  - Benefit: Stable O(n log n) optimized for real-world data

- **Default**: Recommends Quicksort
  - Benefit: Cache-efficient, in-place O(1) space complexity

## 🎯 Sorter Factory

The `sorter_factory.ts` module provides a curated collection of sorting algorithms organized by use case.

### Usage

```typescript
import { fetchSorters, SorterFactoryAvenue } from './sorter_factory';

const highPerfSorters = fetchSorters('ai_high_performance');

const array = [64, 34, 25, 12, 22, 11, 90];
const steps = highPerfSorters['Radix Sort'](array);
```

### Available Avenues

- **`ai_high_performance`**: Optimized for high-performance scenarios
  - Radix Sort (LSD approach, optimized for integers)
  - Quicksort (Median-of-three pivot, insertion sort optimization)

- **`general_production`**: Production-ready general-purpose sorting
  - Timsort (Natural runs, binary insertion, galloping mode)

### API

**`fetchSorters(avenue: SorterFactoryAvenue)`**

Retrieves the allowed sorting algorithms for a specific use case.

- **Parameters**: `avenue` - One of `'ai_high_performance'` or `'general_production'`
- **Returns**: Object mapping algorithm names to sorting functions
- **Throws**: Error if invalid avenue is provided

## 📝 Package.json Configuration

The project is configured as a CLI tool with the following key settings:

```json
{
  "name": "pylabs-sort",
  "version": "1.0.0",
  "bin": {
    "pylabs-sort": "./dist/cli.js"
  },
  "scripts": {
    "build:cli": "tsc --project tsconfig.cli.json && ...",
    "prepublishOnly": "npm run build:cli"
  }
}
```

### Key Configuration Details

- **bin**: Maps the `pylabs-sort` command to the compiled CLI
- **build:cli**: Compiles TypeScript with Node.js-specific settings
- **prepublishOnly**: Automatically builds the CLI before publishing to npm
- **private: false**: Allows publishing to npm registry

## 🔧 Development

### Project Structure

```
pylabs-sort/
├── src/
│   ├── cli.ts                 # CLI entry point
│   ├── App.tsx                # Web UI
│   └── components/
│       ├── ConfigGenerator.tsx
│       └── CodebaseAnalyzer.tsx
├── dist/
│   └── cli.js                 # Compiled CLI (generated)
├── tsconfig.json              # Main TypeScript config
├── tsconfig.cli.json          # CLI-specific TypeScript config
└── package.json
```

### Build Scripts

- `npm run dev` - Start development server for web UI
- `npm run build` - Build web application
- `npm run build:cli` - Build CLI tool
- `npm run lint` - Lint code

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
