import type { Repository, SortKey } from '@/types';
import { sortByKey } from '@/utils/helpers';

/**
 * Custom hook for sorting repositories
 */
export const useSortRepositories = (
  repositories: Repository[],
  setRepositories: (repos: Repository[]) => void
) => {
  const sortRepositories = (key: SortKey) => {
    const sortedRepos = sortByKey(repositories, key);
    setRepositories(sortedRepos);
  };

  return sortRepositories;
};
