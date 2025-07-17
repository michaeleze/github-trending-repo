import type { Repository } from '@/types';

export interface BaseGridProps {
  repositories: Repository[];
  emptyMessage?: string;
}

export interface ToggleStarProps {
  onToggleStar: (repository: Repository) => void;
}

export type GridProps = BaseGridProps & ToggleStarProps;
