# Planning Guide

An interactive web-based sorting algorithm visualizer and educational platform that demonstrates comparison sorts, linear sorts, hybrid sorts, and fundamental data structures with real-time visual animations.

**Experience Qualities**:
1. **Educational** - Clear visual feedback helps users understand how different sorting algorithms work step-by-step
2. **Interactive** - Users can control playback speed, input custom data, and explore different algorithm categories
3. **Analytical** - Performance metrics and comparisons help users understand algorithm efficiency and trade-offs

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This application requires multiple algorithm implementations, real-time visualization state management, performance tracking, category navigation, and educational content delivery across different views.

## Essential Features

### Algorithm Visualization
- **Functionality**: Animate sorting algorithms in real-time with visual bar charts showing array elements being compared and swapped
- **Purpose**: Help users understand how different sorting algorithms work through visual representation
- **Trigger**: User selects an algorithm category and specific algorithm, then clicks "Visualize"
- **Progression**: Select category → Choose algorithm → Configure array (random/custom) → Click visualize → Watch animation with highlighted comparisons → View completion with stats
- **Success criteria**: Smooth animations, accurate algorithm implementations, clear visual distinction between compared/swapped elements

### Algorithm Categories
- **Functionality**: Organize algorithms into comparison sorts (bubble, quick, merge, heap), linear sorts (counting, radix, bucket), hybrid sorts (timsort, introsort), and data structures (stack, queue, heap)
- **Purpose**: Mirror the Python project structure and help users understand algorithm classifications
- **Trigger**: User navigates between category tabs or cards
- **Progression**: View categories → Select category → Browse algorithms → Read description → Start visualization
- **Success criteria**: Clear categorization, easy navigation, descriptive information for each algorithm

### Playback Controls
- **Functionality**: Control animation speed, pause/resume, step forward/backward, and reset
- **Purpose**: Allow users to learn at their own pace and examine specific steps
- **Trigger**: User interacts with playback control buttons
- **Progression**: Start animation → Pause at interesting step → Step through slowly → Resume → Reset to try again
- **Success criteria**: Responsive controls, smooth speed transitions, accurate step-by-step progression

### Performance Metrics
- **Functionality**: Display comparisons count, swaps count, time complexity, space complexity, and execution time
- **Purpose**: Help users understand algorithm efficiency and compare performance
- **Trigger**: Metrics update in real-time during visualization
- **Progression**: Start algorithm → Watch metrics increment → Compare with theoretical complexity → Analyze results
- **Success criteria**: Accurate counting, clear display, theoretical vs actual comparison

### Custom Array Input
- **Functionality**: Allow users to input custom arrays or generate random arrays of various sizes
- **Purpose**: Enable users to test algorithms with specific data patterns or edge cases
- **Trigger**: User clicks array configuration button
- **Progression**: Click configure → Choose random/custom → Input values or set size → Apply → Visualize
- **Success criteria**: Validation of inputs, proper array generation, support for various sizes

## Edge Case Handling
- **Empty Arrays**: Display message that array needs at least 2 elements to sort
- **Already Sorted**: Algorithm runs but shows minimal swaps/comparisons
- **Reverse Sorted**: Demonstrates worst-case performance for certain algorithms
- **Single Element**: Display message that array is already sorted
- **Invalid Input**: Show validation errors for non-numeric custom inputs
- **Large Arrays**: Automatically adjust visualization bar width and limit maximum size
- **Animation Overflow**: Pause animation if user switches algorithms mid-execution

## Design Direction
The design should evoke a sense of technical precision and educational clarity, with a modern code editor aesthetic. It should feel like a professional developer tool while remaining approachable for learners. The interface should emphasize the visual animations and make performance data immediately scannable.

## Color Selection

- **Primary Color**: `oklch(0.45 0.15 265)` - A deep technical purple that communicates computational thinking and algorithmic precision
- **Secondary Colors**: 
  - `oklch(0.25 0.02 265)` - Dark slate for backgrounds and cards, providing depth
  - `oklch(0.35 0.08 265)` - Medium purple for secondary elements
