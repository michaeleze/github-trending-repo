# GitHub Trending Repositories

A React TypeScript application that displays GitHub's trending repositories from the past week. Users can view repository details, star repositories locally, and sort repositories by language or star count.

## Features

- View trending GitHub repositories from the past week
- Star repositories locally (stored in browser's local storage)
- View starred repositories in a separate tab
- Sort repositories by language or star count
- Responsive design using Material-UI components

## Tech Stack

- React with TypeScript
- Material-UI (MUI) for UI components
- Vite for fast development and building
- Axios for API requests
- Local Storage for persisting starred repositories

## Project Structure

The project follows the Atomic Design methodology for organizing components:

- **Atoms**: Basic building blocks (StarButton, LanguageChip, StarCount)
- **Molecules**: Groups of atoms (RepositoryCard, SortControl, LoadingState, ErrorState)
- **Organisms**: Groups of molecules (RepositoryGrid)
- **Templates**: Page layouts (TabLayout)
- **Pages**: Complete pages (RepositoriesPage)

Additional folders:
- **Services**: API and local storage services
- **Context**: State management
- **Types**: TypeScript interfaces

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

```bash
npm run dev
```

This will start the development server, typically at http://localhost:5173

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Path Aliases

This project uses path aliases to simplify imports. Instead of using relative paths like `../../../components/Button`, you can use aliases:

```typescript
// Before: Using relative paths
import { Repository } from '../types/repository.type';
import { useRepositoriesQuery } from '../hooks/useRepositoriesQuery';

// After: Using path aliases
import { Repository } from '@types/repository.type';
import { useRepositoriesQuery } from '@hooks/useRepositoriesQuery';
```

Available aliases:

- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@context/*` → `src/context/*`
- `@hooks/*` → `src/hooks/*`
- `@pages/*` → `src/pages/*`
- `@services/*` → `src/services/*`
- `@types/*` → `src/types/*`
- `@utils/*` → `src/utils/*`
- `@assets/*` → `src/assets/*`

## Code Principles

This project follows these principles:

- **SOLID**: Each component and service has a single responsibility
- **DRY (Don't Repeat Yourself)**: Common functionality is extracted into reusable components and services
- **Atomic Design**: Components are organized by complexity level
- **Separation of Concerns**: API calls are only made at the page level, components receive data via props
