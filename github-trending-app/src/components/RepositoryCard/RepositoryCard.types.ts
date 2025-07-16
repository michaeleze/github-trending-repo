import type { Repository } from '@/types';

export interface RepositoryCardProps {
  repository: Repository;
  onToggleStar: (repository: Repository) => void;
}