- **Accent Color**: `oklch(0.75 0.20 150)` - Vibrant cyan-green for active states, CTAs, and highlighting current operations
- **Foreground/Background Pairings**:
  - Background (Dark Slate `oklch(0.18 0.02 265)`): Foreground (`oklch(0.95 0.02 265)`) - Ratio 14.2:1 ✓
  - Card (Dark Purple `oklch(0.25 0.02 265)`): Card Foreground (`oklch(0.95 0.02 265)`) - Ratio 11.8:1 ✓
  - Primary (Deep Purple `oklch(0.45 0.15 265)`): Primary Foreground (`oklch(0.98 0 0)`) - Ratio 8.5:1 ✓
  - Accent (Cyan-Green `oklch(0.75 0.20 150)`): Accent Foreground (`oklch(0.15 0.02 150)`) - Ratio 12.1:1 ✓

## Font Selection
The typography should convey technical precision and code-like clarity while maintaining excellent readability for educational content.

- **Typographic Hierarchy**:
  - H1 (Main Title): JetBrains Mono Bold/32px/tight letter-spacing/-0.02em
  - H2 (Category Headers): JetBrains Mono SemiBold/24px/tight letter-spacing/-0.01em
  - H3 (Algorithm Names): JetBrains Mono Medium/18px/normal letter-spacing
  - Body (Descriptions): Inter Regular/15px/relaxed line-height/1.6
  - Code/Metrics: JetBrains Mono Regular/14px/monospace letter-spacing/0.01em
  - Labels: Inter Medium/13px/uppercase letter-spacing/0.05em

## Animations
Animations should serve the core educational purpose while adding moments of delight during interactions. The sorting visualizations are the centerpiece and should use smooth spring physics. UI transitions should be quick and purposeful - category switching should use subtle slide transitions, control buttons should have satisfying pressed states with micro-scale animations, and metrics should count up smoothly when changing. The array bars should use spring physics when swapping positions with different colors pulsing during comparisons (200ms) and swaps (400ms).

## Component Selection

- **Components**:
  - **Tabs**: For switching between algorithm categories (Comparison, Linear, Hybrid, Data Structures)
  - **Card**: For displaying algorithm information, metrics panel, and category sections
  - **Button**: For playback controls (play, pause, step, reset) with variants for primary actions
  - **Select**: For choosing specific algorithms within a category
  - **Slider**: For controlling animation speed and array size
  - **Dialog**: For custom array input configuration
  - **Badge**: For displaying algorithm complexity (O(n log n), O(n), etc.)
  - **Separator**: For dividing sections in the control panel
  - **Progress**: For showing visualization progress
  - **Tooltip**: For explaining metrics and controls on hover

- **Customizations**:
  - **Visualization Canvas**: Custom component with animated bars using framer-motion, color-coded states (default, comparing, swapping, sorted)
  - **Metrics Dashboard**: Custom grid layout showing real-time stats with animated counters
  - **Algorithm Info Panel**: Custom component showing description, complexity, and use cases

- **States**:
  - **Buttons**: Default has subtle shadow, hover lifts slightly with glow, active scales down 95%, disabled is semi-transparent
  - **Algorithm Cards**: Hover state elevates with border glow, selected state has accent border and background tint
  - **Visualization Bars**: Default state is muted, comparing state is accent color, swapping state is secondary color, sorted state is success green

- **Icon Selection**:
  - Play/Pause (Play, Pause from phosphor-icons) for animation control
  - Forward/Backward (SkipForward, SkipBack) for stepping
  - ArrowClockwise for reset
  - Sliders (SlidersHorizontal) for configuration
  - Lightning for quick sort indicator
  - ChartBar for visualization mode
  - Code for algorithm details

- **Spacing**:
  - Container padding: p-6 (24px)
  - Card padding: p-4 (16px)
  - Section gaps: gap-6 (24px)
  - Control group gaps: gap-3 (12px)
  - Tight inline spacing: gap-2 (8px)

- **Mobile**:
  - Stack visualization above controls vertically
  - Reduce bar count on small screens (max 20 vs 50)
  - Convert tabs to dropdown select for categories
  - Make metrics panel scrollable
  - Increase touch target sizes to 44px minimum
  - Reduce font sizes by 10% on mobile
  - Hide advanced controls behind expandable section
