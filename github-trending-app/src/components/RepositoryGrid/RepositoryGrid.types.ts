import type { Repository, SortKey } from '@/types';

export interface BaseRepositoryListProps {
  repositories: Repository[];
  emptyMessage?: string;
}

export interface ToggleStarProps {
  onToggleStar: (repository: Repository) => void;
}

export interface SortableProps {
  onSort: (key: SortKey) => void;
}

export type RepositoryGridProps = BaseRepositoryListProps & ToggleStarProps & SortableProps;