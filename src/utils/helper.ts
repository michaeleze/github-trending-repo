import type { Repository } from "@/types";
import { localStorageService } from '@/services';

/**
 * Format a number with a 'k' suffix for thousands
 * @param count The number to format
 * @returns Formatted string
 */
export const formatStarCount = (count: number) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count;
};

/**
 * Truncate a string to a maximum length and add ellipsis if needed
 * @param text The string to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated string
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text?.substring(0, maxLength)}...`;
};

export const getFilteredRepositories = (
  repositories: Repository[],
  options: {
    searchTerm?: string;
    languageFilter?: string;
  } = {}
): Repository[] => {
  const { searchTerm, languageFilter } = options;
  let result = repositories;

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    const searchedResult =  result.filter(repo =>
      repo.name.toLowerCase().includes(term) ||
      repo.description?.toLowerCase().includes(term) ||
      repo.owner.login.toLowerCase().includes(term)
    );
    result = searchedResult;
  }

  if (languageFilter && languageFilter !== 'all') {
    const filteredResult = result.filter(repo =>
      repo.language?.toLowerCase() === languageFilter.toLowerCase()
    );
     result = filteredResult;
  }

  return result;
};

/**
 * Toggle star status of a repository
 * @param repository - Repository to toggle star status for
 * @param updateStarredRepositories - Function to update starred repositories state
 * @param updateAllRepositories - Function to update all repositories state
 * @returns Updated starred repositories array
 */
export const toggleRepositoryStar = async (
  repository: Repository,
  updateStarredRepositories?: (repos: Repository[]) => void,
  updateAllRepositories?: (updater: (repos: Repository[]) => Repository[]) => void
): Promise<Repository[]> => {
  const isCurrentlyStarred = localStorageService.isRepositoryStarred(repository.id);
  
  const updatedStarredRepos = isCurrentlyStarred
    ? localStorageService.removeStarredRepository(repository.id)
    : localStorageService.addStarredRepository(repository);

  // Update starred repositories state
  updateStarredRepositories?.(updatedStarredRepos);

  // Update all repositories state with new star status
  updateAllRepositories?.(currentRepos =>
    currentRepos.map(repo =>
      repo.id === repository.id
        ? { ...repo, isStarred: !isCurrentlyStarred }
        : repo
    )
  );

  return updatedStarredRepos;
};
