import type { ReactNode } from 'react';
import type { Repository, RepositoriesState, SortKey } from './repository.type';

export interface LoadingState {
  loading: boolean;
  error: string | null;
};

export interface RepositoryActions {
  toggleStar: (repository: Repository) => void;
  sortRepositories: (key: SortKey) => void;
}

export type RepositoriesContextType = RepositoriesState & LoadingState & RepositoryActions;

export interface RepositoriesProviderProps {
  children: ReactNode;
};

export type PartialRepositoriesContext = Partial<RepositoryActions> & RepositoriesState & LoadingState;
