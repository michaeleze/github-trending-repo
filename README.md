# GitHub Trending Repositories

A modern React TypeScript application that displays GitHub's trending repositories from the past week. Users can view repository details, star repositories locally, search repositories, and filter them by programming language.

## Features

- View trending GitHub repositories from the past week
- Star repositories locally (stored in browser's local storage)
- View starred repositories in a separate tab
- Search repositories by name or description
- Filter repositories by programming language
- Responsive design with semantic HTML and accessibility features
- Light and dark theme support

## Tech Stack

- React 19 with TypeScript
- CSS Modules for styling
- Vite for fast development and building
- Fetch API for GitHub API requests
- Local Storage for persisting starred repositories and theme preferences
- Jest and React Testing Library for testing

## Project Structure

The project is organized into a clear, modular structure:

- **components/**: UI components organized by feature
  - **ui/**: Reusable UI components (StarButton, LanguageChip, StarCount, ThemeToggle)
  - **List/**: Repository list component
  - **ListItem/**: Individual repository item component
  - **TabLayout/**: Tab-based layout component
  - **SearchAndFilter/**: Search and filter controls
  - **LoadingState/**: Loading indicator component
  - **ErrorState/**: Error display component
- **app/**: Main application pages
- **context/**: React context providers
  - **app/**: Application state context
  - **theme/**: Theme management context
- **services/**: API and local storage services
- **hooks/**: Custom React hooks
- **types/**: TypeScript type definitions
- **constants/**: Application constants
- **utils/**: Utility functions

## Getting Started

### Prerequisites

- Node.js (v22.0.0 or later)
- npm or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

### Running the Application

```bash
pnpm dev
# or
npm run dev
```

This will start the development server at http://localhost:5173

### Building for Production

```bash
pnpm build
# or
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Running Tests

```bash
pnpm test
# or
npm run test
```

For test coverage:

```bash
pnpm test:coverage
# or
npm run test:coverage
```

## Path Aliases

This project uses path aliases to simplify imports. Instead of using relative paths like `../../../components/Button`, you can use the `@` alias:

```typescript
// Before: Using relative paths
import { Repository } from '../types/repository.type';
import { useFetchRepositories } from '../hooks/useFetchRepositories';

// After: Using path aliases
import { Repository } from '@/types/repository.type';
import { useFetchRepositories } from '@/hooks/useFetchRepositories';
```

Available alias:

- `@/*` → `src/*`

This makes imports cleaner and more maintainable, especially when working with deeply nested components.

## Code Principles

This project follows these principles:

- **Component-Based Architecture**: UI is broken down into reusable, composable components
- **Single Responsibility**: Each component and service has a single, well-defined purpose
- **DRY (Don't Repeat Yourself)**: Common functionality is extracted into reusable components, hooks, and services
- **Separation of Concerns**:
  - Data fetching logic is separated from UI components
  - API calls are made in hooks and services
  - Components receive data via props and context
- **Accessibility**: Semantic HTML elements and ARIA attributes for better screen reader support
- **Responsive Design**: Adapts to different screen sizes
- **Theme Support**: Light and dark mode with consistent styling

## License

MIT
