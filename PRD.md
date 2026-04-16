# Planning Guide

A professional code translation tool that converts TypeScript/Python sorting algorithms into optimized C++ (STL) and Java implementations, with an integrated configuration generator for sorter_factory.ts. Displays side-by-side comparisons with syntax highlighting, optimization notes, copy functionality, and an interactive web-based CLI tool for generating sorter_config.json files.

**Experience Qualities**:
1. **Professional** - Clean, technical interface that feels like a developer tool for production environments
2. **Interactive** - Users can configure their sorting avenue and generate configuration files with visual feedback
3. **Educational** - Clear documentation and examples help users understand translation patterns and configuration options

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This application requires multiple algorithm implementations, code translation display, configuration file generation with persistent state management, multiple tab views for different content types, and integration with the sorter_factory.ts system.

## Essential Features

### Configuration Generator
- **Functionality**: Interactive web-based form that mimics CLI behavior, allowing users to select their "avenue" (ai_high_performance or general_production) and generate a sorter_config.json file
- **Purpose**: Provide a user-friendly alternative to Node.js CLI for configuring sorter_factory.ts access
- **Trigger**: User navigates to "Translations" tab and selects an avenue option
- **Progression**: View avenue options → Select avenue (with descriptions and use cases) → Click generate → View JSON output → Download or copy configuration → Follow integration guide
- **Success criteria**: Radio button selection, visual feedback on selection, JSON generation with timestamp and metadata, download functionality, clipboard copy, persistent selection using useKV

### Code Translation Display
- **Functionality**: Side-by-side code comparison showing TypeScript source and optimized C++/Java target implementations with syntax highlighting
- **Purpose**: Help developers understand translation patterns and optimization techniques across languages
- **Trigger**: User switches between C++ Introsort and Java Timsort tabs
- **Progression**: Select translation tab → View source and target code → Read optimization notes → Copy code snippets → Review implementation examples
- **Success criteria**: Clear syntax highlighting, readable code blocks, copy functionality, optimization annotations, usage examples

## Edge Case Handling
- **No Avenue Selected**: Display disabled generate button and prompt user to select an avenue
- **Invalid Configuration**: Validate JSON structure before allowing download
- **Browser Compatibility**: Use standard Web APIs for clipboard and file download
- **Persistent State**: Save selected avenue using useKV for session continuity
- **Empty Translation Data**: Handle missing translation gracefully with fallback messages

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
  - **Tabs**: For switching between Configuration Generator, C++ Introsort, and Java Timsort views
  - **Card**: For displaying configuration forms, code blocks, avenue options, and implementation notes
  - **Button**: For generate, download, and copy actions with variants for primary actions
  - **RadioGroup**: For selecting avenue (ai_high_performance vs general_production)
  - **Badge**: For displaying available functions and algorithm complexity tags
  - **Separator**: For dividing sections in forms and content areas
  - **Label**: For form field labels with proper accessibility
  - **Tooltip**: For explaining configuration options and technical terms on hover

- **Customizations**:
  - **CodeBlock Component**: Displays syntax-highlighted code with copy functionality and language labels
  - **ConfigGenerator Component**: Interactive form with avenue selection, JSON preview, and download capabilities
  - **Avenue Selection Cards**: Clickable radio cards with hover states, descriptions, function lists, and use cases

- **States**:
  - **Buttons**: Default has subtle shadow, hover lifts with accent glow, active scales down 95%, disabled is semi-transparent with reduced opacity
  - **Avenue Cards**: Hover state adds accent border and background tint, selected state has accent border with shadow and checkmark icon
  - **Radio Buttons**: Selected shows filled accent circle, unselected shows empty circle with border
  - **Configuration Output**: Displays with monospace font in bordered container with copy and download actions

- **Icon Selection**:
  - Terminal (Terminal from phosphor-icons) for configuration and CLI concepts
  - Download (Download) for file download action
  - Copy (Copy) for clipboard operations
  - CheckCircle (CheckCircle) for selected state and success indicators
  - Code (Code) for code-related actions and headers
  - ArrowsLeftRight (ArrowsLeftRight) for translation/conversion concepts
  - GearSix (GearSix) for configuration settings

- **Spacing**:
  - Container padding: p-6 (24px)
  - Card padding: p-4 (16px)
  - Section gaps: gap-6 (24px)
  - Control group gaps: gap-3 (12px)
  - Tight inline spacing: gap-2 (8px)
  - Form field spacing: gap-4 (16px)

- **Mobile**:
  - Stack all content vertically on mobile
  - Full-width tabs converted to stacked buttons
  - Reduce card padding to p-3 on mobile
  - Make code blocks horizontally scrollable
  - Increase button touch targets to 44px minimum
  - Hide detailed descriptions behind expandable sections
  - Reduce font sizes by 10% on screens < 640px
