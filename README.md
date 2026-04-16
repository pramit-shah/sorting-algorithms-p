# ✨ Welcome to Your Spark Template!
You've just launched your brand-new Spark Template Codespace — everything’s fired up and ready for you to explore, build, and create with Spark!

This template is your blank canvas. It comes with a minimal setup to help you get started quickly with Spark development.

🚀 What's Inside?
- A clean, minimal Spark environment
- Pre-configured for local development
- Ready to scale with your ideas
  
🧠 What Can You Do?

Right now, this is just a starting point — the perfect place to begin building and testing your Spark applications.

🧹 Just Exploring?
No problem! If you were just checking things out and don’t need to keep this code:

- Simply delete your Spark.
- Everything will be cleaned up — no traces left behind.

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

📄 License For Spark Template Resources 

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
